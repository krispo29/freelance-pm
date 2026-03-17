"use client";

import { TaskItem } from "./task-item";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { useState, useTransition, useEffect } from "react";
import { reorderTasks } from "@/server/actions/tasks";
import { toast } from "sonner";

interface TaskListProps {
  tasks: any[];
}

export function TaskList({ tasks: initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No tasks yet. Add one below!</p>
      </div>
    );
  }

  const activeTasks = tasks
    .filter(t => t.status !== "done")
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  
  const completedTasks = tasks.filter(t => t.status === "done");

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    
    const items = Array.from(activeTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update local state
    const newTasks = [
      ...items,
      ...completedTasks
    ];
    setTasks(newTasks);

    // Save to DB
    startTransition(async () => {
      const ids = items.map(t => t.id);
      const projectId = items[0].projectId;
      const res = await reorderTasks(projectId, ids);
      if (!res.success) toast.error("Failed to reorder tasks");
    });
  };

  return (
    <div className="space-y-6">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="active-tasks">
          {(provided) => (
            <div 
              {...provided.droppableProps} 
              ref={provided.innerRef} 
              className="space-y-2"
            >
              {activeTasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={snapshot.isDragging ? "z-50" : ""}
                    >
                      <TaskItem task={task} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
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
