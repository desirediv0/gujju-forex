"use client";

import { useState, useTransition } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { clearAllData } from "@/app/admin/actions";

export default function ClearDataButton() {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => setOpen(true)}
        className="rounded-xl border border-red-500/30 px-3.5 py-2.5 text-[12.5px] font-semibold text-red-400 transition hover:border-red-500/60 hover:bg-red-500/10 disabled:opacity-50"
      >
        Clear all data
      </button>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() =>
          new Promise<void>((resolve) => {
            startTransition(async () => {
              await clearAllData();
              resolve();
            });
          })
        }
        title="Clear All Leads & Orders?"
        description={
          <>
            This will permanently delete <strong className="text-white">ALL leads and order records</strong> from the database.
            <br />
            Your admin login and settings will remain safe. This action cannot be undone.
          </>
        }
        confirmText="Yes, wipe all data"
        tone="danger"
      />
    </>
  );
}
