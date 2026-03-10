import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/40">
      <Sidebar />
      <div className="flex w-full flex-col">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
