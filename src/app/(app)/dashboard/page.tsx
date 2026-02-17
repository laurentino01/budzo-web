export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
        Dashboard Overview
      </h1>
      <div className="grid gap-4 md:grid-cols-3">
        {/* Placeholders for future widgets */}
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">R$ 0,00</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Pending Quotes</h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
        <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <h3 className="text-sm font-medium text-slate-500">Active Clients</h3>
          <p className="text-2xl font-bold mt-2">0</p>
        </div>
      </div>
    </div>
  );
}
