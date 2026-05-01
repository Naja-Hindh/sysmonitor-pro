/**
 * Settings — Config, threshold editor, project info
 */
import React, { useState } from "react";
import { DEFAULT_THRESHOLDS } from "../hooks/useSocket";

const INFO_ROWS = [
  ["Project",  "SysMonitor Pro"],
  ["Version",  "2.0.0"],
  ["Author",   "Academic Project"],
  ["Stack",    "React + Node.js + Socket.io"],
  ["Charts",   "Recharts"],
  ["Styling",  "Tailwind CSS"],
];

function ThresholdSlider({ label, value, min, max, color, onChange }) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-mono" style={{ color: "rgba(255,255,255,0.7)" }}>{label}</span>
        <span className="text-sm font-mono font-bold" style={{ color }}>{value}%</span>
      </div>
      <div className="relative">
        <input
          type="range" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, ${color} ${((value-min)/(max-min))*100}%, rgba(255,255,255,0.1) ${((value-min)/(max-min))*100}%)`,
            accentColor: color,
          }}
        />
      </div>
    </div>
  );
}

export default function Settings({ isMockMode, thresholds, onUpdateThresholds }) {
  const [local, setLocal] = useState(thresholds);
  const [saved, setSaved]   = useState(false);

  const update = (key, val) => setLocal((p) => ({ ...p, [key]: val }));

  const handleSave = () => {
    onUpdateThresholds(local);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setLocal(DEFAULT_THRESHOLDS);
    onUpdateThresholds(DEFAULT_THRESHOLDS);
  };

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Settings</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          Alert thresholds, configuration, and project info
        </p>
      </div>

      {/* ── Alert Threshold Config ── */}
      <div className="glass-card p-5">
        <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.3)" }}>
          ALERT THRESHOLDS
        </div>
        <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>
          Alerts fire when usage crosses these levels. A 15-second cooldown prevents spam.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CPU */}
          <div
            className="p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">⬡</span>
              <span className="text-sm font-mono font-bold text-white">CPU Thresholds</span>
            </div>
            <ThresholdSlider
              label="Warning level"
              value={local.cpuWarning}
              min={10} max={90}
              color="#ffa502"
              onChange={(v) => update("cpuWarning", Math.min(v, local.cpuCritical - 5))}
            />
            <ThresholdSlider
              label="Critical level"
              value={local.cpuCritical}
              min={20} max={99}
              color="#ff4757"
              onChange={(v) => update("cpuCritical", Math.max(v, local.cpuWarning + 5))}
            />
          </div>

          {/* Memory */}
          <div
            className="p-4 rounded-xl"
            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">◈</span>
              <span className="text-sm font-mono font-bold text-white">Memory Thresholds</span>
            </div>
            <ThresholdSlider
              label="Warning level"
              value={local.memWarning}
              min={10} max={90}
              color="#ffa502"
              onChange={(v) => update("memWarning", Math.min(v, local.memCritical - 5))}
            />
            <ThresholdSlider
              label="Critical level"
              value={local.memCritical}
              min={20} max={99}
              color="#ff4757"
              onChange={(v) => update("memCritical", Math.max(v, local.memWarning + 5))}
            />
          </div>
        </div>

        {/* Preview */}
        <div
          className="mt-4 p-3 rounded-xl text-xs font-mono"
          style={{ background: "rgba(0,255,136,0.04)", border: "1px solid rgba(0,255,136,0.1)" }}
        >
          <span style={{ color: "rgba(255,255,255,0.4)" }}>Current config: </span>
          <span style={{ color: "#ffa502" }}>CPU warn ≥{local.cpuWarning}% </span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>/ </span>
          <span style={{ color: "#ff4757" }}>crit ≥{local.cpuCritical}% </span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>| </span>
          <span style={{ color: "#ffa502" }}>MEM warn ≥{local.memWarning}% </span>
          <span style={{ color: "rgba(255,255,255,0.3)" }}>/ </span>
          <span style={{ color: "#ff4757" }}>crit ≥{local.memCritical}%</span>
        </div>

        {/* Save / Reset */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleSave}
            className="px-5 py-2 rounded-xl text-sm font-mono font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: saved ? "rgba(0,255,136,0.2)" : "rgba(0,255,136,0.12)",
              border:     `1px solid ${saved ? "rgba(0,255,136,0.5)" : "rgba(0,255,136,0.3)"}`,
              color:      "#00ff88",
            }}
          >
            {saved ? "✓ Saved!" : "Save thresholds"}
          </button>
          <button
            onClick={handleReset}
            className="px-5 py-2 rounded-xl text-sm font-mono transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.05)",
              border:     "1px solid rgba(255,255,255,0.1)",
              color:      "rgba(255,255,255,0.5)",
            }}
          >
            Reset defaults
          </button>
        </div>
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
                ? "systeminformation unavailable — using mock data"
                : "Reading real system metrics via systeminformation"}
            </div>
          </div>
        </div>
      </div>

      {/* Project info */}
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

      {/* Architecture */}
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
    │  ├─ Alert detection (CPU/Mem thresholds)
    │  └─ systeminformation
    │
OS / System Kernel`}
        </pre>
      </div>
    </div>
  );
}
