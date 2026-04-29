/**
 * KillModal — Confirmation modal before killing a process
 */
import React from "react";

export default function KillModal({ process, onConfirm, onCancel }) {
  if (!process) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="glass-card p-6 w-full max-w-sm mx-4 animate-fadeInUp"
        style={{ border: "1px solid rgba(255,71,87,0.3)" }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4"
          style={{ background: "rgba(255,71,87,0.15)", border: "1px solid rgba(255,71,87,0.3)" }}
        >
          ⚡
        </div>

        {/* Text */}
        <h3 className="font-display font-semibold text-white text-lg mb-2">Kill Process</h3>
        <p className="text-sm mb-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          Are you sure you want to terminate:
        </p>
        <div
          className="font-mono text-sm p-3 rounded-lg mb-5"
          style={{ background: "rgba(255,71,87,0.08)", border: "1px solid rgba(255,71,87,0.15)", color: "#ff4757" }}
        >
          <div><span style={{ color: "rgba(255,255,255,0.4)" }}>PID: </span>{process.pid}</div>
          <div><span style={{ color: "rgba(255,255,255,0.4)" }}>Name: </span>{process.name}</div>
        </div>

        <p className="text-xs mb-5" style={{ color: "rgba(255,255,255,0.3)" }}>
          ⚠ This will send SIGTERM to the process. System processes may require admin permission.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-sm font-mono transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
            }}
          >
            CANCEL
          </button>
          <button
            onClick={() => onConfirm(process.pid)}
            className="flex-1 py-2.5 rounded-xl text-sm font-mono font-semibold transition-all duration-200 hover:scale-105"
            style={{
              background: "rgba(255,71,87,0.2)",
              border: "1px solid rgba(255,71,87,0.4)",
              color: "#ff4757",
            }}
          >
            KILL PROCESS
          </button>
        </div>
      </div>
    </div>
  );
}
