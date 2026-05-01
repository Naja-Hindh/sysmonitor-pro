/**
 * AlertBanner — Toast notification that slides in from top-right
 * Shows for CPU critical/warning and memory critical/warning alerts
 */
import React, { useEffect, useState } from "react";

const TYPE_STYLES = {
  critical: {
    bg:     "rgba(255,71,87,0.14)",
    border: "rgba(255,71,87,0.45)",
    text:   "#ff4757",
    bar:    "#ff4757",
    icon:   "🔴",
    label:  "CRITICAL",
  },
  warning: {
    bg:     "rgba(255,165,0,0.14)",
    border: "rgba(255,165,0,0.45)",
    text:   "#ffa502",
    bar:    "#ffa502",
    icon:   "🟡",
    label:  "WARNING",
  },
  info: {
    bg:     "rgba(61,158,255,0.14)",
    border: "rgba(61,158,255,0.45)",
    text:   "#3d9eff",
    bar:    "#3d9eff",
    icon:   "ℹ️",
    label:  "INFO",
  },
};

export default function AlertBanner({ alert, onDismiss }) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!alert) { setVisible(false); return; }
    setVisible(true);
    setProgress(100);

    // Countdown progress bar over 6 seconds
    const start = Date.now();
    const duration = 6000;
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(pct);
      if (pct === 0) clearInterval(tick);
    }, 50);

    return () => clearInterval(tick);
  }, [alert]);

  if (!alert || !visible) return null;

  const s = TYPE_STYLES[alert.type] || TYPE_STYLES.info;
  const time = alert.timestamp
    ? `${String(alert.timestamp.getHours()).padStart(2,"0")}:${String(alert.timestamp.getMinutes()).padStart(2,"0")}:${String(alert.timestamp.getSeconds()).padStart(2,"0")}`
    : "";

  return (
    <div
      className="alert-slide fixed z-50 overflow-hidden"
      style={{
        top: "68px",
        right: "16px",
        width: "340px",
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: "14px",
        backdropFilter: "blur(16px)",
        boxShadow: `0 8px 32px ${s.border}`,
      }}
    >
      {/* Auto-dismiss progress bar at top */}
      <div style={{ height: "3px", background: "rgba(255,255,255,0.08)" }}>
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: s.bar,
            transition: "width 0.05s linear",
            boxShadow: `0 0 8px ${s.bar}`,
          }}
        />
      </div>

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-base">{s.icon}</span>
            <span
              className="text-xs font-mono font-bold tracking-widest"
              style={{ color: s.text }}
            >
              {s.label}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>
              {time}
            </span>
            <button
              onClick={onDismiss}
              className="text-xs font-bold transition-opacity hover:opacity-100"
              style={{ color: "rgba(255,255,255,0.35)" }}
            >
              ✕
            </button>
          </div>
        </div>

        {/* Message */}
        <p className="text-sm font-mono leading-snug" style={{ color: "rgba(255,255,255,0.85)" }}>
          {alert.message}
        </p>

        {/* Value bar (if numeric value present) */}
        {alert.value != null && (
          <div className="mt-3">
            <div
              className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: "rgba(255,255,255,0.08)" }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.min(100, alert.value)}%`,
                  background: `linear-gradient(90deg, ${s.bar}88, ${s.bar})`,
                  boxShadow: `0 0 8px ${s.bar}`,
                  transition: "width 0.5s ease",
                }}
              />
            </div>
            <div className="text-right mt-1">
              <span className="text-xs font-mono" style={{ color: s.text }}>
                {alert.value.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
