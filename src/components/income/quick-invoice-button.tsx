"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { createIncomeEntry } from "@/server/actions/income";
import { toast } from "sonner";
import { format } from "date-fns";

interface QuickInvoiceButtonProps {
  projectId: string;
  monthlyRate: number;
}

export function QuickInvoiceButton({ projectId, monthlyRate }: QuickInvoiceButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(async () => {
      const currentMonth = format(new Date(), "MMMM yyyy");
      const data = {
        projectId,
        amount: monthlyRate,
        label: `Maintenance Fee - ${currentMonth}`,
      };

      const res = await createIncomeEntry(data as any);
      if (res.success) {
        toast.success(`Generated invoice for ${currentMonth}`);
      } else {
        toast.error(res.error || "Failed to generate invoice");
      }
    });
  };

  return (
    <Button size="sm" variant="outline" onClick={handleGenerate} disabled={isPending}>
      <FileText className="mr-2 h-4 w-4" />
      {isPending ? "Generating..." : "Quick Monthly Invoice"}
    </Button>
  );
}
