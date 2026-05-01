/**
 * Dashboard — Overview with threshold-aware stat cards + charts
 */
import React from "react";
import { StatCard, StatCardSkeleton } from "../components/StatCard";
import CpuChart    from "../components/CpuChart";
import MemoryChart from "../components/MemoryChart";
import ProcessTable from "../components/ProcessTable";
import { formatBytes, formatUptime } from "../utils/helpers";

export default function Dashboard({ systemData, cpuHistory, thresholds }) {
  const cpu    = systemData?.cpu;
  const mem    = systemData?.memory;
  const procs  = systemData?.processes;
  const uptime = systemData?.uptime;

  const cpuVal    = cpu ? `${cpu.currentLoad.toFixed(1)}%` : "—";
  const memVal    = mem ? formatBytes(mem.used) : "—";
  const memPercent= mem ? (mem.used / mem.total) * 100 : null;
  const procCount = procs?.list?.length ?? "—";

  // Alert status for cards
  const cpuAlert = cpu && thresholds
    ? cpu.currentLoad >= thresholds.cpuCritical ? "critical"
    : cpu.currentLoad >= thresholds.cpuWarning  ? "warning"
    : "ok"
    : "ok";

  const memAlert = memPercent && thresholds
    ? memPercent >= thresholds.memCritical ? "critical"
    : memPercent >= thresholds.memWarning  ? "warning"
    : "ok"
    : "ok";

  const alertAccent = (status) =>
    status === "critical" ? "#ff4757" : status === "warning" ? "#ffa502" : null;

  return (
    <div className="p-6 space-y-6 animate-fadeInUp">
      {/* Title */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-white">System Overview</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.35)" }}>
          Real-time metrics — updates every second
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {!systemData ? (
          <><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /><StatCardSkeleton /></>
        ) : (
          <>
            <StatCard
              label="CPU Usage"
              value={cpuVal}
              percent={cpu?.currentLoad}
              icon="⬡"
              accentColor={alertAccent(cpuAlert)}
              alertStatus={cpuAlert}
              delay={0}
            />
            <StatCard
              label="Memory"
              value={memVal}
              subtitle={mem ? `${formatBytes(mem.total)} total` : ""}
              percent={memPercent}
              icon="◈"
              accentColor={alertAccent(memAlert)}
              alertStatus={memAlert}
              delay={60}
            />
            <StatCard
              label="Processes"
              value={procCount}
              subtitle="running"
              icon="◎"
              accentColor="#3d9eff"
              delay={120}
            />
            <StatCard
              label="System Uptime"
              value={formatUptime(uptime)}
              subtitle="since last boot"
              icon="⟳"
              accentColor="#a78bfa"
              delay={180}
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <CpuChart data={cpuHistory} thresholds={thresholds} />
        </div>
        <div>
          <MemoryChart memory={mem} thresholds={thresholds} />
        </div>
      </div>

      {/* Process table */}
      <ProcessTable processes={procs?.list} />
    </div>
  );
}
