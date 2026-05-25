"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Send, Loader2, FileText, ArrowDown } from "lucide-react";

interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  sender: {
    name: string | null;
    image: string | null;
  };
}

interface ChatInterfaceProps {
  dealId: string;
  receiverId: string;
  initialMessages: any[];
}

export const ChatInterface = ({ dealId, receiverId, initialMessages }: ChatInterfaceProps) => {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNewMessageBadge, setShowNewMessageBadge] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  // Check if user is scrolled near the bottom (within 150px)
  const isNearBottom = () => {
    const container = messagesContainerRef.current;
    if (!container) return false;
    const threshold = 150;
    return container.scrollHeight - container.scrollTop - container.clientHeight <= threshold;
  };

  // Scroll to bottom helper
  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior,
      });
    }
  };

  // Handle initial page load scroll
  useEffect(() => {
    if (isInitialMount.current && messages.length > 0) {
      scrollToBottom("auto");
      isInitialMount.current = false;
    }
  }, [messages]);

  // Handle updates to messages (both polling and sending)
  useEffect(() => {
    if (!isInitialMount.current && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      const isMe = lastMsg?.senderId === (session?.user as any)?.id;

      if (isMe || isNearBottom()) {
        scrollToBottom("smooth");
        setShowNewMessageBadge(false);
      }
    }
  }, [messages, session]);

  // Polling for new messages (MVP simple realtime)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/messages?dealId=${dealId}`);
        if (res.ok) {
          const data = await res.json();
          // Smart update: Only update state if data actually has new messages
          setMessages((prev) => {
            const hasNewMessages =
              prev.length !== data.length ||
              (prev.length > 0 &&
                prev[prev.length - 1]?.id !== data[data.length - 1]?.id);

            if (!hasNewMessages) {
              return prev; // keeps exact reference, triggers no re-renders
            }

            // Check if last message is from other party and user is scrolled up
            const lastNewMsg = data[data.length - 1];
            const isMe = lastNewMsg?.senderId === (session?.user as any)?.id;

            if (!isMe && !isNearBottom()) {
              setShowNewMessageBadge(true);
            }

            return data;
          });
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, [dealId, session]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newMessage,
          dealId,
          receiverId,
        }),
      });

      if (response.ok) {
        const sentMsg = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            ...sentMsg,
            sender: { name: session?.user?.name, image: session?.user?.image },
          },
        ]);
        setNewMessage("");
        setShowNewMessageBadge(false);
        // Force scroll down smoothly
        setTimeout(() => scrollToBottom("smooth"), 50);
      }
    } catch (error) {
      console.error("Send error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async () => {
    // Simulated file upload for MVP
    setIsLoading(true);
    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: "📎 Shared a document: financial_report.pdf",
          dealId,
          receiverId,
        }),
      });

      if (response.ok) {
        const sentMsg = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            ...sentMsg,
            sender: { name: session?.user?.name, image: session?.user?.image },
          },
        ]);
        setShowNewMessageBadge(false);
        // Force scroll down smoothly
        setTimeout(() => scrollToBottom("smooth"), 50);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    if (isNearBottom()) {
      setShowNewMessageBadge(false);
    }
  };

  return (
    <div className="relative flex flex-col h-[650px] bg-white border border-slate-200/80 rounded-2xl shadow-premium overflow-hidden transition-all">
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto p-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-300"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
              <FileText className="w-6 h-6 text-slate-300" />
            </div>
            <p className="text-sm font-semibold text-slate-600">No messages yet</p>
            <p className="text-xs text-slate-400 mt-1 max-w-[240px]">
              Start the discussion! Inquire about financials, metrics, or transition support.
            </p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === (session?.user as any)?.id;
            const isAttachment = msg.content.includes("📎 Shared a document:");
            const documentName = isAttachment
              ? msg.content.replace("📎 Shared a document:", "").trim()
              : "";

            return (
              <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center overflow-hidden shadow-sm border border-slate-100 ${
                      isMe
                        ? "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold"
                        : "bg-slate-100 text-slate-600 font-bold"
                    }`}
                  >
                    {msg.sender.image ? (
                      <img src={msg.sender.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] uppercase">
                        {msg.sender.name?.[0] || (isMe ? "M" : "O")}
                      </span>
                    )}
                  </div>

                  {/* Bubble */}
                  <div className="space-y-1">
                    {!isMe && msg.sender.name && (
                      <p className="text-[10px] font-bold text-slate-500 ml-1">
                        {msg.sender.name}
                      </p>
                    )}
                    {isAttachment ? (
                      <div
                        className={`p-4 rounded-2xl text-sm border flex flex-col gap-3 shadow-sm ${
                          isMe
                            ? "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white border-blue-600/20 rounded-tr-none"
                            : "bg-slate-50 border-slate-100 text-slate-800 rounded-tl-none"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                              isMe ? "bg-white/10 text-white" : "bg-blue-50 text-blue-600"
                            }`}
                          >
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-semibold truncate ${
                                isMe ? "text-white" : "text-slate-900"
                              }`}
                            >
                              {documentName || "document.pdf"}
                            </p>
                            <p
                              className={`text-[10px] ${
                                isMe ? "text-blue-100" : "text-slate-400"
                              } mt-0.5`}
                            >
                              PDF Document • 1.2 MB
                            </p>
                          </div>
                        </div>
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            alert("Downloading file: " + documentName);
                          }}
                          className={`w-full text-center py-2 rounded-xl text-xs font-bold transition-all ${
                            isMe
                              ? "bg-white/20 text-white hover:bg-white/30"
                              : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/10"
                          }`}
                        >
                          Download Document
                        </a>
                      </div>
                    ) : (
                      <div
                        className={`p-3.5 px-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                          isMe
                            ? "bg-gradient-to-tr from-blue-600 to-indigo-500 text-white rounded-tr-none"
                            : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none"
                        }`}
                      >
                        {msg.content}
                      </div>
                    )}
                    <p
                      className={`text-[9px] text-slate-400 font-semibold mt-1 ${
                        isMe ? "text-right mr-1" : "text-left ml-1"
                      }`}
                    >
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Floating New Messages Badge */}
      {showNewMessageBadge && (
        <button
          type="button"
          onClick={() => {
            scrollToBottom("smooth");
            setShowNewMessageBadge(false);
          }}
          className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-premium flex items-center gap-1.5 transition-all duration-200 animate-bounce z-10 cursor-pointer"
        >
          <ArrowDown className="w-3.5 h-3.5" />
          New messages below
        </button>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 backdrop-blur-sm">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <button
            type="button"
            onClick={handleFileUpload}
            disabled={isLoading}
            className="p-2.5 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 active:scale-95 transition-all shadow-sm flex items-center justify-center"
            title="Share Document"
          >
            <FileText className="w-5 h-5" />
          </button>
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-white border border-slate-200/80 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm placeholder-slate-400"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isLoading}
            className="bg-blue-600 text-white p-2.5 px-3 rounded-xl hover:bg-blue-700 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none hover:shadow-lg hover:shadow-blue-500/20 active:scale-95 transition-all shadow-md shadow-blue-500/10 flex items-center justify-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

