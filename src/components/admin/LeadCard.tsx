"use client";

import { useState, useTransition } from "react";
import { StatusPill } from "./ui";
import ConfirmDialog from "./ConfirmDialog";
import {
  deleteLead,
  saveNote,
  setLeadStatus,
  toggleContacted,
} from "@/app/admin/actions";
import { formatDateTime, formatINR } from "@/lib/utils";

export type LeadRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string | null;
  experience: string;
  goal: string | null;
  source: string | null;
  status: string;
  notes: string | null;
  contacted: boolean;
  createdAt: string;
  orders: {
    id: string;
    status: string;
    amount: number;
    razorpayOrderId: string;
    razorpayPaymentId: string | null;
    failureReason: string | null;
    createdAt: string;
  }[];
};

export default function LeadCard({ lead }: { lead: LeadRow }) {
  const [open, setOpen] = useState(false);
  const [notes, setNotes] = useState(lead.notes ?? "");
  const [saved, setSaved] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [pending, startTransition] = useTransition();

  const waHref = `https://wa.me/91${lead.phone}?text=${encodeURIComponent(
    `Hi ${lead.name}, this is Gujju Forex regarding the Divyashtra Crypto & Forex Mastery Course.`,
  )}`;

  return (
    <li className="card-gold rounded-2xl">
      <div className="flex flex-wrap items-center gap-4 p-4 sm:p-5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex min-w-0 flex-1 items-center gap-4 text-left"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gold-300/25 bg-gold-300/[0.07] text-[13px] font-bold uppercase text-gold-200">
            {lead.name.slice(0, 2)}
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2">
              <span className="truncate text-[14px] font-semibold text-white">
                {lead.name}
              </span>
              {lead.contacted && (
                <span className="rounded border border-sky-500/30 bg-sky-500/10 px-1.5 py-0.5 text-[9.5px] font-bold uppercase tracking-wider text-sky-300">
                  Contacted
                </span>
              )}
            </span>
            <span className="mt-0.5 block truncate text-[12.5px] text-neutral-500">
              +91 {lead.phone} · {lead.email}
              {lead.city ? ` · ${lead.city}` : ""}
            </span>
          </span>
        </button>

        <div className="flex items-center gap-2.5">
          <span className="hidden text-[12px] text-neutral-600 sm:block">
            {formatDateTime(lead.createdAt)}
          </span>
          <StatusPill status={lead.status} />
          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            title="Message on WhatsApp"
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-[#25D366] transition hover:border-[#25D366]/50 hover:bg-[#25D366]/10"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
              <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2z" />
            </svg>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Collapse" : "Expand"}
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-neutral-400 transition hover:border-gold-300/40 hover:text-gold-100"
          >
            <svg
              viewBox="0 0 24 24"
              className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
              aria-hidden
            >
              <path
                d="M6 9l6 6 6-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-white/8 px-4 pb-5 pt-4 sm:px-5">
          <dl className="grid gap-4 sm:grid-cols-4">
            <Detail label="Experience" value={lead.experience} />
            <Detail label="City" value={lead.city ?? "—"} />
            <Detail
              label="Submitted"
              value={formatDateTime(lead.createdAt)}
            />
            <Detail label="Source" value={lead.source ?? "Direct"} />
          </dl>

          {lead.orders.length > 0 && (
            <div className="mt-5">
              <p className="mb-2 text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                Payment attempts
              </p>
              <ul className="space-y-2">
                {lead.orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex flex-wrap items-center gap-3 rounded-xl border border-white/8 bg-black/25 px-3.5 py-2.5"
                  >
                    <StatusPill status={order.status} />
                    <span className="text-[13px] font-semibold text-white">
                      {formatINR(order.amount)}
                    </span>
                    <span className="font-mono text-[11.5px] text-neutral-500">
                      {order.razorpayPaymentId ?? order.razorpayOrderId}
                    </span>
                    <span className="ml-auto text-[11.5px] text-neutral-600">
                      {formatDateTime(order.createdAt)}
                    </span>
                    {order.failureReason && (
                      <span className="w-full text-[11.5px] text-red-400/80">
                        {order.failureReason}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5">
            <label className="mb-2 block text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-500">
              Internal notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setSaved(false);
              }}
              rows={2}
              placeholder="Follow-up notes, call outcome, objections…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-2.5 text-[13px] text-white outline-none transition placeholder:text-neutral-600 focus:border-gold-300/50"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  await saveNote(lead.id, notes);
                  setSaved(true);
                })
              }
              className="btn-gold rounded-lg px-4 py-2 text-[12.5px] font-bold disabled:opacity-60"
            >
              {saved ? "Saved" : "Save note"}
            </button>

            <button
              type="button"
              disabled={pending}
              onClick={() =>
                startTransition(() => toggleContacted(lead.id, !lead.contacted))
              }
              className="rounded-lg border border-white/12 px-4 py-2 text-[12.5px] font-semibold text-neutral-300 transition hover:border-sky-400/50 hover:text-sky-200 disabled:opacity-60"
            >
              {lead.contacted ? "Mark as not contacted" : "Mark as contacted"}
            </button>

            <select
              defaultValue={lead.status}
              disabled={pending}
              onChange={(e) =>
                startTransition(() => setLeadStatus(lead.id, e.target.value))
              }
              className="rounded-lg border border-white/12 bg-ink-2 px-3 py-2 text-[12.5px] font-semibold text-neutral-300 outline-none focus:border-gold-300/50"
            >
              <option value="PENDING">Status: Pending</option>
              <option value="PAID">Status: Paid</option>
              <option value="FAILED">Status: Failed</option>
            </select>

            <a
              href={`mailto:${lead.email}`}
              className="rounded-lg border border-white/12 px-4 py-2 text-[12.5px] font-semibold text-neutral-300 transition hover:border-gold-300/45 hover:text-gold-100"
            >
              Email
            </a>

            <button
              type="button"
              disabled={pending}
              onClick={() => setShowDeleteModal(true)}
              className="ml-auto rounded-lg border border-red-500/25 px-4 py-2 text-[12.5px] font-semibold text-red-400/90 transition hover:border-red-500/60 hover:bg-red-500/10 disabled:opacity-60"
            >
              Delete
            </button>
          </div>

          <ConfirmDialog
            open={showDeleteModal}
            onClose={() => setShowDeleteModal(false)}
            onConfirm={async () => {
              await deleteLead(lead.id);
            }}
            title="Delete Lead"
            description={
              <>
                Are you sure you want to delete{" "}
                <strong className="text-white">{lead.name}</strong> (+91 {lead.phone})?
                <br />
                This will permanently remove this lead and all associated payment records. This action cannot be undone.
              </>
            }
            confirmText="Delete Lead"
            tone="danger"
          />
        </div>
      )}
    </li>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10.5px] font-bold uppercase tracking-[0.16em] text-neutral-600">
        {label}
      </dt>
      <dd className="mt-1 truncate text-[13px] capitalize text-neutral-300">
        {value}
      </dd>
    </div>
  );
}
