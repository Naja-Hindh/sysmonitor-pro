/**
 * SysMonitor Pro - Backend Server
 * Real-time system monitoring via Socket.io + Express
 * Fixed: CORS for kill endpoint, live/pause toggle support, better mock kill
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
    methods: ["GET", "POST", "OPTIONS"],
  },
});

// IMPORTANT: CORS must be set up BEFORE routes
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

// Handle preflight OPTIONS for all routes
app.options("*", cors());

app.use(express.json());

// ─── Port ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

// ─── Mock Data Generators ─────────────────────────────────────────────────────
let mockCpuBase = 35;
let mockMemUsed = 6.2;

// Separate base list and active list so killed processes stay gone
const MOCK_PROCESSES_BASE = [
  { pid: 1,    name: "systemd",      cpu: 0.0,  mem: 0.1, status: "sleeping" },
  { pid: 234,  name: "node",         cpu: 12.4, mem: 1.8, status: "running"  },
  { pid: 512,  name: "chrome",       cpu: 18.2, mem: 3.2, status: "running"  },
  { pid: 891,  name: "nginx",        cpu: 0.3,  mem: 0.4, status: "sleeping" },
  { pid: 1042, name: "postgres",     cpu: 2.1,  mem: 2.9, status: "running"  },
  { pid: 1105, name: "python3",      cpu: 7.8,  mem: 1.1, status: "running"  },
  { pid: 1389, name: "sshd",         cpu: 0.0,  mem: 0.2, status: "sleeping" },
  { pid: 1502, name: "redis-server", cpu: 0.5,  mem: 0.3, status: "running"  },
  { pid: 1788, name: "docker",       cpu: 4.2,  mem: 2.6, status: "running"  },
  { pid: 2001, name: "vscode",       cpu: 9.1,  mem: 4.1, status: "running"  },
  { pid: 2244, name: "bash",         cpu: 0.1,  mem: 0.1, status: "sleeping" },
  { pid: 2501, name: "webpack",      cpu: 22.5, mem: 3.8, status: "running"  },
  { pid: 2789, name: "eslint",       cpu: 1.2,  mem: 0.6, status: "running"  },
  { pid: 3001, name: "pm2",          cpu: 0.4,  mem: 0.5, status: "sleeping" },
  { pid: 3210, name: "mysql",        cpu: 1.8,  mem: 2.2, status: "running"  },
  { pid: 3405, name: "webpack-dev",  cpu: 5.3,  mem: 1.7, status: "running"  },
  { pid: 3601, name: "tailwind",     cpu: 0.8,  mem: 0.9, status: "running"  },
  { pid: 3780, name: "esbuild",      cpu: 3.1,  mem: 0.7, status: "running"  },
  { pid: 4001, name: "git",          cpu: 0.0,  mem: 0.1, status: "sleeping" },
  { pid: 4210, name: "ssh-agent",    cpu: 0.0,  mem: 0.1, status: "sleeping" },
];

// This is the live list — kill removes from here permanently
let mockProcesses = MOCK_PROCESSES_BASE.map(p => ({ ...p }));

function getMockSystemData() {
  mockCpuBase += (Math.random() - 0.5) * 8;
  mockCpuBase = Math.max(5, Math.min(95, mockCpuBase));

  mockMemUsed += (Math.random() - 0.5) * 0.3;
  mockMemUsed = Math.max(2, Math.min(14, mockMemUsed));

  const totalMem = 16;

  // Fluctuate CPU/mem of surviving mock processes
  mockProcesses = mockProcesses.map((p) => ({
    ...p,
    cpu: Math.max(0, p.cpu + (Math.random() - 0.5) * 2),
    mem: Math.max(0.1, p.mem + (Math.random() - 0.5) * 0.1),
  }));

  return {
    cpu: { currentLoad: parseFloat(mockCpuBase.toFixed(1)) },
    memory: {
      total: totalMem * 1024 * 1024 * 1024,
      used:  mockMemUsed * 1024 * 1024 * 1024,
      free:  (totalMem - mockMemUsed) * 1024 * 1024 * 1024,
    },
    processes: {
      list: mockProcesses.map((p) => ({
        pid:    p.pid,
        name:   p.name,
        cpu:    parseFloat(p.cpu.toFixed(1)),
        mem:    parseFloat(p.mem.toFixed(1)),
        memVsz: p.mem * 1024 * 1024,
        memRss: p.mem * 512 * 1024,
        state:  p.status,
      })),
    },
    uptime: os.uptime(),
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
        used:  memData.used,
        free:  memData.free,
      },
      processes: {
        list: (processData.list || []).slice(0, 60).map((p) => ({
          pid:    p.pid,
          name:   p.name,
          cpu:    parseFloat((p.cpu    || 0).toFixed(1)),
          mem:    parseFloat(((p.memRss || 0) / 1024 / 1024).toFixed(1)),
          memVsz: p.memVsz,
          memRss: p.memRss,
          state:  p.state || "unknown",
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
  res.json({
    status: "ok",
    mode:   USE_MOCK ? "mock" : "real",
    uptime: os.uptime(),
  });
});

// ── Kill Process ──────────────────────────────────────────────────────────────
app.post("/api/process/kill", (req, res) => {
  const { pid } = req.body;

  if (!pid) {
    return res.status(400).json({ success: false, message: "PID is required" });
  }

  const pidInt = parseInt(pid, 10);

  if (isNaN(pidInt) || pidInt <= 0) {
    return res.status(400).json({ success: false, message: "Invalid PID" });
  }

  // ── MOCK MODE: just remove from the in-memory list ─────────────────────────
  if (USE_MOCK) {
    const before = mockProcesses.length;
    mockProcesses = mockProcesses.filter((p) => p.pid !== pidInt);
    const removed = mockProcesses.length < before;
    return res.json({
      success: true,
      message: removed
        ? `Process ${pidInt} terminated successfully (mock)`
        : `Process ${pidInt} not found (already gone)`,
    });
  }

  // ── REAL MODE: send SIGTERM ────────────────────────────────────────────────
  try {
    process.kill(pidInt, "SIGTERM");
    console.log(`✅ SIGTERM sent to PID ${pidInt}`);
    return res.json({ success: true, message: `Process ${pidInt} terminated (SIGTERM sent)` });
  } catch (err) {
    if (err.code === "EPERM") {
      return res.json({
        success: false,
        message: `Permission denied — cannot kill PID ${pidInt} (system process)`,
      });
    }
    if (err.code === "ESRCH") {
      return res.json({
        success: false,
        message: `Process ${pidInt} not found — it may have already exited`,
      });
    }
    console.error(`Kill error for PID ${pidInt}:`, err.message);
    return res.json({ success: false, message: err.message });
  }
});

// ─── Socket.io Real-Time Loop ─────────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // Send data immediately on connect so dashboard populates instantly
  (async () => {
    try {
      const data = USE_MOCK ? getMockSystemData() : await getRealSystemData();
      socket.emit("system-data", data);
    } catch (e) { /* ignore first-emit errors */ }
  })();

  // Then send every 1 second
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

  // On-demand refresh from client
  socket.on("request-refresh", async () => {
    try {
      const data = USE_MOCK ? getMockSystemData() : await getRealSystemData();
      socket.emit("system-data", data);
    } catch (err) {
      console.error("Refresh error:", err.message);
    }
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 SysMonitor Pro Server running on port ${PORT}`);
  console.log(`📊 Mode: ${USE_MOCK ? "MOCK (simulated data)" : "REAL (live system)"}`);
  console.log(`🌐 Health: http://localhost:${PORT}/api/health\n`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Try: PORT=5001 npm start`);
    process.exit(1);
  }
});
