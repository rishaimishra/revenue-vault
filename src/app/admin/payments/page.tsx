import { prisma } from "@/lib/prisma";
import { PaymentsDashboardClient } from "@/components/admin/PaymentsDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const recentPayments = await prisma.payment.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  return (
    <PaymentsDashboardClient initialPayments={recentPayments} />
  );
}
