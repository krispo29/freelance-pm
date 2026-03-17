"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { List, LayoutGrid } from "lucide-react";
import { TaskList } from "./task-list";
import { TaskBoard } from "./task-board";

interface TaskViewSwitcherProps {
  tasks: any[];
  projectId: string;
}

export function TaskViewSwitcher({ tasks, projectId }: TaskViewSwitcherProps) {
  const [view, setView] = useState<"list" | "board">("list");

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Tabs value={view} onValueChange={(v) => setView(v as "list" | "board")} className="w-auto">
          <TabsList className="grid w-full grid-cols-2 h-9 p-1">
            <TabsTrigger value="list" className="px-3 py-1 text-xs">
              <List className="h-3.5 w-3.5 mr-1.5" /> List
            </TabsTrigger>
            <TabsTrigger value="board" className="px-3 py-1 text-xs">
              <LayoutGrid className="h-3.5 w-3.5 mr-1.5" /> Board
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {view === "list" ? (
        <TaskList tasks={tasks} />
      ) : (
        <TaskBoard tasks={tasks} projectId={projectId} />
      )}
    </div>
  );
}
