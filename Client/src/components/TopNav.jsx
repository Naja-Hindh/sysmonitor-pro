/**
 * TopNav — Status bar at the top of the app
 */
import React from "react";
import { formatUptime } from "../utils/helpers";

export default function TopNav({ connected, systemData, isMockMode, onRefresh, onThemeToggle, theme }) {
  const uptime = systemData?.uptime;

  return (
    <header
      className="flex items-center justify-between px-6 py-3 flex-shrink-0"
      style={{
        background: "rgba(10, 14, 26, 0.8)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        height: "56px",
      }}
    >
      {/* Left: Connection status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="status-dot w-2 h-2 rounded-full"
            style={{ background: connected ? "#00ff88" : "#ff4757", boxShadow: connected ? "0 0 8px #00ff88" : "0 0 8px #ff4757" }}
          />
          <span className="text-xs font-mono" style={{ color: connected ? "#00ff88" : "#ff4757" }}>
            {connected ? "LIVE" : "OFFLINE"}
          </span>
        </div>

        {isMockMode && (
          <span
            className="text-xs font-mono px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,165,0,0.15)", color: "#ffa502", border: "1px solid rgba(255,165,0,0.3)" }}
          >
            MOCK MODE
          </span>
        )}
      </div>

      {/* Center: Uptime */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>UPTIME</span>
        <span className="text-sm font-mono text-white">{formatUptime(uptime)}</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Refresh button */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          ↺ REFRESH
        </button>

        {/* Theme toggle */}
        <button
          onClick={onThemeToggle}
          className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}
