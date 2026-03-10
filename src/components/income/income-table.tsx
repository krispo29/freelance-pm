"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Trash2 } from "lucide-react";
import { markIncomeReceived, deleteIncomeEntry } from "@/server/actions/income";
import { useTransition } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface IncomeTableProps {
  entries: any[];
  showProject?: boolean;
}

export function IncomeTable({ entries, showProject = false }: IncomeTableProps) {
  const [isPending, startTransition] = useTransition();

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center p-8 border border-dashed rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No income entries found.</p>
      </div>
    );
  }

  const handleMarkReceived = (id: string, projectId: string) => {
    startTransition(async () => {
      const res = await markIncomeReceived(id, projectId);
      if (res.success) {
        toast.success("Marked as received");
      } else {
        toast.error("Failed to update status");
      }
    });
  };

  const handleDelete = (id: string, projectId: string) => {
    toast("Confirm Deletion", {
      description: "Are you sure you want to delete this entry?",
      action: {
        label: "Delete",
        onClick: () => {
          startTransition(async () => {
            const res = await deleteIncomeEntry(id, projectId);
            if (res.success) {
              toast.success("Entry deleted");
            } else {
              toast.error("Failed to delete entry");
            }
          });
        }
      },
      cancel: {
        label: "Cancel",
        onClick: () => {}
      }
    });
  };

  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Label</TableHead>
            {showProject && <TableHead>Project</TableHead>}
            <TableHead>Amount (THB)</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {entries.map((entry) => {
            const isOverdue = entry.status === "pending" && entry.dueDate && new Date(entry.dueDate) < new Date();
            
            return (
              <TableRow key={entry.id} className={isPending ? "opacity-50 pointer-events-none" : ""}>
                <TableCell className="font-medium">{entry.label}</TableCell>
                {showProject && (
                  <TableCell>
                    {entry.project ? (
                      <Link href={`/projects/${entry.projectId}`} className="hover:underline text-primary">
                        {entry.project.name}
                      </Link>
                    ) : "-"}
                  </TableCell>
                )}
                <TableCell>{Number(entry.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}</TableCell>
                <TableCell>
                  {entry.dueDate ? format(new Date(entry.dueDate), "dd MMM yyyy") : "-"}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={entry.status === "received" ? "default" : isOverdue ? "destructive" : "secondary"}
                    className={cn(entry.status === "received" && "bg-green-500 hover:bg-green-600")}
                  >
                    {isOverdue ? "Overdue" : entry.status === "received" ? "Received" : "Pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {entry.status !== "received" && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleMarkReceived(entry.id, entry.projectId)}
                        title="Mark as received"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1 text-green-500" />
                        Receive
                      </Button>
                    )}
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(entry.id, entry.projectId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
