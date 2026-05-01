/**
 * SysMonitor Pro — Main App v2.0
 * Features: Live/Pause, full Alert System with history, threshold config
 */
import React, { useState } from "react";
import Sidebar      from "./components/Sidebar";
import TopNav       from "./components/TopNav";
import AlertBanner  from "./components/AlertBanner";
import AlertsPanel  from "./components/AlertsPanel";
import Dashboard    from "./pages/Dashboard";
import Processes    from "./pages/Processes";
import Settings     from "./pages/Settings";
import { useSocket } from "./hooks/useSocket";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [theme,      setTheme]      = useState("dark");

  const {
    connected, systemData, cpuHistory, isMockMode,
    isLive, toggleLive, requestRefresh,
    toastAlert, dismissToast,
    alertHistory, unreadAlerts, clearUnread, markAllRead, clearAlertHistory,
    thresholds, updateThresholds,
  } = useSocket();

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  // When user navigates to alerts page, mark all read
  const handleNav = (page) => {
    setActivePage(page);
    if (page === "alerts") clearUnread();
  };

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard systemData={systemData} cpuHistory={cpuHistory} isLive={isLive} thresholds={thresholds} />;
      case "processes":
        return <Processes systemData={systemData} />;
      case "alerts":
        return (
          <AlertsPanel
            alertHistory={alertHistory}
            unreadAlerts={unreadAlerts}
            onMarkAllRead={markAllRead}
            onClearHistory={clearAlertHistory}
          />
        );
      case "settings":
        return (
          <Settings
            isMockMode={isMockMode}
            thresholds={thresholds}
            onUpdateThresholds={updateThresholds}
          />
        );
      default:
        return <Dashboard systemData={systemData} cpuHistory={cpuHistory} isLive={isLive} thresholds={thresholds} />;
    }
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${theme === "light" ? "light" : ""}`}
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="bg-grid fixed inset-0 pointer-events-none opacity-50" />

      <Sidebar
        activePage={activePage}
        setActivePage={handleNav}
        unreadAlerts={unreadAlerts}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav
          connected={connected}
          systemData={systemData}
          isMockMode={isMockMode}
          onRefresh={requestRefresh}
          onThemeToggle={toggleTheme}
          theme={theme}
          isLive={isLive}
          onToggleLive={toggleLive}
          unreadAlerts={unreadAlerts}
          onAlertsClick={() => handleNav("alerts")}
        />

        {/* Paused banner */}
        {!isLive && (
          <div
            className="flex items-center justify-between px-6 py-2 text-xs font-mono"
            style={{
              background:   "rgba(255,165,0,0.1)",
              borderBottom: "1px solid rgba(255,165,0,0.25)",
              color:        "#ffa502",
            }}
          >
            <span>⏸ Updates paused — data frozen at last snapshot</span>
            <button onClick={toggleLive} className="underline hover:opacity-80 transition-opacity">
              Resume live
            </button>
          </div>
        )}

        <main className="flex-1 overflow-y-auto">{renderPage()}</main>
      </div>

      {/* Toast alert — slides in top-right */}
      <AlertBanner alert={toastAlert} onDismiss={dismissToast} />
    </div>
  );
}
