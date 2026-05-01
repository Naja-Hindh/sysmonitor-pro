/**
 * useSocket — Real-time data + full alert system
 * Alerts: CPU threshold, Memory threshold, alert history log, cooldown logic
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
const CPU_HISTORY_LENGTH = 30;

// Default alert thresholds (user can change in Settings)
export const DEFAULT_THRESHOLDS = {
  cpuWarning:  60,   // amber warning
  cpuCritical: 80,   // red critical
  memWarning:  70,
  memCritical: 85,
};

// How many seconds to wait before re-firing the same alert
const ALERT_COOLDOWN_SEC = 15;

let alertIdCounter = 0;
function makeAlertId() { return ++alertIdCounter; }

export function useSocket() {
  const [connected,   setConnected]   = useState(false);
  const [systemData,  setSystemData]  = useState(null);
  const [cpuHistory,  setCpuHistory]  = useState([]);
  const [isMockMode,  setIsMockMode]  = useState(false);

  // Live / Pause
  const [isLive,   setIsLive]   = useState(true);
  const isLiveRef  = useRef(true);

  // ── Toast alert (single banner shown at top-right) ───────────────────────
  const [toastAlert, setToastAlert] = useState(null);
  const toastTimerRef = useRef(null);

  // ── Alert history (persistent log shown in Alerts panel) ─────────────────
  const [alertHistory, setAlertHistory] = useState([]);

  // ── User-configurable thresholds ─────────────────────────────────────────
  const [thresholds, setThresholds] = useState(() => {
    try {
      const saved = localStorage.getItem("sysmonitor_thresholds");
      return saved ? JSON.parse(saved) : DEFAULT_THRESHOLDS;
    } catch { return DEFAULT_THRESHOLDS; }
  });

  const updateThresholds = useCallback((newT) => {
    setThresholds(newT);
    try { localStorage.setItem("sysmonitor_thresholds", JSON.stringify(newT)); } catch {}
  }, []);

  // cooldown tracking — key: "cpu_critical" | "cpu_warning" | "mem_critical" | "mem_warning"
  const lastAlertTime = useRef({});

  const socketRef      = useRef(null);

  // ── Unread badge count ────────────────────────────────────────────────────
  const [unreadAlerts, setUnreadAlerts] = useState(0);
  const clearUnread = useCallback(() => setUnreadAlerts(0), []);

  // ── Fire an alert ─────────────────────────────────────────────────────────
  const fireAlert = useCallback((key, message, type, value) => {
    const now = Date.now();
    const last = lastAlertTime.current[key] || 0;
    if (now - last < ALERT_COOLDOWN_SEC * 1000) return; // still in cooldown
    lastAlertTime.current[key] = now;

    const entry = {
      id:        makeAlertId(),
      key,
      message,
      type,       // "critical" | "warning" | "info"
      value,
      timestamp:  new Date(),
      read:       false,
    };

    // Add to history (keep last 50)
    setAlertHistory((prev) => [entry, ...prev].slice(0, 50));
    setUnreadAlerts((prev) => prev + 1);

    // Show toast
    setToastAlert(entry);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToastAlert(null), 6000);

    // Browser notification (if permission granted)
    if (typeof window !== "undefined" && window.Notification?.permission === "granted") {
      try {
        new window.Notification("SysMonitor Pro Alert", {
          body: message,
          icon: "/favicon.ico",
          tag:  key, // replaces previous same-key notification
        });
      } catch {}
    }

    // Audio beep via Web Audio API
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = type === "critical" ? 880 : 660;
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.4);
    } catch {}
  }, []);

  // ── Dismiss toast ────────────────────────────────────────────────────────
  const dismissToast = useCallback(() => {
    setToastAlert(null);
    clearTimeout(toastTimerRef.current);
  }, []);

  // ── Mark all history as read ─────────────────────────────────────────────
  const markAllRead = useCallback(() => {
    setAlertHistory((prev) => prev.map((a) => ({ ...a, read: true })));
    clearUnread();
  }, [clearUnread]);

  // ── Clear history ────────────────────────────────────────────────────────
  const clearAlertHistory = useCallback(() => {
    setAlertHistory([]);
    clearUnread();
  }, [clearUnread]);

  // ── Toggle live/pause ────────────────────────────────────────────────────
  const toggleLive = useCallback(() => {
    setIsLive((prev) => {
      const next = !prev;
      isLiveRef.current = next;
      return next;
    });
  }, []);

  const requestRefresh = useCallback(() => {
    isLiveRef.current = true;
    setIsLive(true);
    socketRef.current?.emit("request-refresh");
  }, []);

  // ── Request browser notification permission on mount ─────────────────────
  useEffect(() => {
    if (typeof window !== "undefined" && window.Notification &&
        window.Notification.permission === "default") {
      window.Notification.requestPermission();
    }
  }, []);

  // ── Socket connection ────────────────────────────────────────────────────
  useEffect(() => {
    const socket = io(SERVER_URL, {
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 5000,
    });
    socketRef.current = socket;

    socket.on("connect",       () => setConnected(true));
    socket.on("disconnect",    () => setConnected(false));
    socket.on("connect_error", () => setConnected(false));

    socket.on("system-data", (data) => {
      if (!isLiveRef.current) return;

      setSystemData(data);
      setIsMockMode(data.isMock || false);

      // CPU history
      const now = new Date();
      const label = `${now.getHours()}:${String(now.getMinutes()).padStart(2,"0")}:${String(now.getSeconds()).padStart(2,"0")}`;
      setCpuHistory((prev) =>
        [...prev, { time: label, cpu: data.cpu.currentLoad }].slice(-CPU_HISTORY_LENGTH)
      );

      const cpu = data.cpu.currentLoad;
      const memPct = (data.memory.used / data.memory.total) * 100;

      // Use thresholds from ref so we always have latest value inside this closure
      const t = thresholdsRef.current;

      // ── CPU alerts ──────────────────────────────────────────────────────
      if (cpu >= t.cpuCritical) {
        fireAlert(
          "cpu_critical",
          `🔴 CRITICAL: CPU at ${cpu.toFixed(1)}% — exceeds ${t.cpuCritical}% threshold`,
          "critical", cpu
        );
      } else if (cpu >= t.cpuWarning) {
        fireAlert(
          "cpu_warning",
          `🟡 WARNING: CPU at ${cpu.toFixed(1)}% — exceeds ${t.cpuWarning}% threshold`,
          "warning", cpu
        );
      }

      // ── Memory alerts ────────────────────────────────────────────────────
      if (memPct >= t.memCritical) {
        fireAlert(
          "mem_critical",
          `🔴 CRITICAL: Memory at ${memPct.toFixed(1)}% — exceeds ${t.memCritical}% threshold`,
          "critical", memPct
        );
      } else if (memPct >= t.memWarning) {
        fireAlert(
          "mem_warning",
          `🟡 WARNING: Memory at ${memPct.toFixed(1)}% — exceeds ${t.memWarning}% threshold`,
          "warning", memPct
        );
      }
    });

    return () => {
      socket.disconnect();
      clearTimeout(toastTimerRef.current);
    };
  }, [fireAlert]); // eslint-disable-line

  // Keep thresholds in a ref so socket handler always sees latest value
  const thresholdsRef = useRef(thresholds);
  useEffect(() => { thresholdsRef.current = thresholds; }, [thresholds]);

  return {
    connected, systemData, cpuHistory, isMockMode,
    isLive, toggleLive, requestRefresh,
    toastAlert, dismissToast,
    alertHistory, unreadAlerts, clearUnread, markAllRead, clearAlertHistory,
    thresholds, updateThresholds,
  };
}
