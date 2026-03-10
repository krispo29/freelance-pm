"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createIncomeEntry } from "@/server/actions/income";
import { toast } from "sonner";

export function IncomeDialog({ projects, defaultProjectId }: { projects: any[], defaultProjectId?: string }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      label: formData.get("label") as string,
      amount: Number(formData.get("amount")),
      projectId: formData.get("projectId") as string,
    };

    if (!data.projectId) {
      toast.error("Please select a project");
      return;
    }

    startTransition(async () => {
      const res = await createIncomeEntry(data as any);
      if (res.success) {
        toast.success("Income entry added");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to add income");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button size={defaultProjectId ? "sm" : "default"} />}>
        <Plus className="mr-2 h-4 w-4" /> Add Income
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add Income</DialogTitle>
            <DialogDescription>Record a new payment or invoice.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="label">Description *</Label>
              <Input id="label" name="label" placeholder="e.g. 50% Deposit" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (THB) *</Label>
              <Input id="amount" name="amount" type="number" step="0.01" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectId">Project *</Label>
              <Select name="projectId" defaultValue={defaultProjectId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a project" />
                </SelectTrigger>
                <SelectContent>
                  {projects?.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Income"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
