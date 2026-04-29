/**
 * Sidebar — Main navigation for SysMonitor Pro
 */
import React from "react";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: "⬡" },
  { id: "processes", label: "Processes", icon: "◈" },
  { id: "settings", label: "Settings", icon: "◎" },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside
      className="flex flex-col h-screen w-60 flex-shrink-0 relative z-10"
      style={{
        background: "rgba(10, 14, 26, 0.9)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ background: "rgba(0,255,136,0.15)", border: "1px solid rgba(0,255,136,0.3)", color: "#00ff88" }}
        >
          ⬡
        </div>
        <div>
          <div className="font-display font-semibold text-sm text-white leading-tight">SysMonitor</div>
          <div className="text-xs font-mono" style={{ color: "#00ff88" }}>PRO</div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 mb-4" style={{ height: "1px", background: "rgba(255,255,255,0.06)" }} />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-1">
        <div className="text-xs font-mono mb-3 px-3" style={{ color: "rgba(255,255,255,0.2)" }}>NAVIGATION</div>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? "rgba(0,255,136,0.1)" : "transparent",
                color: isActive ? "#00ff88" : "rgba(255,255,255,0.5)",
                border: isActive ? "1px solid rgba(0,255,136,0.2)" : "1px solid transparent",
              }}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="font-sans">{item.label}</span>
              {isActive && (
                <span
                  className="ml-auto w-1.5 h-1.5 rounded-full"
                  style={{ background: "#00ff88", boxShadow: "0 0 6px #00ff88" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom info */}
      <div
        className="mx-4 mb-6 p-3 rounded-xl text-xs font-mono"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}
      >
        <div className="text-white/50 font-sans text-xs mb-1">Version</div>
        <div>v1.0.0</div>
        <div className="mt-1 text-white/50 font-sans">Academic Project</div>
      </div>
    </aside>
  );
}
