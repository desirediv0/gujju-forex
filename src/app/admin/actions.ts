"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { ADMIN_COOKIE, verifyAdminToken } from "@/lib/auth";

async function assertAdmin() {
  const store = await cookies();
  const ok = await verifyAdminToken(store.get(ADMIN_COOKIE)?.value);
  if (!ok) throw new Error("Unauthorised");
}

export async function toggleContacted(leadId: string, contacted: boolean) {
  await assertAdmin();
  await prisma.lead.update({ where: { id: leadId }, data: { contacted } });
  revalidatePath("/admin", "layout");
}

export async function saveNote(leadId: string, notes: string) {
  await assertAdmin();
  await prisma.lead.update({
    where: { id: leadId },
    data: { notes: notes.trim().slice(0, 1000) || null },
  });
  revalidatePath("/admin", "layout");
}

export async function setLeadStatus(leadId: string, status: string) {
  await assertAdmin();
  if (!["PENDING", "PAID", "FAILED"].includes(status)) return;
  await prisma.lead.update({ where: { id: leadId }, data: { status } });
  revalidatePath("/admin", "layout");
}

export async function deleteLead(leadId: string) {
  await assertAdmin();
  await prisma.lead.delete({ where: { id: leadId } });
  revalidatePath("/admin", "layout");
}

export async function deleteOrder(orderId: string) {
  await assertAdmin();
  await prisma.order.delete({ where: { id: orderId } });
  revalidatePath("/admin", "layout");
}

export async function clearAllData() {
  await assertAdmin();
  await prisma.order.deleteMany({});
  await prisma.lead.deleteMany({});
  revalidatePath("/admin", "layout");
}
