import { getAllIncome, getIncomeStats } from "@/server/actions/income";
import { getProjects } from "@/server/actions/projects";
import { IncomeTable } from "@/components/income/income-table";
import { IncomeDialog } from "@/components/income/income-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, AlertCircle, CheckCircle2 } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function IncomePage() {
  const [incomeEntries, stats, projects] = await Promise.all([
    getAllIncome(),
    getIncomeStats(),
    getProjects()
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income</h1>
          <p className="text-muted-foreground">Track all your payments and invoices.</p>
        </div>
        <IncomeDialog projects={projects} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Received</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{stats.totalReceived.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <Banknote className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">฿{stats.totalPending.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">฿{stats.totalOverdue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">All Transactions</h2>
        <IncomeTable entries={incomeEntries} showProject={true} />
      </div>
    </div>
  );
}
