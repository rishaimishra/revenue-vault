import { prisma } from "@/lib/prisma";
import { UserTable } from "@/components/admin/UserTable";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isVerified: true,
      createdAt: true
    }
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      <UserTable users={users} />
    </div>
  );
}
