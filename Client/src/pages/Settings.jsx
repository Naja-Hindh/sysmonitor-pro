/**
 * Settings page
 */
import React from "react";

const INFO_ROWS = [
  ["Project", "SysMonitor Pro"],
  ["Version", "1.0.0"],
  ["Author", "Academic Project"],
  ["Stack", "React + Node.js + Socket.io"],
  ["Charts", "Recharts"],
  ["Styling", "Tailwind CSS"],
];

export default function Settings({ isMockMode }) {
  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          Configuration and project info
        </p>
      </div>

      {/* Data mode */}
      <div className="glass-card p-5">
        <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
          DATA MODE
        </div>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
            style={{
              background: isMockMode ? "rgba(255,165,0,0.15)" : "rgba(0,255,136,0.15)",
              border: `1px solid ${isMockMode ? "rgba(255,165,0,0.3)" : "rgba(0,255,136,0.3)"}`,
            }}
          >
            {isMockMode ? "⚙" : "◉"}
          </div>
          <div>
            <div className="font-semibold text-white mb-0.5">
              {isMockMode ? "Simulated Data Mode" : "Live System Mode"}
            </div>
            <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
              {isMockMode
                ? "systeminformation not available — using mock data"
                : "Reading real system metrics via systeminformation"}
            </div>
          </div>
        </div>
      </div>

      {/* Project Info */}
      <div className="glass-card p-5">
        <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
          PROJECT INFO
        </div>
        <div className="space-y-3">
          {INFO_ROWS.map(([label, value]) => (
            <div key={label} className="flex items-center justify-between">
              <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.35)" }}>{label}</span>
              <span className="text-sm font-mono text-white">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tech Stack */}
      <div className="glass-card p-5">
        <div className="text-xs font-mono uppercase tracking-widest mb-4" style={{ color: "rgba(255,255,255,0.3)" }}>
          ARCHITECTURE
        </div>
        <pre
          className="text-xs font-mono leading-relaxed"
          style={{ color: "rgba(0,255,136,0.8)", background: "rgba(0,255,136,0.04)", padding: "12px", borderRadius: "8px" }}
        >
{`Browser (React)
    │
    │  WebSocket (Socket.io)
    │
Express Server (Node.js)
    │
    │  systeminformation
    │
OS / System Kernel`}
        </pre>
      </div>
    </div>
  );
}
