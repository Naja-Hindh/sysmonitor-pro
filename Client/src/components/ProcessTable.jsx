/**
 * ProcessTable — Sortable, searchable process list
 */
import React, { useState, useMemo } from "react";
import { formatBytes, getStateBadge } from "../utils/helpers";
import KillModal from "./KillModal";
import { killProcess } from "../utils/helpers";

const COLS = [
  { key: "pid", label: "PID", width: "80px" },
  { key: "name", label: "NAME", width: "1fr" },
  { key: "cpu", label: "CPU %", width: "100px" },
  { key: "mem", label: "MEM (MB)", width: "110px" },
  { key: "state", label: "STATUS", width: "110px" },
  { key: "action", label: "", width: "80px" },
];

export default function ProcessTable({ processes }) {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("cpu");
  const [sortDir, setSortDir] = useState("desc");
  const [pendingKill, setPendingKill] = useState(null);
  const [killResult, setKillResult] = useState(null);

  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = useMemo(() => {
    if (!processes) return [];
    return processes
      .filter((p) => {
        const q = search.toLowerCase();
        return (
          String(p.pid).includes(q) ||
          p.name?.toLowerCase().includes(q) ||
          p.state?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        let av = a[sortKey] ?? 0;
        let bv = b[sortKey] ?? 0;
        if (typeof av === "string") av = av.toLowerCase();
        if (typeof bv === "string") bv = bv.toLowerCase();
        if (av < bv) return sortDir === "asc" ? -1 : 1;
        if (av > bv) return sortDir === "asc" ? 1 : -1;
        return 0;
      });
  }, [processes, search, sortKey, sortDir]);

  const handleKillConfirm = async (pid) => {
    const result = await killProcess(pid);
    setKillResult(result);
    setPendingKill(null);
    setTimeout(() => setKillResult(null), 3000);
  };

  if (!processes) {
    return (
      <div className="glass-card p-5 animate-fadeInUp">
        <div className="skeleton h-4 w-40 mb-4 rounded" />
        <div className="space-y-2">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="skeleton h-10 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="glass-card animate-fadeInUp" style={{ animationDelay: "200ms", animationFillMode: "both" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
              ACTIVE PROCESSES
            </div>
            <div className="font-display font-semibold text-white">
              {filtered.length} <span className="text-sm font-sans font-normal" style={{ color: "rgba(255,255,255,0.4)" }}>of {processes.length}</span>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search PID, name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-2 rounded-xl text-sm font-mono outline-none transition-all duration-200 w-52"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "rgba(255,255,255,0.8)",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(0,255,136,0.4)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")}
            />
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
              ⌕
            </span>
          </div>
        </div>

        {/* Kill result */}
        {killResult && (
          <div
            className="mx-5 mb-3 px-3 py-2 rounded-lg text-xs font-mono"
            style={{
              background: killResult.success ? "rgba(0,255,136,0.1)" : "rgba(255,71,87,0.1)",
              border: `1px solid ${killResult.success ? "rgba(0,255,136,0.3)" : "rgba(255,71,87,0.3)"}`,
              color: killResult.success ? "#00ff88" : "#ff4757",
            }}
          >
            {killResult.success ? "✓" : "✗"} {killResult.message}
          </div>
        )}

        {/* Table */}
        <div className="overflow-auto" style={{ maxHeight: "420px" }}>
          <table className="w-full" style={{ borderCollapse: "collapse" }}>
            {/* Column headers */}
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {COLS.map((col) =>
                  col.key === "action" ? (
                    <th key={col.key} className="px-4 py-3 text-right" style={{ width: col.width }}>
                      <span className="text-xs font-mono uppercase tracking-widest" style={{ color: "rgba(255,255,255,0.2)" }}>
                        {col.label}
                      </span>
                    </th>
                  ) : (
                    <th
                      key={col.key}
                      className="px-4 py-3 text-left cursor-pointer select-none group"
                      style={{ width: col.width }}
                      onClick={() => handleSort(col.key)}
                    >
                      <span
                        className="text-xs font-mono uppercase tracking-widest transition-colors duration-150 group-hover:text-white"
                        style={{ color: sortKey === col.key ? "#00ff88" : "rgba(255,255,255,0.3)" }}
                      >
                        {col.label}
                        {sortKey === col.key && (
                          <span className="ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>
                        )}
                      </span>
                    </th>
                  )
                )}
              </tr>
            </thead>

            {/* Rows */}
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 font-mono text-sm" style={{ color: "rgba(255,255,255,0.25)" }}>
                    No matching processes
                  </td>
                </tr>
              ) : (
                filtered.map((proc, idx) => (
                  <tr
                    key={`${proc.pid}-${idx}`}
                    className="process-row"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}
                  >
                    {/* PID */}
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
                        {proc.pid}
                      </span>
                    </td>

                    {/* Name */}
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-sm text-white">{proc.name}</span>
                    </td>

                    {/* CPU */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-1 w-12 rounded-full overflow-hidden"
                          style={{ background: "rgba(255,255,255,0.08)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(100, proc.cpu || 0)}%`,
                              background: proc.cpu > 50 ? "#ff4757" : proc.cpu > 25 ? "#ffa502" : "#00ff88",
                            }}
                          />
                        </div>
                        <span className="font-mono text-xs" style={{ color: proc.cpu > 50 ? "#ff4757" : "#e8eaf0" }}>
                          {(proc.cpu || 0).toFixed(1)}%
                        </span>
                      </div>
                    </td>

                    {/* Memory */}
                    <td className="px-4 py-2.5">
                      <span className="font-mono text-xs" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {(proc.mem || 0).toFixed(1)} MB
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-xs font-mono ${getStateBadge(proc.state)}`}
                      >
                        {proc.state || "unknown"}
                      </span>
                    </td>

                    {/* Kill */}
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => setPendingKill(proc)}
                        className="px-2 py-1 rounded-lg text-xs font-mono transition-all duration-150 hover:scale-105"
                        style={{
                          background: "rgba(255,71,87,0.1)",
                          border: "1px solid rgba(255,71,87,0.25)",
                          color: "#ff4757",
                        }}
                      >
                        KILL
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Kill modal */}
      <KillModal
        process={pendingKill}
        onConfirm={handleKillConfirm}
        onCancel={() => setPendingKill(null)}
      />
    </>
  );
}
