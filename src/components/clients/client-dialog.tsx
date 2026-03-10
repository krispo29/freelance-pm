"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { createClient, updateClient } from "@/server/actions/clients";
import { toast } from "sonner";
import { Client } from "@/lib/validations/client";

interface ClientDialogProps {
  client?: Client;
  trigger?: React.ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ClientDialog({ client, trigger, open: controlledOpen, onOpenChange: setControlledOpen }: ClientDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen;
  const setOpen = setControlledOpen !== undefined ? setControlledOpen : setUncontrolledOpen;

  const [isPending, startTransition] = useTransition();

  const isEditing = !!client;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
    };

    startTransition(async () => {
      let res;
      if (isEditing) {
        res = await updateClient(client.id, data);
      } else {
        res = await createClient(data);
      }

      if (res.success) {
        toast.success(isEditing ? "Client updated successfully" : "Client created successfully");
        setOpen(false);
      } else {
        toast.error(res.error || (isEditing ? "Failed to update client" : "Failed to create client"));
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger 
        render={trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Client
          </Button>
        )} 
      />
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Client" : "Add New Client"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the details of your client." : "Enter the details of your new client."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input id="name" name="name" defaultValue={client?.name || ""} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" name="company" defaultValue={client?.company || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" defaultValue={client?.email || ""} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={client?.phone || ""} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : (isEditing ? "Update Client" : "Save Client")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
