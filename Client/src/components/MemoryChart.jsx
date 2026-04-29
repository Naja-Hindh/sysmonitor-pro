/**
 * MemoryChart — Pie chart showing memory usage vs free
 */
import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { formatBytes } from "../utils/helpers";

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(10,14,26,0.95)",
          border: "1px solid rgba(0,255,136,0.2)",
          borderRadius: "8px",
          padding: "8px 12px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          color: "#fff",
        }}
      >
        <div style={{ color: payload[0].payload.color }}>{payload[0].name}</div>
        <div>{formatBytes(payload[0].value)}</div>
      </div>
    );
  }
  return null;
};

// Custom label inside pie
const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontFamily="JetBrains Mono">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function MemoryChart({ memory }) {
  if (!memory) {
    return (
      <div className="glass-card p-5">
        <div className="skeleton h-4 w-32 mb-4 rounded" />
        <div className="skeleton h-52 w-full rounded-lg" />
      </div>
    );
  }

  const used = memory.used;
  const free = memory.free;
  const total = memory.total;
  const usedPercent = ((used / total) * 100).toFixed(1);
  const usedColor = usedPercent > 80 ? "#ff4757" : usedPercent > 60 ? "#ffa502" : "#00ff88";

  const data = [
    { name: "USED", value: used, color: usedColor },
    { name: "FREE", value: free, color: "rgba(255,255,255,0.12)" },
  ];

  return (
    <div className="glass-card p-5 animate-fadeInUp" style={{ animationDelay: "150ms", animationFillMode: "both" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            MEMORY
          </div>
          <div className="text-2xl font-display font-semibold" style={{ color: usedColor }}>
            {formatBytes(used)}
          </div>
          <div className="text-xs font-mono mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>
            of {formatBytes(total)} total
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.3)" }}>FREE</div>
          <div className="font-mono text-sm text-white">{formatBytes(free)}</div>
        </div>
      </div>

      {/* Pie chart */}
      <ResponsiveContainer width="100%" height={160}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-1">
        {data.map((d) => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
            <span className="text-xs font-mono" style={{ color: "rgba(255,255,255,0.4)" }}>
              {d.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
