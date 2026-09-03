import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const people = [
  ["Rahul Patel","rahul.p@example.com","9876543210","Ahmedabad","beginner","PAID"],
  ["Priya Shah","priya.shah@example.com","9825011223","Surat","intermediate","PAID"],
  ["Amit Desai","amit.d@example.com","9712345678","Rajkot","beginner","PENDING"],
  ["Nikunj Mehta","nikunj@example.com","9099887766","Vadodara","advanced","PAID"],
  ["Sneha Joshi","sneha.j@example.com","9265544332","Ahmedabad","beginner","FAILED"],
  ["Karan Trivedi","karan.t@example.com","9033221144","Gandhinagar","intermediate","PENDING"],
  ["Meera Vyas","meera.v@example.com","9558877991","Bhavnagar","beginner","PENDING"],
];

for (const [i, [name,email,phone,city,experience,status]] of people.entries()) {
  const createdAt = new Date(Date.now() - i * 7 * 3600 * 1000);
  const lead = await prisma.lead.create({
    data: { name, email, phone, city, experience, status, createdAt,
      source: i % 2 ? "instagram" : "whatsapp-broadcast",
      contacted: status === "PENDING" && i % 3 === 0 },
  });
  if (status !== "PENDING") {
    await prisma.order.create({
      data: {
        leadId: lead.id,
        razorpayOrderId: `order_TEST${Math.random().toString(36).slice(2,12).toUpperCase()}`,
        razorpayPaymentId: status === "PAID" ? `pay_TEST${Math.random().toString(36).slice(2,12).toUpperCase()}` : null,
        receipt: `GF-${lead.id.slice(-10)}`,
        amount: 1900, currency: "INR", status,
        method: status === "PAID" ? (i % 2 ? "upi" : "card") : null,
        failureReason: status === "FAILED" ? "Payment failed at the bank's end" : null,
        paidAt: status === "PAID" ? createdAt : null,
        createdAt,
      },
    });
  }
}
// one abandoned checkout
const abandoned = await prisma.lead.findFirst({ where: { status: "PENDING" } });
if (abandoned) {
  await prisma.order.create({ data: {
    leadId: abandoned.id,
    razorpayOrderId: `order_TEST${Math.random().toString(36).slice(2,12).toUpperCase()}`,
    receipt: `GF-${abandoned.id.slice(-10)}`, amount: 1900, status: "CREATED",
  }});
}
console.log("seeded:", await prisma.lead.count(), "leads,", await prisma.order.count(), "orders");
await prisma.$disconnect();
