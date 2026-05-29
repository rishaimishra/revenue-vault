import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LifeBuoy, PlusCircle, MessageSquare, Clock } from "lucide-react";

async function getTickets(userId: string) {
  return await prisma.supportTicket.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
    include: {
      _count: {
        select: { messages: true }
      }
    }
  });
}

export default async function UserSupportPage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/api/auth/signin");
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tickets = await getTickets((session.user as any).id);

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center gap-3">
            <LifeBuoy className="w-8 h-8 text-blue-600" /> Support Tickets
          </h1>
          <p className="text-gray-600 mt-2">Track your issues and communicate with our support team.</p>
        </div>
        <Link
          href="/dashboard/support/new"
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create Ticket
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {tickets.length === 0 ? (
          <div className="p-10 text-center">
            <LifeBuoy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">No tickets found</h3>
            <p className="text-gray-500 mb-6">You haven&apos;t opened any support tickets yet.</p>
            <Link
              href="/dashboard/support/new"
              className="text-blue-600 font-bold hover:underline"
            >
              Open your first ticket
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <Link 
                key={ticket.id} 
                href={`/dashboard/support/${ticket.id}`}
                className="block p-6 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wide
                        ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : ''}
                        ${ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : ''}
                        ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : ''}
                        ${ticket.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' : ''}
                      `}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded border
                        ${ticket.priority === 'HIGH' ? 'border-red-200 text-red-600 bg-red-50' : ''}
                        ${ticket.priority === 'MEDIUM' ? 'border-orange-200 text-orange-600 bg-orange-50' : ''}
                        ${ticket.priority === 'LOW' ? 'border-blue-200 text-blue-600 bg-blue-50' : ''}
                      `}>
                        {ticket.priority} PRIORITY
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {ticket.subject}
                    </h3>
                  </div>
                  
                  <div className="flex flex-col items-end gap-2 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" /> 
                      {new Date(ticket.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1 font-medium">
                      <MessageSquare className="w-4 h-4" />
                      {ticket._count.messages} messages
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
