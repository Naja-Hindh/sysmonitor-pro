/**
 * StatCard — Metric card with alert-aware glow and progress bar
 */
import React from "react";
import { getStatusColor } from "../utils/helpers";

function SkeletonCard() {
  return (
    <div className="glass-card p-5">
      <div className="skeleton h-3 w-20 mb-4 rounded" />
      <div className="skeleton h-8 w-28 mb-3 rounded" />
      <div className="skeleton h-2 w-full rounded-full" />
    </div>
  );
}

export function StatCard({ label, value, subtitle, percent, icon, accentColor, alertStatus, delay = 0 }) {
  const color = accentColor || (percent != null ? getStatusColor(percent) : "#3d9eff");

  // Glow effect based on alert status
  const glowStyle =
    alertStatus === "critical"
      ? { boxShadow: "0 0 24px rgba(255,71,87,0.25)", borderColor: "rgba(255,71,87,0.35)" }
      : alertStatus === "warning"
      ? { boxShadow: "0 0 24px rgba(255,165,0,0.2)", borderColor: "rgba(255,165,0,0.3)" }
      : {};

  return (
    <div
      className="glass-card p-5 animate-fadeInUp hover:scale-[1.01] transition-all duration-200"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both", ...glowStyle }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.35)" }}>
          {label}
        </span>
        <div className="flex items-center gap-2">
          {alertStatus && alertStatus !== "ok" && (
            <span
              className="text-xs font-mono px-1.5 py-0.5 rounded-full"
              style={{
                background: alertStatus === "critical" ? "rgba(255,71,87,0.15)" : "rgba(255,165,0,0.15)",
                color:      alertStatus === "critical" ? "#ff4757" : "#ffa502",
                border:     `1px solid ${alertStatus === "critical" ? "rgba(255,71,87,0.3)" : "rgba(255,165,0,0.3)"}`,
                animation:  "dotPulse 2s ease-in-out infinite",
              }}
            >
              {alertStatus === "critical" ? "CRIT" : "WARN"}
            </span>
          )}
          <span className="text-lg">{icon}</span>
        </div>
      </div>

      {/* Value */}
      <div className="mb-1">
        <span className="text-3xl font-display font-semibold text-white">{value}</span>
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div className="text-xs font-mono mb-3" style={{ color: "rgba(255,255,255,0.35)" }}>
          {subtitle}
        </div>
      )}

      {/* Progress bar */}
      {percent != null && (
        <div className="mt-3">
          <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
            <div
              className="h-full rounded-full progress-bar-animated"
              style={{
                width:      `${Math.min(100, percent)}%`,
                background: `linear-gradient(90deg, ${color}99, ${color})`,
                boxShadow:  `0 0 8px ${color}66`,
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>0%</span>
            <span className="text-xs font-mono" style={{ color }}>{percent.toFixed(1)}%</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function StatCardSkeleton() { return <SkeletonCard />; }
