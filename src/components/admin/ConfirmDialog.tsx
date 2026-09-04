"use client";

import { useEffect, useState } from "react";

type ConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  title: string;
  description: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  tone?: "danger" | "warning";
};

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  tone = "danger",
}: ConfirmDialogProps) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, loading, onClose]);

  if (!open) return null;

  async function handleConfirm() {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget && !loading) onClose();
      }}
    >
      <div className="w-full max-w-md rounded-2xl border border-white/12 bg-[#0c0c0f] p-6 shadow-2xl shadow-black">
        <div className="flex items-start gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${
              tone === "danger"
                ? "border-red-500/30 bg-red-500/10 text-red-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
            }`}
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white">{title}</h3>
            <div className="mt-1.5 text-[13px] leading-relaxed text-neutral-400">
              {description}
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-2.5">
          <button
            type="button"
            disabled={loading}
            onClick={onClose}
            className="rounded-xl border border-white/12 px-4 py-2.5 text-[13px] font-semibold text-neutral-300 transition hover:bg-white/5 hover:text-white disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={handleConfirm}
            className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-[13px] font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              tone === "danger"
                ? "bg-red-600 hover:bg-red-500"
                : "bg-amber-600 hover:bg-amber-500"
            }`}
          >
            {loading && (
              <svg
                className="h-4 w-4 animate-spin text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
            {loading ? "Deleting…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
