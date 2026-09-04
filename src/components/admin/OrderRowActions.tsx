"use client";

import { useState, useTransition } from "react";
import ConfirmDialog from "./ConfirmDialog";
import { deleteOrder } from "@/app/admin/actions";

export default function OrderRowActions({
  orderId,
  razorpayOrderId,
  customerName,
}: {
  orderId: string;
  razorpayOrderId: string;
  customerName: string;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  return (
    <>
      <button
        type="button"
        disabled={pending}
        onClick={() => setOpen(true)}
        title="Delete order"
        className="grid h-8 w-8 place-items-center rounded-lg border border-white/8 text-neutral-500 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>

      <ConfirmDialog
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() =>
          new Promise<void>((resolve) => {
            startTransition(async () => {
              await deleteOrder(orderId);
              resolve();
            });
          })
        }
        title="Delete Order"
        description={
          <>
            Delete order <span className="font-mono text-white">{razorpayOrderId}</span> for customer{" "}
            <strong className="text-white">{customerName}</strong>?
            <br />
            This record will be permanently deleted from the database.
          </>
        }
        confirmText="Delete Order"
        tone="danger"
      />
    </>
  );
}
