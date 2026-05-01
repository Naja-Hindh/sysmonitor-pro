/**
 * Sidebar — Main navigation with unread alert badge
 */
import React from "react";

export default function Sidebar({ activePage, setActivePage, unreadAlerts }) {
  const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard",   icon: "⬡" },
    { id: "processes", label: "Processes",   icon: "◈" },
    { id: "alerts",    label: "Alerts",      icon: "◉", badge: unreadAlerts },
    { id: "settings",  label: "Settings",    icon: "◎" },
  ];

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
        <div className="text-xs font-mono mb-3 px-3" style={{ color: "rgba(255,255,255,0.2)" }}>
          NAVIGATION
        </div>
        {NAV_ITEMS.map((item) => {
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: isActive ? "rgba(0,255,136,0.1)" : "transparent",
                color:      isActive ? "#00ff88" : "rgba(255,255,255,0.5)",
                border:     isActive ? "1px solid rgba(0,255,136,0.2)" : "1px solid transparent",
              }}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="font-sans flex-1 text-left">{item.label}</span>

              {/* Unread badge */}
              {item.badge > 0 && (
                <span
                  className="text-xs font-mono font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
                  style={{
                    background: "rgba(255,71,87,0.25)",
                    color:      "#ff4757",
                    border:     "1px solid rgba(255,71,87,0.4)",
                    boxShadow:  "0 0 8px rgba(255,71,87,0.3)",
                  }}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}

              {isActive && !item.badge && (
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "#00ff88", boxShadow: "0 0 6px #00ff88" }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div
        className="mx-4 mb-6 p-3 rounded-xl text-xs font-mono"
        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.3)" }}
      >
        <div className="text-white/50 font-sans text-xs mb-1">Version</div>
        <div>v2.0.0</div>
        <div className="mt-1 text-white/50 font-sans">Academic Project</div>
      </div>
    </aside>
  );
}
