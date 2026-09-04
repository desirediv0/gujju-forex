"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ENROLL_EVENT } from "./EnrollButton";
import { site, whatsappLink } from "@/lib/site";
import { formatINR } from "@/lib/utils";
import { GUJJU_FOREX_LOGO_BASE64 } from "@/lib/logo";

type Step = "form" | "processing" | "success" | "error";

type FieldErrors = Partial<Record<string, string[]>>;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay?: any;
  }
}

const RZP_SRC = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpay(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${RZP_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(true));
      existing.addEventListener("error", () => resolve(false));
      return;
    }
    const script = document.createElement("script");
    script.src = RZP_SRC;
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const experiences = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

export default function EnrollDialog() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [source, setSource] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    experience: "beginner",
    goal: "",
  });
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    // Reset a completed flow so the next open starts fresh.
    setTimeout(() => {
      setStep((s) => (s === "form" || s === "processing" ? s : "form"));
    }, 300);
  }, []);

  useEffect(() => {
    const onOpen = (event: Event) => {
      const detail = (event as CustomEvent<{ source?: string }>).detail;
      setSource(detail?.source ?? "");
      setStep((s) => (s === "success" ? "success" : "form"));
      setOpen(true);
    };
    window.addEventListener(ENROLL_EVENT, onOpen);
    return () => window.removeEventListener(ENROLL_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => firstFieldRef.current?.focus(), 120);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "processing") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(t);
      document.body.style.overflow = "";
    };
  }, [open, step, close]);

  const update = (key: keyof typeof form) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    setFieldErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function markFailed(orderId: string, reason: string) {
    await fetch("/api/payment/failed", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, reason }),
    }).catch(() => null);
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (step === "processing") return;
    setStep("processing");
    setMessage("");
    setFieldErrors({});

    let data: {
      setupRequired?: boolean;
      leadId?: string;
      orderId?: string;
      amount?: number;
      currency?: string;
      keyId?: string;
      error?: string;
      fields?: FieldErrors;
      prefill?: { name: string; email: string; contact: string };
    };

    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, source: source || undefined }),
      });
      data = await res.json();

      if (!res.ok) {
        if (data.fields) setFieldErrors(data.fields);
        setMessage(
          data.setupRequired && process.env.NODE_ENV === "development"
            ? "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env and restart the dev server."
            : (data.error ?? "Something went wrong. Please try again."),
        );
        setStep(data.fields ? "form" : "error");
        return;
      }
    } catch {
      setMessage("Network error. Please check your connection and try again.");
      setStep("error");
      return;
    }

    if (!data.orderId || !data.keyId) {
      setMessage(
        "We could not start the payment. Your details are saved — please message us on WhatsApp to complete your enrollment.",
      );
      setStep("error");
      return;
    }

    const ready = await loadRazorpay();
    if (!ready || !window.Razorpay) {
      setMessage(
        "Could not load the payment window. Please disable ad-blockers and retry, or pay via WhatsApp.",
      );
      setStep("error");
      return;
    }

    const orderId = data.orderId;
    const rzp = new window.Razorpay({
      key: data.keyId,
      amount: data.amount,
      currency: data.currency ?? "INR",
      name: site.brand,
      description: `${site.course.codename} — ${site.course.name}`,
      image: GUJJU_FOREX_LOGO_BASE64,
      order_id: orderId,
      prefill: data.prefill,
      notes: { leadId: data.leadId ?? "" },
      theme: { color: "#d9a934", backdrop_color: "#050506" },
      modal: {
        ondismiss: async () => {
          await markFailed(orderId, "Checkout closed by user");
          setMessage(
            "Payment window closed before the payment finished. Your details are saved — you can retry any time.",
          );
          setStep("error");
        },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      handler: async (response: any) => {
        setStep("processing");
        try {
          const verify = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          if (!verify.ok) {
            const body = await verify.json().catch(() => ({}));
            setMessage(
              body.error ??
                "We could not verify the payment. If money was deducted, contact us on WhatsApp with your payment ID.",
            );
            setStep("error");
            return;
          }
          setStep("success");
        } catch {
          setMessage(
            "Payment went through but verification failed. Please send us your payment ID on WhatsApp.",
          );
          setStep("error");
        }
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rzp.on("payment.failed", async (response: any) => {
      await markFailed(
        orderId,
        response?.error?.description ?? "Payment failed",
      );
      setMessage(
        response?.error?.description ??
          "The payment failed. No money was deducted — please try another method.",
      );
      setStep("error");
    });

    rzp.open();
    setStep("form");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto bg-black/80 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label="Enroll in the Crypto & Forex Mastery Course"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && step !== "processing") close();
      }}
    >
      <div
        ref={panelRef}
        className="card-gold relative my-auto w-full max-w-lg rounded-t-3xl border-gold-300/25 p-6 shadow-2xl sm:rounded-3xl sm:p-8"
      >
        <button
          type="button"
          onClick={close}
          disabled={step === "processing"}
          aria-label="Close"
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/10 text-neutral-400 transition hover:border-gold-300/40 hover:text-gold-100 disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
            <path
              d="M6 6l12 12M18 6L6 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {step === "success" ? (
          <ResultPanel
            tone="success"
            title="You're in!"
            body="Your payment is confirmed and your seat in Divyashtra is booked. Our team will message you on WhatsApp with your access link within a few minutes."
          />
        ) : step === "error" ? (
          <ResultPanel
            tone="error"
            title="Payment not completed"
            body={message}
            onRetry={() => {
              setMessage("");
              setStep("form");
            }}
          />
        ) : (
          <>
            <div className="mb-6 flex items-center gap-3">
              <Image
                src="/images/logo-sm.png"
                alt=""
                width={44}
                height={40}
                className="h-10 w-auto"
              />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-300">
                  Step 1 of 2 — your details
                </p>
                <h2 className="font-display text-xl font-bold text-white">
                  Enroll for {formatINR(site.course.pricePaise)}
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <Field
                label="Full name"
                required
                error={fieldErrors.name?.[0]}
                input={
                  <input
                    ref={firstFieldRef}
                    value={form.name}
                    onChange={(e) => update("name")(e.target.value)}
                    placeholder="Rahul Patel"
                    autoComplete="name"
                    className={inputClass}
                  />
                }
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  label="WhatsApp number"
                  required
                  error={fieldErrors.phone?.[0]}
                  input={
                    <div className="flex">
                      <span className="grid place-items-center rounded-l-xl border border-r-0 border-white/10 bg-white/[0.03] px-3 text-sm text-neutral-400">
                        +91
                      </span>
                      <input
                        value={form.phone}
                        onChange={(e) =>
                          update("phone")(
                            e.target.value.replace(/\D/g, "").slice(0, 10),
                          )
                        }
                        inputMode="numeric"
                        placeholder="9876543210"
                        autoComplete="tel-national"
                        className={`${inputClass} rounded-l-none`}
                      />
                    </div>
                  }
                />
                <Field
                  label="City"
                  error={fieldErrors.city?.[0]}
                  input={
                    <input
                      value={form.city}
                      onChange={(e) => update("city")(e.target.value)}
                      placeholder="Ahmedabad"
                      autoComplete="address-level2"
                      className={inputClass}
                    />
                  }
                />
              </div>
              <Field
                label="Email address"
                required
                error={fieldErrors.email?.[0]}
                input={
                  <input
                    value={form.email}
                    onChange={(e) => update("email")(e.target.value)}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={inputClass}
                  />
                }
              />
              <Field
                label="Your trading experience"
                input={
                  <div className="grid grid-cols-3 gap-2">
                    {experiences.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => update("experience")(option.value)}
                        className={`rounded-xl border px-2 py-2.5 text-xs font-semibold transition ${
                          form.experience === option.value
                            ? "border-gold-300/70 bg-gold-300/15 text-gold-100"
                            : "border-white/10 bg-white/[0.02] text-neutral-400 hover:border-white/25"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                }
              />

              {message && step === "form" && (
                <p className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  {message}
                </p>
              )}

              <button
                type="submit"
                disabled={step === "processing"}
                className="btn-gold flex w-full items-center justify-center gap-2 rounded-xl px-6 py-4 text-sm font-bold tracking-wide transition disabled:cursor-not-allowed disabled:opacity-70"
              >
                {step === "processing" ? (
                  <>
                    <Spinner /> Opening secure checkout…
                  </>
                ) : (
                  <>
                    Pay {formatINR(site.course.pricePaise)} & get instant access
                    <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </>
                )}
              </button>

              <p className="flex items-start justify-center gap-1.5 text-center text-[11px] text-neutral-500">
                <svg
                  viewBox="0 0 24 24"
                  className="mt-0.5 h-3.5 w-3.5 shrink-0"
                  aria-hidden
                >
                  <path
                    d="M12 2l8 4v6c0 5-3.4 8.6-8 10-4.6-1.4-8-5-8-10V6l8-4z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />
                </svg>
                <span>
                  Secure payment by Razorpay · UPI, cards, netbanking &amp;
                  wallets
                </span>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-gold-300/60 focus:bg-white/[0.05]";

function Field({
  label,
  input,
  error,
  required,
}: {
  label: string;
  input: React.ReactNode;
  error?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
        {label}
        {required && <span className="ml-1 text-gold-300">*</span>}
      </span>
      {input}
      {error && <span className="mt-1 block text-[11px] text-red-400">{error}</span>}
    </label>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 animate-spin" aria-hidden>
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ResultPanel({
  tone,
  title,
  body,
  onRetry,
}: {
  tone: "success" | "error";
  title: string;
  body: string;
  onRetry?: () => void;
}) {
  return (
    <div className="py-4 text-center">
      <div
        className={`mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border ${
          tone === "success"
            ? "border-gold-300/40 bg-gold-300/10 text-gold-200"
            : "border-red-500/40 bg-red-500/10 text-red-400"
        }`}
      >
        {tone === "success" ? (
          <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
            <path
              d="M5 13l4.5 4.5L19 7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-7 w-7" aria-hidden>
            <path
              d="M12 8v5M12 16.5v.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle
              cx="12"
              cy="12"
              r="9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            />
          </svg>
        )}
      </div>
      <h2 className="font-display text-2xl font-bold text-white">{title}</h2>
      <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-neutral-400">
        {body}
      </p>
      <div className="mt-7 flex flex-col gap-2.5">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="btn-gold rounded-xl px-6 py-3.5 text-sm font-bold"
          >
            Try again
          </button>
        )}
        <a
          href={whatsappLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold-300/30 px-6 py-3.5 text-sm font-semibold text-gold-100 transition hover:border-gold-300/70 hover:bg-gold-300/10"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
            <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm5.5 14.2c-.2.6-1.2 1.2-1.7 1.2-.5.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6a11.6 11.6 0 0 1-4.4-4c-.3-.5-.7-1.2-.7-2.2s.5-1.5.7-1.7c.2-.2.5-.3.6-.3h.5c.2 0 .4 0 .5.4l.7 1.7c.1.2 0 .4-.1.5l-.3.4c-.1.2-.3.3-.1.6.5.8 1 1.3 1.7 1.8.6.4.9.5 1.1.4l.5-.5c.2-.2.4-.2.6-.1l1.6.8c.2.1.4.2.4.3v.4z" />
          </svg>
          Chat with us on WhatsApp
        </a>
      </div>
      <p className="mt-4 text-[11px] text-neutral-600">
        {site.contact.email} · +91 {site.contact.whatsapp}
      </p>
    </div>
  );
}
