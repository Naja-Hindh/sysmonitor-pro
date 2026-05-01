/**
 * Utility helpers for SysMonitor Pro
 */

// Format bytes to human-readable (MB, GB)
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

// Format uptime seconds → "2d 4h 32m"
export function formatUptime(seconds) {
  if (!seconds) return "—";
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0) parts.push(`${h}h`);
  parts.push(`${m}m`);
  return parts.join(" ");
}

// Get color class based on value percentage
export function getStatusColor(value) {
  if (value >= 80) return "#ff4757"; // red
  if (value >= 60) return "#ffa502"; // orange
  return "#00ff88"; // green
}

// Get Tailwind bg class based on value percentage
export function getStatusBg(value) {
  if (value >= 80) return "bg-red-500";
  if (value >= 60) return "bg-yellow-500";
  return "bg-emerald-400";
}

// Kill process via REST API — uses absolute URL to avoid proxy issues
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:5000";

export async function killProcess(pid) {
  try {
    const res = await fetch(`${SERVER_URL}/api/process/kill`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pid }),
    });
    if (!res.ok) throw new Error(`Server returned HTTP ${res.status}`);
    return res.json();
  } catch (err) {
    return { success: false, message: `Request failed: ${err.message}` };
  }
}

// Get status badge style
export function getStateBadge(state) {
  const map = {
    running: "text-emerald-400 bg-emerald-400/10",
    sleeping: "text-blue-400 bg-blue-400/10",
    zombie: "text-red-400 bg-red-400/10",
    stopped: "text-yellow-400 bg-yellow-400/10",
    unknown: "text-gray-400 bg-gray-400/10",
  };
  return map[state?.toLowerCase()] || map.unknown;
}
