"use client";

import { useState } from "react";
import { MessageSquare, Save, Clock, Trash2, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

interface Note {
  id: string;
  content: string;
  createdAt: string;
  admin: {
    name: string | null;
  };
}

interface CrmNotesManagerProps {
  userId: string;
  initialNotes: Note[];
}

export const CrmNotesManager = ({ userId, initialNotes }: CrmNotesManagerProps) => {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteContent.trim() || newNoteContent.trim().length < 2) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/crm/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, content: newNoteContent }),
      });

      if (!response.ok) {
        throw new Error("Failed to save note");
      }

      const newNote = await response.json();
      
      // Update state locally
      setNotes((prev) => [newNote, ...prev]);
      setNewNoteContent("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to add note. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
        <MessageSquare className="w-5 h-5 text-indigo-500" /> Administrative Log Notes
      </h3>

      {/* Note Form */}
      <form onSubmit={handleAddNote} className="space-y-3">
        <textarea
          rows={3}
          value={newNoteContent}
          onChange={(e) => setNewNoteContent(e.target.value)}
          placeholder="e.g. Spoke on Google Meet. Seller verified monthly recurring traffic of 45k. High intent lead."
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3.5 text-xs outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all resize-none"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !newNoteContent.trim() || newNoteContent.trim().length < 2}
            className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            Log Interaction Note
          </button>
        </div>
      </form>

      {/* Notes List */}
      <div className="relative border-l-2 border-indigo-100 pl-6 ml-2 space-y-6 max-h-[400px] overflow-y-auto pr-1.5 custom-scrollbar select-none">
        {notes.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 italic">
            No administrative notes logged for this user.
          </div>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="relative group">
              {/* Timeline Bullet */}
              <span className="absolute -left-[31px] top-1.5 bg-indigo-600 w-2.5 h-2.5 rounded-full border-4 border-white ring-4 ring-indigo-50" />
              
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-indigo-500" />
                    {note.admin?.name || "Administrator"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 stroke-[2.2]" />
                    {new Date(note.createdAt).toLocaleDateString()} at{" "}
                    {new Date(note.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium whitespace-pre-line">
                  {note.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
