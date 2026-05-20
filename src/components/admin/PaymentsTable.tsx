export const PaymentsTable = ({ payments }: { payments: any[] }) => {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-100">
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">User</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Amount</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Type</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Status</th>
            <th className="px-6 py-4 text-[10px] font-bold uppercase text-gray-400">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {payments.map((payment) => (
            <tr key={payment.id} className="hover:bg-gray-50 transition-colors text-sm">
              <td className="px-6 py-4">
                <p className="font-bold text-gray-900">{payment.user.name || "Anonymous"}</p>
                <p className="text-xs text-gray-500">{payment.user.email}</p>
              </td>
              <td className="px-6 py-4 font-black text-gray-900">
                ${payment.amount.toFixed(2)}
              </td>
              <td className="px-6 py-4">
                <span className="capitalize text-gray-600">{payment.type.replace('_', ' ')}</span>
              </td>
              <td className="px-6 py-4">
                <span className="px-2 py-0.5 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase">
                  {payment.status}
                </span>
              </td>
              <td className="px-6 py-4 text-gray-500 text-xs">
                {new Date(payment.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {payments.length === 0 && (
        <div className="p-12 text-center text-gray-500 italic">
          No payments recorded yet.
        </div>
      )}
    </div>
  );
};
