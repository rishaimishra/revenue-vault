import { prisma } from "@/lib/prisma";
import { UserTable } from "@/components/admin/UserTable";
import { UserFilters } from "@/components/admin/UserFilters";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const q = params.q;
  const role = params.role;
  const sort = params.sort || "desc";

  const where = {
    ...(q ? {
      OR: [
        { name: { contains: q, mode: "insensitive" } },
        { email: { contains: q, mode: "insensitive" } },
      ]
    } : {}),
    ...(role ? { role } : {}),
  };

  const users = await prisma.user.findMany({
    where: (where as any),
    orderBy: { createdAt: (sort as "asc" | "desc") },
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
      <UserFilters />
      <div className="mt-6">
        <UserTable users={users} />
      </div>
    </div>
  );
}
