import { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Edit2, Trash2, CheckCircle2, Check, X } from "lucide-react";

const API_URL = "http://localhost/todo_app/backend";

async function getUncompletedTasks() {
  const res = await fetch(`${API_URL}/tasks/uncompleted`);
  return res.json();
}

async function getCompletedTasks() {
  const res = await fetch(`${API_URL}/tasks/completed`);
  return res.json();
}

async function completeTask(id: number) {
  const res = await fetch(`${API_URL}/tasks/complete/${id}`);
  return res.json();
}

async function deleteTask(id: number) {
  const res = await fetch(`${API_URL}/tasks/delete/${id}`);
  return res.json();
}

async function getUncompletedCount() {
  const res = await fetch(`${API_URL}/tasks/count`);
  return res.json();
}

async function updateTask(id: number, title: string, description: string) {
  const res = await fetch(`${API_URL}/tasks/update/${id}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  return res.json();
}

async function createTask(title: string, description: string) {
  const res = await fetch(`${API_URL}/tasks/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
  return res.json();
}

interface Task {
  id: number;
  title: string;
  description: string;
  completed: number;
  created_at: string;
}

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [uncompletedCount, setUncompletedCount] = useState(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      let data;
      if (showCompleted) {
        data = await getCompletedTasks();
      } else {
        data = await getUncompletedTasks();
      }
      
      data.sort((a: Task, b: Task) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setTasks(data);
      
      const countData = await getUncompletedCount();
      setUncompletedCount(countData.uncompleted_count);
    } catch (error) {
      console.error("Error loading tasks:", error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [showCompleted]);

  useEffect(() => {
    loadTasks();
    setShowAll(false);
  }, [loadTasks]);

  const completedCount = tasks.length;
  const recentTasks = showCompleted ? tasks : tasks.slice(0, 5);
  const olderTasks = showCompleted ? [] : tasks.slice(5);

  const handleTaskCreated = async () => {
    if (!newTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask(newTitle, newDesc);
      toast.success("Task added!");
      setNewTitle("");
      setNewDesc("");
      loadTasks();
    } catch {
      toast.error("Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTaskCompleted = async (id: number) => {
    try {
      const result = await completeTask(id);
      if (result.success) {
        toast.success("Task completed!");
        loadTasks();
      } else {
        toast.error("Failed to complete task");
      }
    } catch {
      toast.error("Failed to complete task");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this task?")) return;

    try {
      const result = await deleteTask(id);
      if (result.success) {
        toast.success("Task deleted!");
        loadTasks();
      } else {
        toast.error("Failed to delete task");
      }
    } catch {
      toast.error("Failed to delete task");
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDesc(task.description);
  };

  const saveEdit = async () => {
    if (!editTitle.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      const result = await updateTask(editingId!, editTitle, editDesc);
      if (result.success) {
        toast.success("Task updated!");
        loadTasks();
        setEditingId(null);
        setEditTitle("");
        setEditDesc("");
      } else {
        toast.error("Failed to update task");
      }
    } catch {
      toast.error("Failed to update task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDesc("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleKeyPress = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      action();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-black tracking-tight">Tasks</h1>
                <p className="text-sm sm:text-base text-gray-600 mt-1">
                  {uncompletedCount === 0 ? "All done!" : `${uncompletedCount} pending`}
                  {showCompleted && completedCount > 0 && ` • ${completedCount} completed`}
                </p>
              </div>
              
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className={`px-4 py-2.5 rounded-lg font-medium transition-all text-sm sm:text-base ${
                  showCompleted
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-100 text-black hover:bg-gray-200 border border-gray-300'
                }`}
              >
                {showCompleted ? "Show Active" : "Show Completed"}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Left: Form (2 columns on large screens) */}
            <div className="lg:col-span-2">
              <div className="sticky top-32">
                <Card className="border border-gray-200 shadow-sm">
                  <div className="p-6">
                    <h2 className="text-xl font-semibold mb-5 text-black">New Task</h2>
                    <div className="space-y-4">
                      <div>
                        <input
                          type="text"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, handleTaskCreated)}
                          placeholder="Task title"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-400"
                          disabled={isSubmitting}
                        />
                      </div>
                      <div>
                        <textarea
                          value={newDesc}
                          onChange={(e) => setNewDesc(e.target.value)}
                          onKeyPress={(e) => handleKeyPress(e, handleTaskCreated)}
                          placeholder="Description (optional)"
                          rows={4}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none text-black placeholder-gray-400"
                          disabled={isSubmitting}
                        />
                      </div>
                      <button
                        onClick={handleTaskCreated}
                        disabled={isSubmitting}
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Adding..." : "Add Task"}
                      </button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right: Task List (3 columns on large screens) */}
            <div className="lg:col-span-3">
              <div className="space-y-4">
                {loading ? (
                  [...Array(4)].map((_, i) => (
                    <Card key={i} className="border border-gray-200 p-5">
                      <Skeleton className="h-6 w-3/4 mb-3 bg-gray-200" />
                      <Skeleton className="h-4 w-full mb-2 bg-gray-200" />
                      <Skeleton className="h-4 w-32 bg-gray-200" />
                    </Card>
                  ))
                ) : tasks.length === 0 ? (
                  <Card className="border-2 border-dashed border-gray-300 p-12 sm:p-20 text-center">
                    <div className="text-gray-400">
                      <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-lg font-medium">
                        {showCompleted ? "No completed tasks yet" : "No pending tasks"}
                      </p>
                    </div>
                  </Card>
                ) : (
                  <>
                    {recentTasks.map((task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        isEditing={editingId === task.id}
                        editTitle={editTitle}
                        editDesc={editDesc}
                        setEditTitle={setEditTitle}
                        setEditDesc={setEditDesc}
                        onComplete={() => handleTaskCompleted(task.id)}
                        onDelete={() => handleDelete(task.id)}
                        onEdit={() => startEdit(task)}
                        onSave={saveEdit}
                        onCancel={cancelEdit}
                        formatDate={formatDate}
                        showCompleted={showCompleted}
                      />
                    ))}

                    {!showCompleted && olderTasks.length > 0 && (
                      <div className="pt-2">
                        <button
                          onClick={() => setShowAll(!showAll)}
                          className="w-full flex items-center justify-center gap-2 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg font-medium text-black transition-colors border border-gray-200"
                        >
                          {showAll ? (
                            <>
                              <ChevronUp className="w-5 h-5" />
                              Hide {olderTasks.length} older
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-5 h-5" />
                              Show {olderTasks.length} older
                            </>
                          )}
                        </button>

                        {showAll && (
                          <div className="mt-4 space-y-4">
                            {olderTasks.map((task) => (
                              <TaskItem
                                key={task.id}
                                task={task}
                                isEditing={editingId === task.id}
                                editTitle={editTitle}
                                editDesc={editDesc}
                                setEditTitle={setEditTitle}
                                setEditDesc={setEditDesc}
                                onComplete={() => handleTaskCompleted(task.id)}
                                onDelete={() => handleDelete(task.id)}
                                onEdit={() => startEdit(task)}
                                onSave={saveEdit}
                                onCancel={cancelEdit}
                                formatDate={formatDate}
                                showCompleted={showCompleted}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Toaster position="bottom-center" richColors closeButton />
    </>
  );
}

interface TaskItemProps {
  task: Task;
  isEditing: boolean;
  editTitle: string;
  editDesc: string;
  setEditTitle: (value: string) => void;
  setEditDesc: (value: string) => void;
  onComplete: () => void;
  onDelete: () => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  formatDate: (dateString: string) => string;
  showCompleted: boolean;
}

function TaskItem({
  task,
  isEditing,
  editTitle,
  editDesc,
  setEditTitle,
  setEditDesc,
  onComplete,
  onDelete,
  onEdit,
  onSave,
  onCancel,
  formatDate,
  showCompleted,
}: TaskItemProps) {
  const isCompleted = task.completed === 1;

  if (isEditing) {
    return (
      <Card className="border-2 border-black p-5">
        <div className="space-y-4">
          <input
            className="w-full text-lg font-medium px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            autoFocus
          />
          <textarea
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
            rows={3}
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Description"
          />
          <div className="flex gap-3">
            <button 
              onClick={onSave} 
              className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              <Check className="w-4 h-4" />
              Save
            </button>
            <button 
              onClick={onCancel} 
              className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`border border-gray-200 hover:border-gray-300 transition-all group ${
      isCompleted ? 'bg-gray-50' : 'bg-white hover:shadow-sm'
    }`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-3">
              {isCompleted && (
                <CheckCircle2 className="w-5 h-5 text-black mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className={`text-lg font-semibold mb-1 break-words ${
                  isCompleted ? 'text-gray-500 line-through' : 'text-black'
                }`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm mb-3 break-words ${
                    isCompleted ? 'text-gray-400 line-through' : 'text-gray-600'
                  }`}>
                    {task.description}
                  </p>
                )}
                <p className="text-xs text-gray-500">
                  {formatDate(task.created_at)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {!showCompleted && (
              <>
                <button
                  onClick={onEdit}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={onComplete}
                  className="hidden sm:block px-3 py-1.5 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                  title="Complete"
                >
                  Done
                </button>
                <button
                  onClick={onComplete}
                  className="sm:hidden p-2 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors"
                  title="Complete"
                >
                  <Check className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onDelete}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Delete"
            >
              <Trash2 className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}