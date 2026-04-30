# ⬡ SysMonitor Pro

> **Real-Time Process Monitoring Dashboard** — A production-grade web application built with React, Node.js, and Socket.io for academic project demonstration.

---

## 🎯 Project Overview

SysMonitor Pro monitors your computer's CPU, memory, and processes in real time — updating every second without page refresh. It looks and feels like a professional SaaS dashboard used in real companies (e.g., Datadog, New Relic).

### Key Highlights

- ⚡ **Live updates** via WebSockets (Socket.io) — no page refresh
- 📊 **Interactive charts** — CPU line chart + memory pie chart (Recharts)
- 📋 **Process management** — view, search, sort, and kill processes
- 🛡️ **Mock mode** — auto-switches to simulated data if real system access fails
- 🎨 **Professional UI** — glassmorphism dark theme, animated progress bars

---

## 🧱 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (hooks), Tailwind CSS, Recharts |
| Backend | Node.js, Express.js |
| Real-time | Socket.io (WebSockets) |
| System Info | systeminformation npm package |
| Fonts | DM Sans, JetBrains Mono, Space Grotesk |

---

## 📦 Project Structure

```
sysmonitor/
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html         # HTML entry, favicon
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx    # Navigation sidebar
│   │   │   ├── TopNav.jsx     # Top status bar
│   │   │   ├── StatCard.jsx   # Metric cards with progress bars
│   │   │   ├── CpuChart.jsx   # Live CPU line chart
│   │   │   ├── MemoryChart.jsx # Memory pie chart
│   │   │   ├── ProcessTable.jsx# Sortable process table
│   │   │   ├── KillModal.jsx  # Process kill confirmation
│   │   │   └── AlertBanner.jsx # CPU spike notification
│   │   ├── hooks/
│   │   │   └── useSocket.js   # Socket.io connection + state
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx  # Main overview page
│   │   │   ├── Processes.jsx  # Process manager page
│   │   │   └── Settings.jsx   # Settings + project info
│   │   ├── utils/
│   │   │   └── helpers.js     # Format bytes, uptime, colors
│   │   ├── App.js             # Root component + routing
│   │   └── index.css          # Global styles + animations
│   ├── tailwind.config.js
│   └── package.json
│
├── server/
│   ├── index.js               # Express server + Socket.io
│   └── package.json
│
├── package.json               # Root scripts
└── README.md                  # This file
```

---

## 🚀 Setup Instructions (Copy-Paste Ready)

### Prerequisites

