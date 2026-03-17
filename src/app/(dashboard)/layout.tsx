import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background text-foreground relative overflow-hidden transition-colors duration-500">
      {/* Background Ambient Orbs */}
      <div className="ambient-blob w-[500px] h-[500px] bg-indigo/20 top-[-100px] left-[-100px]" />
      <div className="ambient-blob w-[400px] h-[400px] bg-teal/10 bottom-[100px] right-[-100px]" />
      
      <Sidebar />
      
      <div className="flex w-full flex-col relative z-10">
        <Topbar />
        <main className="flex-1 p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
