import { LoginButton } from "@/components/layout/login-button";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return ( <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center">
        <header className="w-full max-w-5xl px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                B
             </div>
             <span className="text-xl font-bold text-slate-900 dark:text-white">Budzo</span>
          </div>
          <LoginButton />
        </header>
        
        <main className="w-full max-w-5xl px-4 flex-1 pb-10">
          {children}
        </main>
  
        <footer className="w-full py-6 text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} Budzo. All rights reserved.
        </footer>
      </div>)
}