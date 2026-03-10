"use client";

import { useState, useTransition } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { createProject } from "@/server/actions/projects";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ProjectDialog({ clients }: { clients: any[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [paymentType, setPaymentType] = useState<string>("one_time");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      clientId: formData.get("clientId") as string || undefined,
      paymentType: paymentType,
      totalPrice: formData.get("totalPrice") ? Number(formData.get("totalPrice")) : undefined,
      monthlyRate: formData.get("monthlyRate") ? Number(formData.get("monthlyRate")) : undefined,
    };

    startTransition(async () => {
      const res = await createProject(data as any);
      if (res.success) {
        toast.success("Project created successfully");
        setOpen(false);
        setPaymentType("one_time"); // reset
      } else {
        toast.error(res.error || "Failed to create project");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <button className={cn(buttonVariants({ variant: "default" }))}>
             <Plus className="mr-2 h-4 w-4" /> New Project
          </button>
        }
      />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>Add a new freelance project to your list.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="clientId">Client</Label>
              <Select name="clientId">
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="paymentType">Payment Type</Label>
              <Select name="paymentType" value={paymentType} onValueChange={(val) => val && setPaymentType(val)}>
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
                <Input id="monthlyRate" name="monthlyRate" type="number" step="0.01" />
              </div>
            ) : (
              <div key="total-price-field" className="grid gap-2">
                <Label htmlFor="totalPrice">Total Price (THB)</Label>
                <Input id="totalPrice" name="totalPrice" type="number" step="0.01" />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
