"use client";

import { useState } from "react";
import { CheckSquare, Square, Trash2, Plus, Calendar, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface Task {
  id: string;
  title: string;
  description: string | null;
  dueDate: string | null;
  status: string;
}

interface CrmTasksManagerProps {
  userId: string;
  initialTasks: Task[];
}

export const CrmTasksManager = ({ userId, initialTasks }: CrmTasksManagerProps) => {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actingId, setActingId] = useState<string | null>(null);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || newTitle.trim().length < 3) return;

    try {
      setIsSubmitting(true);

      const response = await fetch("/api/admin/crm/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          title: newTitle,
          description: newDescription || null,
          dueDate: newDueDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const newTask = await response.json();
      setTasks((prev) => [newTask, ...prev]);
      setNewTitle("");
      setNewDescription("");
      setNewDueDate("");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to add task. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      setActingId(taskId);

      const response = await fetch("/api/admin/crm/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ taskId }),
      });

      if (!response.ok) {
        throw new Error("Failed to toggle task");
      }

      const updatedTask = await response.json();
      setTasks((prev) =>
        prev.map((t) => (t.id === taskId ? { ...t, status: updatedTask.status } : t))
      );
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to update task. Please try again.");
    } finally {
      setActingId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm("Delete this task reminder?")) return;

    try {
      setActingId(taskId);

      const response = await fetch(`/api/admin/crm/tasks?taskId=${taskId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      setTasks((prev) => prev.filter((t) => t.id !== taskId));
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete task. Please try again.");
    } finally {
      setActingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-base font-black text-slate-800 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-3">
        <CheckSquare className="w-5 h-5 text-indigo-500" /> Lead Follow-up Tasks
      </h3>

      {/* Task Creation Form */}
      <form onSubmit={handleAddTask} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-3 select-none">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Task Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Schedule onboarding call"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Due Date (Optional)</label>
            <input
              type="date"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 outline-none focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[9px] font-black text-slate-500 uppercase tracking-wider">Description (Optional)</label>
          <input
            type="text"
            placeholder="e.g. Discuss valuation logic and financial verified metrics check."
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:border-indigo-500 transition-all"
          />
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={isSubmitting || !newTitle.trim() || newTitle.trim().length < 3}
            className="inline-flex items-center gap-1 bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            Add Reminder Task
          </button>
        </div>
      </form>

      {/* Task Checklist */}
      <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
        {tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 italic">
            No follow-up tasks registered.
          </div>
        ) : (
          tasks.map((task) => {
            const isCompleted = task.status === "COMPLETED";

            return (
              <div
                key={task.id}
                className={`flex items-start justify-between gap-4 p-4 bg-white border rounded-2xl shadow-xs transition-all relative ${
                  isCompleted ? "border-slate-100 opacity-60" : "border-slate-200/80"
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <button
                    onClick={() => handleToggleTask(task.id)}
                    disabled={actingId === task.id}
                    className="mt-0.5 text-slate-400 hover:text-indigo-600 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                  >
                    {isCompleted ? (
                      <CheckSquare className="w-4.5 h-4.5 text-emerald-600 stroke-[2.2]" />
                    ) : (
                      <Square className="w-4.5 h-4.5 stroke-[2.2]" />
                    )}
                  </button>

                  <div className="space-y-1 min-w-0 select-none">
                    <p className={`text-xs font-black text-slate-800 leading-snug break-words ${
                      isCompleted ? "line-through text-slate-400" : ""
                    }`}>
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] text-slate-500 font-medium break-words leading-relaxed">
                        {task.description}
                      </p>
                    )}
                    {task.dueDate && (
                      <span className="inline-flex items-center gap-1 text-[9px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100/40">
                        <Calendar className="w-3 h-3" />
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  disabled={actingId === task.id}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                {actingId === task.id && (
                  <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center rounded-2xl">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
