/**
 * useSocket — Connects to the Socket.io backend and streams system data
 * Falls back gracefully if the server is unreachable
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { io } from "socket.io-client";

const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";
const CPU_HISTORY_LENGTH = 30; // Keep last 30 seconds

export function useSocket() {
  const [connected, setConnected] = useState(false);
  const [systemData, setSystemData] = useState(null);
  const [cpuHistory, setCpuHistory] = useState([]);
  const [alert, setAlert] = useState(null);
  const [isMockMode, setIsMockMode] = useState(false);
  const socketRef = useRef(null);
  const alertTimeoutRef = useRef(null);

  // Show alert, auto-dismiss after 5s
  const triggerAlert = useCallback((message, type = "warning") => {
    setAlert({ message, type });
    clearTimeout(alertTimeoutRef.current);
    alertTimeoutRef.current = setTimeout(() => setAlert(null), 5000);
  }, []);

  const requestRefresh = useCallback(() => {
    socketRef.current?.emit("request-refresh");
  }, []);

  useEffect(() => {
    const socket = io(SERVER_URL, {
      reconnectionAttempts: 5,
      timeout: 3000,
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      setConnected(true);
      console.log("✅ Socket connected");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.warn("⚠️ Socket disconnected");
    });

    socket.on("connect_error", () => {
      setConnected(false);
      console.error("❌ Cannot reach server — check backend is running");
    });

    socket.on("system-data", (data) => {
      setSystemData(data);
      setIsMockMode(data.isMock || false);

      // Update CPU history
      const now = new Date();
      const timeLabel = `${now.getHours()}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      setCpuHistory((prev) => {
        const updated = [...prev, { time: timeLabel, cpu: data.cpu.currentLoad }];
        return updated.slice(-CPU_HISTORY_LENGTH);
      });

      // CPU alert
      if (data.cpu.currentLoad > 80) {
        triggerAlert(`⚠️ High CPU usage: ${data.cpu.currentLoad.toFixed(1)}%`, "danger");
      }
    });

    return () => {
      socket.disconnect();
      clearTimeout(alertTimeoutRef.current);
    };
  }, [triggerAlert]);

  return { connected, systemData, cpuHistory, alert, setAlert, isMockMode, requestRefresh };
}
