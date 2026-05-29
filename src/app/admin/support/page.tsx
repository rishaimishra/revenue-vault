import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MessageSquare, Clock } from "lucide-react";

async function getTickets(status?: string) {
  const whereClause: Record<string, unknown> = {};
  if (status && status !== "ALL") {
    whereClause.status = status;
  }

  return await prisma.supportTicket.findMany({
    where: whereClause,
    include: {
      user: {
        select: { name: true, email: true, image: true }
      },
      _count: {
        select: { messages: true }
      }
    },
    orderBy: [
      { status: 'asc' }, // Open tickets first ideally, but this is alphabetical.
      { updatedAt: 'desc' }
    ]
  });
}

export default async function AdminSupportDashboard({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const session = await getServerSession(authOptions);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const currentStatus = searchParams.status || "ALL";
  const tickets = await getTickets(currentStatus);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-500">Manage and resolve user issues.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex gap-2">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((status) => (
              <Link
                key={status}
                href={`/admin/support${status === 'ALL' ? '' : `?status=${status}`}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  currentStatus === status
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {status.replace('_', ' ')}
              </Link>
            ))}
          </div>
        </div>

        {/* Tickets List */}
        <div className="divide-y divide-gray-200">
          {tickets.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              No tickets found for the selected filter.
            </div>
          ) : (
            tickets.map((ticket) => (
              <Link 
                key={ticket.id} 
                href={`/admin/support/${ticket.id}`}
                className="block p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col gap-1 items-start w-32">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider
                        ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : ''}
                        ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : ''}
                        ${ticket.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider border
                        ${ticket.priority === 'HIGH' ? 'border-red-200 text-red-600 bg-red-50' : ''}
                        ${ticket.priority === 'MEDIUM' ? 'border-orange-200 text-orange-600 bg-orange-50' : ''}
                        ${ticket.priority === 'LOW' ? 'border-blue-200 text-blue-600 bg-blue-50' : ''}
                      `}>
                        {ticket.priority}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 line-clamp-1">{ticket.subject}</h4>
                      <p className="text-sm text-gray-500">{ticket.user.name} ({ticket.user.email})</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" /> {ticket._count.messages}
                    </span>
                    <span className="flex items-center gap-1.5 w-32 justify-end">
                      <Clock className="w-4 h-4" /> {new Date(ticket.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
