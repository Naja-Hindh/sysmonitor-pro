/**
 * Processes page — Full process management view
 */
import React from "react";
import ProcessTable from "../components/ProcessTable";

export default function Processes({ systemData }) {
  const procs = systemData?.processes?.list;

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">Process Manager</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          Search, sort, and manage running processes
        </p>
      </div>

      {/* Stats row */}
      {systemData && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "TOTAL", value: procs?.length ?? 0, color: "#00ff88" },
            { label: "RUNNING", value: procs?.filter((p) => p.state === "running").length ?? 0, color: "#3d9eff" },
            { label: "SLEEPING", value: procs?.filter((p) => p.state === "sleeping").length ?? 0, color: "#a78bfa" },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <div className="text-xs font-mono uppercase tracking-widest mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
                {s.label}
              </div>
              <div className="text-2xl font-display font-semibold" style={{ color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>
      )}

      <ProcessTable processes={procs} />
    </div>
  );
}
