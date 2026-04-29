/**
 * SysMonitor Pro - Backend Server
 * Real-time system monitoring via Socket.io + Express
 */

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const os = require("os");

// Attempt to load systeminformation; fall back to mock if unavailable
let si;
let USE_MOCK = false;
try {
  si = require("systeminformation");
} catch (e) {
  console.warn("⚠️  systeminformation not found — running in MOCK MODE");
  USE_MOCK = true;
}

// ─── App Setup ────────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

// ─── Port ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// ─── Mock Data Generators ─────────────────────────────────────────────────────
let mockCpuBase = 35;
let mockMemUsed = 6.2;
const MOCK_PROCESSES = [
  { pid: 1, name: "systemd", cpu: 0.0, mem: 0.1, status: "sleeping" },
  { pid: 234, name: "node", cpu: 12.4, mem: 1.8, status: "running" },
  { pid: 512, name: "chrome", cpu: 18.2, mem: 3.2, status: "running" },
  { pid: 891, name: "nginx", cpu: 0.3, mem: 0.4, status: "sleeping" },
  { pid: 1042, name: "postgres", cpu: 2.1, mem: 2.9, status: "running" },
  { pid: 1105, name: "python3", cpu: 7.8, mem: 1.1, status: "running" },
  { pid: 1389, name: "sshd", cpu: 0.0, mem: 0.2, status: "sleeping" },
  { pid: 1502, name: "redis-server", cpu: 0.5, mem: 0.3, status: "running" },
  { pid: 1788, name: "docker", cpu: 4.2, mem: 2.6, status: "running" },
  { pid: 2001, name: "vscode", cpu: 9.1, mem: 4.1, status: "running" },
  { pid: 2244, name: "bash", cpu: 0.1, mem: 0.1, status: "sleeping" },
  { pid: 2501, name: "webpack", cpu: 22.5, mem: 3.8, status: "running" },
  { pid: 2789, name: "eslint", cpu: 1.2, mem: 0.6, status: "running" },
  { pid: 3001, name: "pm2", cpu: 0.4, mem: 0.5, status: "sleeping" },
  { pid: 3210, name: "mysql", cpu: 1.8, mem: 2.2, status: "running" },
];

let mockProcesses = [...MOCK_PROCESSES];

function getMockSystemData() {
  // Fluctuate CPU
  mockCpuBase += (Math.random() - 0.5) * 8;
  mockCpuBase = Math.max(5, Math.min(95, mockCpuBase));

  // Fluctuate memory
  mockMemUsed += (Math.random() - 0.5) * 0.3;
  mockMemUsed = Math.max(2, Math.min(14, mockMemUsed));

  const totalMem = 16;
  const uptimeSeconds = os.uptime();

  // Fluctuate process CPU values
  mockProcesses = mockProcesses.map((p) => ({
    ...p,
    cpu: Math.max(0, p.cpu + (Math.random() - 0.5) * 2),
    mem: Math.max(0.1, p.mem + (Math.random() - 0.5) * 0.1),
  }));

  return {
    cpu: { currentLoad: parseFloat(mockCpuBase.toFixed(1)) },
    memory: {
      total: totalMem * 1024 * 1024 * 1024,
      used: mockMemUsed * 1024 * 1024 * 1024,
      free: (totalMem - mockMemUsed) * 1024 * 1024 * 1024,
    },
    processes: {
      list: mockProcesses.map((p) => ({
        pid: p.pid,
        name: p.name,
        cpu: parseFloat(p.cpu.toFixed(1)),
        mem: parseFloat(p.mem.toFixed(1)),
        memVsz: p.mem * 1024 * 1024,
        memRss: p.mem * 512 * 1024,
        state: p.status,
      })),
    },
    uptime: uptimeSeconds,
    isMock: true,
  };
}

// ─── Real System Data ─────────────────────────────────────────────────────────
async function getRealSystemData() {
  try {
    const [cpuData, memData, processData] = await Promise.all([
      si.currentLoad(),
      si.mem(),
      si.processes(),
    ]);

    return {
      cpu: { currentLoad: parseFloat(cpuData.currentLoad.toFixed(1)) },
      memory: {
        total: memData.total,
        used: memData.used,
        free: memData.free,
      },
      processes: {
        list: (processData.list || []).slice(0, 50).map((p) => ({
          pid: p.pid,
          name: p.name,
          cpu: parseFloat((p.cpu || 0).toFixed(1)),
          mem: parseFloat(((p.memRss || 0) / 1024 / 1024).toFixed(1)),
          memVsz: p.memVsz,
          memRss: p.memRss,
          state: p.state || "unknown",
        })),
      },
      uptime: os.uptime(),
      isMock: false,
    };
  } catch (err) {
    console.error("Error fetching real data, switching to mock:", err.message);
    USE_MOCK = true;
    return getMockSystemData();
  }
}

// ─── REST Endpoints ───────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", mode: USE_MOCK ? "mock" : "real", uptime: os.uptime() });
});

// Kill process endpoint
app.post("/api/process/kill", async (req, res) => {
  const { pid } = req.body;
  if (!pid) return res.status(400).json({ success: false, message: "PID required" });

  // In mock mode, remove from mock list
  if (USE_MOCK) {
    mockProcesses = mockProcesses.filter((p) => p.pid !== parseInt(pid));
    return res.json({ success: true, message: `Process ${pid} terminated (mock)` });
  }

  try {
    process.kill(parseInt(pid), "SIGTERM");
    res.json({ success: true, message: `SIGTERM sent to PID ${pid}` });
  } catch (err) {
    // If no permission, return friendly error
    if (err.code === "EPERM") {
      return res.json({
        success: false,
        message: `Permission denied to kill PID ${pid}`,
      });
    }
    res.json({ success: false, message: err.message });
  }
});

// ─── Socket.io Real-Time Loop ─────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send data every 1 second
  const interval = setInterval(async () => {
    try {
      const data = USE_MOCK ? getMockSystemData() : await getRealSystemData();
      socket.emit("system-data", data);
    } catch (err) {
      console.error("Emit error:", err.message);
    }
  }, 1000);

  socket.on("disconnect", () => {
    console.log(`❌ Client disconnected: ${socket.id}`);
    clearInterval(interval);
  });

  // Client can request immediate refresh
  socket.on("request-refresh", async () => {
    const data = USE_MOCK ? getMockSystemData() : await getRealSystemData();
    socket.emit("system-data", data);
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 SysMonitor Pro Server running on port ${PORT}`);
  console.log(`📊 Mode: ${USE_MOCK ? "MOCK (simulated data)" : "REAL (live system)"}`);
  console.log(`🌐 API: http://localhost:${PORT}/api/health\n`);
});

// Handle port already in use
server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is in use. Try: PORT=5001 npm start`);
    process.exit(1);
  }
});
