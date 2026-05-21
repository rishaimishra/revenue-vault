import { prisma } from "@/lib/prisma";
import { ReportsTable } from "@/components/admin/ReportsTable";

export const dynamic = "force-dynamic";

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    where: { status: "PENDING" },
    include: {
      listing: { select: { title: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Reports</h1>
      <ReportsTable reports={reports} />
    </div>
  );
}
