import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { enrollSchema } from "@/lib/validation";
import { getRazorpay, isRazorpayConfigured } from "@/lib/razorpay";
import { site } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = enrollSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Please check the highlighted fields",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const headers = request.headers;

  // Save the lead FIRST — that way people who abandon checkout are still
  // visible in the admin dashboard and can be followed up on WhatsApp.
  const lead = await prisma.lead.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone,
      city: data.city || null,
      experience: data.experience,
      goal: data.goal || null,
      source: data.source || headers.get("referer") || null,
      ipAddress:
        headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        headers.get("x-real-ip"),
      userAgent: headers.get("user-agent"),
    },
  });

  const amount = site.course.pricePaise;

  if (!isRazorpayConfigured()) {
    // The lead is already saved so nothing is lost, but payment is required:
    // never let a submission look successful without money being collected.
    console.error(
      "[enroll] Razorpay is not configured — set RAZORPAY_KEY_ID and " +
        "RAZORPAY_KEY_SECRET in .env and restart the server. " +
        `Lead ${lead.id} was saved but could not be charged.`,
    );
    return NextResponse.json(
      {
        error:
          "Payments are temporarily unavailable. Your details are saved — please message us on WhatsApp to complete your enrollment.",
        setupRequired: true,
        leadId: lead.id,
      },
      { status: 503 },
    );
  }

  try {
    const razorpay = getRazorpay()!;
    const receipt = `GF-${lead.id.slice(-10)}`;
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt,
      notes: {
        leadId: lead.id,
        name: data.name,
        phone: data.phone,
        course: site.course.codename,
      },
    });

    await prisma.order.create({
      data: {
        leadId: lead.id,
        razorpayOrderId: order.id,
        receipt,
        amount,
        currency: "INR",
        status: "CREATED",
      },
    });

    return NextResponse.json({
      configured: true,
      leadId: lead.id,
      orderId: order.id,
      amount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      prefill: { name: data.name, email: data.email, contact: data.phone },
    });
  } catch (error) {
    console.error("[enroll] razorpay order failed", error);
    return NextResponse.json(
      {
        error:
          "We saved your details but could not start the payment. Please try again or reach us on WhatsApp.",
        leadId: lead.id,
        configured: true,
        orderFailed: true,
      },
      { status: 502 },
    );
  }
}
