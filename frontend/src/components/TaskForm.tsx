import { useState } from "react";
import { createTask } from "../lib/api";
import { Button } from "./ui/button";

interface TaskFormProps {
  onCreated: () => void;
}

export default function TaskForm({ onCreated }: TaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return; 

    await createTask(title, description);
    setTitle("");
    setDescription("");

    onCreated();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded">
      <input
        type="text"
        className="w-full p-2 border rounded"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        className="w-full p-2 border rounded"
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Button type="submit" className="w-full">
        Add Task
      </Button>
    </form>
  );
}
