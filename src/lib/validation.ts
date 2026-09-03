import { z } from "zod";

export const enrollSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Please enter a valid email address")
    .max(120),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  city: z.string().trim().max(60).optional().or(z.literal("")),
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  goal: z.string().trim().max(300).optional().or(z.literal("")),
  source: z.string().trim().max(120).optional().or(z.literal("")),
});

export type EnrollInput = z.infer<typeof enrollSchema>;

export const verifySchema = z.object({
  razorpay_order_id: z.string().min(3),
  razorpay_payment_id: z.string().min(3),
  razorpay_signature: z.string().min(3),
});
