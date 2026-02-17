import { Toaster } from "@/components/ui/sonner";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
       {/* Could add a simple header here if needed */}
       <header className="p-4 bg-white dark:bg-slate-900 shadow-sm flex justify-center">
            <h1 className="text-xl font-bold text-primary">Budzo Setup</h1>
       </header>
       <main className="container mx-auto py-10">
            {children}
       </main>
       <Toaster />
    </div>
  );
}
