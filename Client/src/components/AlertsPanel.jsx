/**
 * AlertsPanel — Full alert history log with filters and clear button
 */
import React, { useState } from "react";

const TYPE_STYLES = {
  critical: { dot: "#ff4757", bg: "rgba(255,71,87,0.08)",  border: "rgba(255,71,87,0.2)",  text: "#ff4757", label: "CRITICAL" },
  warning:  { dot: "#ffa502", bg: "rgba(255,165,0,0.08)",  border: "rgba(255,165,0,0.2)",  text: "#ffa502", label: "WARNING"  },
  info:     { dot: "#3d9eff", bg: "rgba(61,158,255,0.08)", border: "rgba(61,158,255,0.2)", text: "#3d9eff", label: "INFO"     },
};

function fmt(ts) {
  if (!ts) return "";
  const d = new Date(ts);
  return `${d.toLocaleDateString()} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}:${String(d.getSeconds()).padStart(2,"0")}`;
}

export default function AlertsPanel({
  alertHistory,
  unreadAlerts,
  onMarkAllRead,
  onClearHistory,
}) {
  const [filter, setFilter] = useState("all"); // all | critical | warning

  const filtered = alertHistory.filter((a) =>
    filter === "all" ? true : a.type === filter
  );

  const critCount = alertHistory.filter((a) => a.type === "critical").length;
  const warnCount = alertHistory.filter((a) => a.type === "warning").length;

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      {/* Page title */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-white">Alert Center</h1>
          <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            System threshold notifications — CPU &amp; Memory
          </p>
        </div>
        {unreadAlerts > 0 && (
          <span
            className="px-3 py-1 rounded-full text-xs font-mono font-bold"
            style={{ background: "rgba(255,71,87,0.15)", color: "#ff4757", border: "1px solid rgba(255,71,87,0.3)" }}
          >
            {unreadAlerts} UNREAD
          </span>
        )}
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "TOTAL",    value: alertHistory.length, color: "#3d9eff" },
          { label: "CRITICAL", value: critCount,           color: "#ff4757" },
          { label: "WARNING",  value: warnCount,           color: "#ffa502" },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4 text-center">
            <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              {s.label}
            </div>
            <div className="text-3xl font-display font-semibold" style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Filter + action bar */}
      <div className="flex items-center justify-between">
        {/* Filter tabs */}
        <div className="flex gap-2">
          {["all", "critical", "warning"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-150"
              style={{
                background: filter === f ? "rgba(0,255,136,0.12)" : "rgba(255,255,255,0.05)",
                border:     `1px solid ${filter === f ? "rgba(0,255,136,0.35)" : "rgba(255,255,255,0.08)"}`,
                color:      filter === f ? "#00ff88" : "rgba(255,255,255,0.4)",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {unreadAlerts > 0 && (
            <button
              onClick={onMarkAllRead}
              className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 hover:scale-105"
              style={{
                background: "rgba(61,158,255,0.1)",
                border:     "1px solid rgba(61,158,255,0.25)",
                color:      "#3d9eff",
              }}
            >
              ✓ Mark all read
            </button>
          )}
          {alertHistory.length > 0 && (
            <button
              onClick={onClearHistory}
              className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-150 hover:scale-105"
              style={{
                background: "rgba(255,71,87,0.08)",
                border:     "1px solid rgba(255,71,87,0.2)",
                color:      "#ff4757",
              }}
            >
              🗑 Clear all
            </button>
          )}
        </div>
      </div>

      {/* Alert log */}
      <div className="glass-card overflow-hidden">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-4xl">✅</span>
            <p className="font-mono text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>
              No {filter !== "all" ? filter : ""} alerts
            </p>
            <p className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              System is running within normal thresholds
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            {filtered.map((a) => {
              const s = TYPE_STYLES[a.type] || TYPE_STYLES.info;
              return (
                <div
                  key={a.id}
                  className="flex items-start gap-4 px-5 py-4 transition-colors duration-150"
                  style={{
                    background: !a.read ? s.bg : "transparent",
                    borderLeft: !a.read ? `3px solid ${s.dot}` : "3px solid transparent",
                  }}
                >
                  {/* Dot */}
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{
                      background: s.dot,
                      boxShadow:  !a.read ? `0 0 8px ${s.dot}` : "none",
                    }}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-xs font-mono font-bold tracking-widest"
                        style={{ color: s.text }}
                      >
                        {s.label}
                      </span>
                      {!a.read && (
                        <span
                          className="text-xs font-mono px-1.5 py-0.5 rounded-full"
                          style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
                        >
                          NEW
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-mono leading-snug" style={{ color: "rgba(255,255,255,0.8)" }}>
                      {a.message}
                    </p>
                    {/* Value bar */}
                    {a.value != null && (
                      <div className="mt-2 flex items-center gap-2">
                        <div
                          className="h-1 flex-1 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.08)", maxWidth: "120px" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${Math.min(100, a.value)}%`, background: s.dot }}
                          />
                        </div>
                        <span className="text-xs font-mono" style={{ color: s.text }}>
                          {a.value.toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-xs font-mono flex-shrink-0" style={{ color: "rgba(255,255,255,0.25)" }}>
                    {fmt(a.timestamp)}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
