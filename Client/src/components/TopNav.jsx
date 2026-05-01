/**
 * TopNav — Status bar with LIVE/PAUSE, alerts bell, refresh, theme
 */
import React from "react";
import { formatUptime } from "../utils/helpers";

export default function TopNav({
  connected, systemData, isMockMode,
  onRefresh, onThemeToggle, theme,
  isLive, onToggleLive,
  unreadAlerts, onAlertsClick,
}) {
  const uptime = systemData?.uptime;

  return (
    <header
      className="flex items-center justify-between px-6 py-3 flex-shrink-0"
      style={{
        background:   "rgba(10, 14, 26, 0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
        height: "56px",
      }}
    >
      {/* Left */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div
            className="status-dot w-2 h-2 rounded-full"
            style={{
              background: connected ? "#00ff88" : "#ff4757",
              boxShadow:  connected ? "0 0 8px #00ff88" : "0 0 8px #ff4757",
            }}
          />
          <span className="text-xs font-mono" style={{ color: connected ? "#00ff88" : "#ff4757" }}>
            {connected ? "CONNECTED" : "OFFLINE"}
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

      {/* Center */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>UPTIME</span>
        <span className="text-sm font-mono text-white">{formatUptime(uptime)}</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* LIVE / PAUSE */}
        <button
          onClick={onToggleLive}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all duration-200 hover:scale-105 select-none"
          style={
            isLive
              ? { background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.4)", color: "#00ff88" }
              : { background: "rgba(255,165,0,0.15)",  border: "1px solid rgba(255,165,0,0.4)",  color: "#ffa502" }
          }
          title={isLive ? "Pause live updates" : "Resume live updates"}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isLive ? "#00ff88" : "#ffa502",
              boxShadow:  isLive ? "0 0 6px #00ff88" : "none",
              animation:  isLive ? "dotPulse 1.5s ease-in-out infinite" : "none",
            }}
          />
          {isLive ? "LIVE" : "PAUSED"}
        </button>

        {/* Alerts bell */}
        <button
          onClick={onAlertsClick}
          className="relative px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 hover:scale-105"
          style={{
            background: unreadAlerts > 0 ? "rgba(255,71,87,0.12)" : "rgba(255,255,255,0.06)",
            border:     `1px solid ${unreadAlerts > 0 ? "rgba(255,71,87,0.35)" : "rgba(255,255,255,0.1)"}`,
            color:      unreadAlerts > 0 ? "#ff4757" : "rgba(255,255,255,0.6)",
          }}
          title="View alerts"
        >
          🔔
          {unreadAlerts > 0 && (
            <span
              className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
              style={{ background: "#ff4757", color: "#fff", fontSize: "9px" }}
            >
              {unreadAlerts > 9 ? "9+" : unreadAlerts}
            </span>
          )}
        </button>

        {/* Refresh */}
        <button
          onClick={onRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.06)",
            border:     "1px solid rgba(255,255,255,0.1)",
            color:      "rgba(255,255,255,0.6)",
          }}
          title="Refresh now"
        >
          ↺ REFRESH
        </button>

        {/* Theme */}
        <button
          onClick={onThemeToggle}
          className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all duration-200 hover:scale-105"
          style={{
            background: "rgba(255,255,255,0.06)",
            border:     "1px solid rgba(255,255,255,0.1)",
            color:      "rgba(255,255,255,0.6)",
          }}
        >
          {theme === "dark" ? "☀" : "☾"}
        </button>
      </div>
    </header>
  );
}
