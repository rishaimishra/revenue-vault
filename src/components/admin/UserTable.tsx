import { AdminUserActions } from "@/components/admin/AdminUserActions";

export const UserTable = ({ users }: { users: any[] }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">User</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Role</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Trust Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4">
                <p className="text-sm font-bold text-gray-900">{user.name || "Anonymous"}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </td>
              <td className="px-6 py-4">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 uppercase">
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4">
                <AdminUserActions userId={user.id} isVerified={user.isVerified} currentRole={user.role} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
