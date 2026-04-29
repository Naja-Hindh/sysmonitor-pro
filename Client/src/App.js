/**
 * SysMonitor Pro — Main App
 * Real-time system monitoring dashboard
 */
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import TopNav from "./components/TopNav";
import AlertBanner from "./components/AlertBanner";
import Dashboard from "./pages/Dashboard";
import Processes from "./pages/Processes";
import Settings from "./pages/Settings";
import { useSocket } from "./hooks/useSocket";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState("dark");

  const { connected, systemData, cpuHistory, alert, setAlert, isMockMode, requestRefresh } = useSocket();

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <Dashboard systemData={systemData} cpuHistory={cpuHistory} />;
      case "processes":
        return <Processes systemData={systemData} />;
      case "settings":
        return <Settings isMockMode={isMockMode} />;
      default:
        return <Dashboard systemData={systemData} cpuHistory={cpuHistory} />;
    }
  };

  return (
    <div
      className={`flex h-screen overflow-hidden ${theme === "light" ? "light" : ""}`}
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background grid */}
      <div className="bg-grid fixed inset-0 pointer-events-none opacity-50" />

      {/* Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <TopNav
          connected={connected}
          systemData={systemData}
          isMockMode={isMockMode}
          onRefresh={requestRefresh}
          onThemeToggle={toggleTheme}
          theme={theme}
        />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Alert notification */}
      <AlertBanner alert={alert} onDismiss={() => setAlert(null)} />
    </div>
  );
}
