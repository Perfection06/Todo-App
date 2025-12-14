import { completeTask } from "../lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Circle } from "lucide-react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: number;
  created_at: string;
}

interface Props {
  task: Task;
  onComplete: () => void;
  formatDate: (date: string) => string;
}

export default function TaskCard({ task, onComplete, formatDate }: Props) {
  const handleComplete = async () => {
    await completeTask(task.id);
    onComplete();
  };

  return (
    <Card className="p-7 hover:shadow-lg transition-shadow border">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-gray-700 mb-4 leading-relaxed">{task.description}</p>
          )}
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Circle className="w-4 h-4" fill="currentColor" />
            {formatDate(task.created_at)}
          </p>
        </div>

        <Button
          onClick={handleComplete}
          variant="outline"
          size="lg"
          className="border-2 hover:bg-gray-100"
        >
          Complete
        </Button>
      </div>
    </Card>
  );
}