Make sure you have installed:
- **Node.js** v16+ → [nodejs.org](https://nodejs.org)
- **npm** (comes with Node.js)

Verify: `node -v && npm -v`

---

### Step 1: Clone / Download the project

```bash
# If using git:
git clone https://github.com/your-username/sysmonitor-pro.git
cd sysmonitor-pro

# Or just navigate to the project folder:
cd sysmonitor
```

### Step 2: Install Backend Dependencies

```bash
cd server
npm install
```

### Step 3: Install Frontend Dependencies

```bash
cd ../client
npm install
```

### Step 4: Start the Backend (Terminal 1)

```bash
cd server
npm run dev
```

You should see:
```
🚀 SysMonitor Pro Server running on port 5000
📊 Mode: REAL (live system)
```

### Step 5: Start the Frontend (Terminal 2)

```bash
cd client
npm start
```

Browser opens automatically at **http://localhost:3000** ✓

---

## 🌐 Deployment

### Backend → Render (Free)

1. Push `server/` folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Environment Variable:** `PORT=10000`
5. Click Deploy → Copy the URL (e.g., `https://sysmonitor.onrender.com`)

### Frontend → Vercel (Free)

1. Push `client/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Connect GitHub repo
4. Add Environment Variable:
   - Key: `REACT_APP_SERVER_URL`
   - Value: your Render URL (e.g., `https://sysmonitor.onrender.com`)
5. Deploy → Your site is live!

**Note:** On Render's free tier, the server sleeps after 15 minutes of inactivity. First load may take 30 seconds.

---

## 🔧 Common Issues & Fixes

| Error | Fix |
|-------|-----|
| `Port 5000 already in use` | Run: `PORT=5001 npm start` in server folder |
| `Cannot connect to server` | Make sure backend is running first (Step 4) |
| `Permission denied to kill PID` | Normal — system processes are protected |
| `MOCK MODE shown` | Normal on some systems — all features still work |
| `npm install fails` | Delete `node_modules/` and run `npm install` again |

---

## 🧪 Testing Guide

### Feature 1: Real-time Updates
- Open dashboard, watch CPU % value change every second
- **Expected:** Numbers update without page refresh

### Feature 2: CPU Chart
- Watch the line chart — it scrolls with new data points
- **Expected:** Smooth live graph with 30 data points

### Feature 3: Process Table
- Type "node" in the search bar
- **Expected:** Table filters to show only node processes

### Feature 4: Sorting
- Click column header "CPU %" in process table
- **Expected:** Processes sort by CPU usage descending

### Feature 5: Kill Process
- Click "KILL" button on any process
- **Expected:** Confirmation modal appears; after confirming, process removed (mock) or SIGTERM sent (real)

### Feature 6: CPU Alert
- In mock mode, CPU fluctuates randomly
- **Expected:** When CPU > 80%, red alert notification appears top-right

### Feature 7: Navigation
- Click Sidebar items: Dashboard, Processes, Settings
- **Expected:** Page transitions smoothly

### Feature 8: Mock Mode
- Stop the backend server
- **Expected:** Frontend shows "OFFLINE" status gracefully

---

## 🏗️ Architecture Diagram (Text)

```
┌─────────────────────────────────────────┐
│            BROWSER (React App)           │
│                                         │
│  ┌──────────┐  ┌────────┐  ┌─────────┐ │
│  │ Dashboard│  │Process │  │Settings │ │
│  │  Page    │  │  Page  │  │  Page   │ │
│  └────┬─────┘  └───┬────┘  └────┬────┘ │
│       │             │            │       │
│  ┌────▼─────────────▼────────────▼────┐ │
│  │         useSocket (React Hook)      │ │
│  │   - Manages Socket.io connection   │ │
│  │   - Stores systemData in state     │ │
│  │   - Maintains CPU history array    │ │
│  └────────────────┬───────────────────┘ │
└───────────────────│─────────────────────┘
                    │ WebSocket (ws://)
          ┌─────────▼──────────┐
          │   NODE.JS SERVER   │
          │   (Express.js)     │
          │                    │
          │  ┌──────────────┐  │
          │  │  Socket.io   │  │
          │  │  Server      │  │
          │  └──────┬───────┘  │
          │         │ emit     │
          │  ┌──────▼───────┐  │
          │  │  setInterval │  │
          │  │  (1 second)  │  │
          │  └──────┬───────┘  │
          │         │          │
          │  ┌──────▼───────┐  │
          │  │ system info  │  │
          │  │ (npm package)│  │
          │  └──────────────┘  │
          └────────────────────┘
                    │
          ┌─────────▼──────────┐
          │   OS / KERNEL      │
          │  CPU, Memory, PIDs │
          └────────────────────┘
```

---

## 🎤 VIVA PREPARATION

### Simple Explanation (Non-Technical)

> "SysMonitor Pro is a website that shows your computer's health in real time — like a doctor's monitor showing your heartbeat. It displays CPU usage (how hard the processor is working), memory usage (how full the RAM is), and all the programs running. It updates every second automatically without refreshing the page."

### Technical Explanation

> "The system uses WebSocket protocol (via Socket.io) for bi-directional, persistent TCP connections between the React frontend and Node.js backend. The backend polls the OS every second using the `systeminformation` library, which reads from `/proc/stat` on Linux, and emits the data over the WebSocket channel. React's `useState` and `useEffect` hooks manage local state and side effects. Recharts renders the time-series CPU data as a live line chart."

---

### 📚 Key Concepts for Viva

#### 1. WebSockets vs HTTP

| HTTP (Regular) | WebSocket |
|----------------|-----------|
| Client requests, server responds | Both can send anytime |
| New connection each time | One persistent connection |
| Higher latency | Near zero latency |
| Good for REST APIs | Good for real-time apps |

#### 2. Why Socket.io?

Socket.io is a library built on top of WebSockets. It adds:
- **Auto-reconnection** if connection drops
- **Fallback** to HTTP long-polling if WebSocket fails
- **Event-based API** — easy to use with `socket.emit()` and `socket.on()`

#### 3. React Hooks Used

- `useState` — stores systemData, cpuHistory, connected status
- `useEffect` — creates socket connection on mount, cleans up on unmount
- `useRef` — holds socket reference without causing re-renders
- `useCallback` — memoizes the refresh function
- `useMemo` — optimizes expensive process filtering/sorting

#### 4. systeminformation Library

Reads OS metrics cross-platform (Linux, macOS, Windows):
- `si.currentLoad()` → CPU usage percentage
- `si.mem()` → total/used/free memory bytes
- `si.processes()` → list of running processes with PID, name, CPU, memory

---

### ❓ 10 Viva Questions & Answers

**Q1: What is a WebSocket and why did you use it?**
> A WebSocket is a communication protocol that keeps a persistent connection between the browser and server, allowing data to flow in real time without polling. I used it because system metrics change every second, and polling with HTTP would be inefficient and slow.

**Q2: What is Socket.io and how is it different from raw WebSockets?**
> Socket.io is a library built on WebSockets that adds auto-reconnection, event-based messaging, and HTTP fallback. Raw WebSockets are lower-level; Socket.io makes them easier to use in production apps.

**Q3: How does your app handle the case when the backend is not running?**
> The `useSocket` hook handles `connect_error` events and sets `connected = false`. The frontend shows "OFFLINE" status and displays the last known data or loading skeletons gracefully.

**Q4: What is Mock Mode and why is it important?**
> Mock Mode generates simulated data when `systeminformation` cannot access real system metrics (e.g., permission errors, different OS). It ensures the app never crashes and always demonstrates features correctly.

**Q5: How does the CPU history chart work?**
> Every time new system data arrives via Socket.io, I push the CPU value with a timestamp into a React state array. I keep only the last 30 items (30 seconds of data). Recharts renders this array as a live line chart.

**Q6: How does the process kill feature work?**
> The frontend sends a POST request to `/api/process/kill` with the PID. The backend uses Node's `process.kill(pid, 'SIGTERM')` to send a termination signal. If permission is denied (EPERM), it returns a friendly error instead of crashing.

**Q7: How does the search and sort work in the process table?**
> I use React's `useMemo` hook to filter the process list based on the search term and sort it by the selected column. This is computed only when the data, search term, or sort key changes — it's efficient.

**Q8: What is Tailwind CSS and why use it over regular CSS?**
> Tailwind is a utility-first CSS framework with pre-built classes. Instead of writing custom CSS files, you apply classes directly in JSX. It speeds up development and ensures consistent design tokens (spacing, colors, fonts).

**Q9: How would you scale this for production with 1000 concurrent users?**
> I would add Redis with Socket.io's adapter so multiple server instances share events. I'd use a load balancer, add authentication (JWT), rate-limit the kill endpoint, and replace polling with OS kernel events (inotify/eBPF) for efficiency.

**Q10: What is Recharts and how did you customize it?**
> Recharts is a React charting library built on D3.js. I customized it by using `CustomTooltip` components for styled tooltips, a `ReferenceLine` at 80% CPU as a warning threshold, and `isAnimationActive={false}` for the line chart to prevent flickering during live updates.

---

## 📊 Features Summary

| Feature | Status |
|---------|--------|
| Real-time CPU updates (1s) | ✅ |
| Real-time memory updates | ✅ |
| Live CPU line chart | ✅ |
| Memory pie chart | ✅ |
| Process table with PID/name/CPU/mem/status | ✅ |
| Search processes | ✅ |
| Sort by any column | ✅ |
| Kill process with confirmation modal | ✅ |
| CPU > 80% alert notification | ✅ |
| Loading skeletons | ✅ |
| Animated progress bars | ✅ |
| Mock/simulation mode | ✅ |
| Dark mode UI | ✅ |
| System uptime display | ✅ |
| Refresh button | ✅ |
| Responsive layout | ✅ |
| Sidebar navigation (3 pages) | ✅ |
| Auto-reconnection | ✅ |
| Graceful error handling | ✅ |

---

*Built with ❤️ for academic demonstration — SysMonitor Pro v1.0.0*
