import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock } from "lucide-react";
import TicketReplyForm from "@/components/support/TicketReplyForm";
import AdminTicketActions from "@/components/support/AdminTicketActions";
import Image from "next/image";

async function getTicketDetails(id: string) {
  return await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      user: {
        select: { name: true, email: true, image: true, role: true }
      },
      messages: {
        include: {
          sender: {
            select: { name: true, image: true, role: true }
          }
        },
        orderBy: { createdAt: "asc" }
      }
    }
  });
}

export default async function AdminTicketDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!session || !session.user || (session.user as any).role !== "ADMIN") {
    redirect("/");
  }

  const { id } = await params;
  
  const ticket = await getTicketDetails(id);

  if (!ticket) {
    return (
      <div className="container mx-auto px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Ticket not found</h1>
        <Link href="/admin/support" className="text-blue-600 hover:underline">
          Return to Support Dashboard
        </Link>
      </div>
    );
  }

  const isClosed = ticket.status === "CLOSED" || ticket.status === "RESOLVED";

  return (
    <div className="max-w-4xl">
      <Link href="/admin/support" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 font-medium">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Support Dashboard
      </Link>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="px-6 py-6 border-b border-gray-200 bg-gray-50 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wide
                ${ticket.status === 'OPEN' ? 'bg-yellow-100 text-yellow-800' : ''}
                ${ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-800' : ''}
                ${ticket.status === 'RESOLVED' ? 'bg-green-100 text-green-800' : ''}
                ${ticket.status === 'CLOSED' ? 'bg-gray-100 text-gray-800' : ''}
              `}>
                {ticket.status.replace('_', ' ')}
              </span>
              <span className={`text-xs font-bold px-3 py-1 rounded-full border
                ${ticket.priority === 'HIGH' ? 'border-red-200 text-red-600 bg-red-50' : ''}
                ${ticket.priority === 'MEDIUM' ? 'border-orange-200 text-orange-600 bg-orange-50' : ''}
                ${ticket.priority === 'LOW' ? 'border-blue-200 text-blue-600 bg-blue-50' : ''}
              `}>
                {ticket.priority}
              </span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">{ticket.subject}</h1>
            <div className="flex flex-col gap-1 mt-3 text-sm text-gray-500">
              <span>Reported by: <span className="font-medium text-gray-900">{ticket.user.name} ({ticket.user.email})</span></span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" /> Opened {new Date(ticket.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          
          <AdminTicketActions ticketId={ticket.id} currentStatus={ticket.status} />
        </div>

        <div className="p-6">
          <div className="space-y-8">
            {ticket.messages.map((message) => {
              const isAdmin = message.sender.role === "ADMIN";
              return (
                <div key={message.id} className={`flex gap-4 ${isAdmin ? 'bg-blue-50/50 p-4 rounded-xl border border-blue-100' : ''}`}>
                  <div className="flex-shrink-0">
                    {message.sender.image ? (
                      <Image 
                        src={message.sender.image} 
                        alt={message.sender.name || "User"} 
                        width={40} 
                        height={40} 
                        className="rounded-full"
                      />
                    ) : (
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${isAdmin ? 'bg-blue-600' : 'bg-gray-400'}`}>
                        {message.sender.name?.charAt(0) || "U"}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-bold text-gray-900">
                        {message.sender.name || "User"}
                        {isAdmin && <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded uppercase tracking-wide">Support</span>}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(message.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-gray-700 whitespace-pre-wrap">
                      {message.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <TicketReplyForm ticketId={ticket.id} isClosed={isClosed} />
        </div>
      </div>
    </div>
  );
}
