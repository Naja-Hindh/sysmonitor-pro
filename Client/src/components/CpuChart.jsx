/**
 * CpuChart — Live line chart of CPU usage over time
 */
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const val = payload[0].value;
    const color = val > 80 ? "#ff4757" : val > 60 ? "#ffa502" : "#00ff88";
    return (
      <div
        style={{
          background: "rgba(10,14,26,0.95)",
          border: "1px solid rgba(0,255,136,0.2)",
          borderRadius: "8px",
          padding: "8px 12px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
        }}
      >
        <div style={{ color: "rgba(255,255,255,0.5)", marginBottom: 2 }}>CPU LOAD</div>
        <div style={{ color, fontSize: 16, fontWeight: 600 }}>{val.toFixed(1)}%</div>
      </div>
    );
  }
  return null;
};

export default function CpuChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-5 animate-fadeInUp" style={{ animationDelay: "100ms", animationFillMode: "both" }}>
        <div className="skeleton h-4 w-40 mb-4 rounded" />
        <div className="skeleton h-52 w-full rounded-lg" />
      </div>
    );
  }

  const current = data[data.length - 1]?.cpu || 0;
  const accentColor = current > 80 ? "#ff4757" : current > 60 ? "#ffa502" : "#00ff88";

  return (
    <div
      className="glass-card p-5 animate-fadeInUp"
      style={{ animationDelay: "100ms", animationFillMode: "both" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-xs font-mono uppercase tracking-widest mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
            CPU USAGE
          </div>
          <div className="text-2xl font-display font-semibold" style={{ color: accentColor }}>
            {current.toFixed(1)}%
          </div>
        </div>
        <div className="text-xs font-mono text-right" style={{ color: "rgba(255,255,255,0.25)" }}>
          <div>LAST {data.length}s</div>
          <div className="mt-1" style={{ color: accentColor }}>LIVE ●</div>
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -30, bottom: 5 }}>
          <defs>
            <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
              <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis
            dataKey="time"
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fill: "rgba(255,255,255,0.25)", fontSize: 10, fontFamily: "JetBrains Mono" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={80} stroke="#ff475766" strokeDasharray="4 4" />
          <Line
            type="monotone"
            dataKey="cpu"
            stroke={accentColor}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
