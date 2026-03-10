"use client";

import { TaskItem } from "./task-item";

interface TaskListProps {
  tasks: any[];
}

export function TaskList({ tasks }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No tasks yet. Add one below!</p>
      </div>
    );
  }

  // Split tasks into active and completed
  const activeTasks = tasks.filter(t => t.status !== "done");
  const completedTasks = tasks.filter(t => t.status === "done");

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        {activeTasks.map(task => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>
      
      {completedTasks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-muted-foreground mt-6 mb-3">Completed</h4>
          {completedTasks.map(task => (
             <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
}
