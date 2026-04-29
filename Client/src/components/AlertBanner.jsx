/**
 * AlertBanner — CPU/System alert notification
 */
import React from "react";

export default function AlertBanner({ alert, onDismiss }) {
  if (!alert) return null;

  const isWarning = alert.type === "warning";
  const isDanger = alert.type === "danger";

  const colors = isDanger
    ? { bg: "rgba(255,71,87,0.12)", border: "rgba(255,71,87,0.35)", text: "#ff4757", icon: "⚠" }
    : isWarning
    ? { bg: "rgba(255,165,0,0.12)", border: "rgba(255,165,0,0.35)", text: "#ffa502", icon: "⚡" }
    : { bg: "rgba(61,158,255,0.12)", border: "rgba(61,158,255,0.35)", text: "#3d9eff", icon: "ℹ" };

  return (
    <div
      className="alert-slide fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-xl font-mono text-sm max-w-sm"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        color: colors.text,
        backdropFilter: "blur(12px)",
      }}
    >
      <span className="text-lg">{colors.icon}</span>
      <span className="flex-1">{alert.message}</span>
      <button
        onClick={onDismiss}
        className="text-xs opacity-50 hover:opacity-100 transition-opacity ml-2 font-bold"
        style={{ color: colors.text }}
      >
        ✕
      </button>
    </div>
  );
}
