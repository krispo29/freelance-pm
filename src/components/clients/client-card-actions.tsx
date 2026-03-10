"use client";

import { useState, useTransition } from "react";
import { MoreVertical, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ClientDialog } from "@/components/clients/client-dialog";
import { deleteClient } from "@/server/actions/clients";
import { toast } from "sonner";
import { Client } from "@/lib/validations/client";

interface ClientCardActionsProps {
  client: Client;
}

export function ClientCardActions({ client }: ClientCardActionsProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    toast("Confirm Deletion", {
      description: `Are you sure you want to delete client "${client.name}"? This action cannot be undone.`,
      action: {
        label: "Delete",
        onClick: () => {
          startTransition(async () => {
            const res = await deleteClient(client.id);
            if (res.success) {
              toast.success("Client deleted successfully");
            } else {
              toast.error(res.error || "Failed to delete client");
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isPending}>
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ClientDialog 
        client={client} 
        open={isEditOpen} 
        onOpenChange={setIsEditOpen} 
        // We render it controlled without a trigger here
        trigger={<div className="hidden" />} 
      />
    </>
  );
}