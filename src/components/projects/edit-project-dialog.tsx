"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { updateProject } from "@/server/actions/projects";
import { toast } from "sonner";
import { format } from "date-fns";

export function EditProjectDialog({ project, clients }: { project: any, clients: any[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [paymentType, setPaymentType] = useState<string>(project?.paymentType || "one_time");

  // Helper to format Date to YYYY-MM-DD for native input date
  const formatDateForInput = (dateString?: string | Date | null) => {
    if (!dateString) return "";
    return format(new Date(dateString), "yyyy-MM-dd");
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Parse values
    const startDateStr = formData.get("startDate") as string;
    const deadlineStr = formData.get("deadline") as string;
    
    const data = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as any,
      clientId: formData.get("clientId") as string || undefined,
      paymentType: paymentType,
      totalPrice: paymentType !== "monthly" && formData.get("totalPrice") ? Number(formData.get("totalPrice")) : null,
      monthlyRate: paymentType === "monthly" && formData.get("monthlyRate") ? Number(formData.get("monthlyRate")) : null,
      startDate: startDateStr ? new Date(startDateStr) : null,
      deadline: deadlineStr ? new Date(deadlineStr) : null,
    };

    startTransition(async () => {
      const res = await updateProject(project.id, data as any);
      if (res.success) {
        toast.success("Project updated successfully");
        setOpen(false);
      } else {
        toast.error(res.error || "Failed to update project");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button 
            type="button"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-background hover:bg-muted hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Settings className="h-4 w-4" />
          </button>
        } 
      />
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>Update project details and deadlines.</DialogDescription>
          </DialogHeader>
          <div className="grid md:grid-cols-2 gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input id="name" name="name" defaultValue={project.name} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select name="status" defaultValue={project.status}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_started">Not Started</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="near_done">Near Done</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="clientId">Client</Label>
              <Select name="clientId" defaultValue={project.clientId || ""}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No Client</SelectItem>
                  {clients?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select name="paymentType" value={paymentType} onValueChange={setPaymentType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select payment type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one_time">One-Time Project</SelectItem>
                  <SelectItem value="milestone">Milestone-based</SelectItem>
                  <SelectItem value="monthly">Monthly Retainer (Maintenance)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {paymentType === "monthly" ? (
              <div key="monthly-rate-field" className="grid gap-2">
                <Label htmlFor="monthlyRate">Monthly Rate (THB)</Label>
                <Input id="monthlyRate" name="monthlyRate" type="number" step="0.01" defaultValue={project.monthlyRate ? Number(project.monthlyRate) : ""} />
              </div>
            ) : (
              <div key="total-price-field" className="grid gap-2">
                <Label htmlFor="totalPrice">Total Price (THB)</Label>
                <Input id="totalPrice" name="totalPrice" type="number" step="0.01" defaultValue={project.totalPrice ? Number(project.totalPrice) : ""} />
              </div>
            )}

            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={formatDateForInput(project.startDate)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="deadline">Deadline</Label>
              <Input id="deadline" name="deadline" type="date" defaultValue={formatDateForInput(project.deadline)} />
            </div>

            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={project.description || ""} placeholder="Add a short description" />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
