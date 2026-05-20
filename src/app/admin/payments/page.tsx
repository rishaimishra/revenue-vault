import { prisma } from "@/lib/prisma";
import { PaymentsTable } from "@/components/admin/PaymentsTable";

export default async function AdminPaymentsPage() {
  const recentPayments = await prisma.payment.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Platform Payments</h1>
      <PaymentsTable payments={recentPayments} />
    </div>
  );
}
