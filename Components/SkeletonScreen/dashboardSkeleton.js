const DashboardSkeleton = () => {
  return (
    <div className="flex min-h-screen bg-zinc-50 animate-pulse">
      
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white p-4 flex flex-col justify-between">
        <div className="space-y-6">
          <div className="h-8 w-36 rounded bg-zinc-200" />

          <div className="space-y-3">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="h-10 w-full rounded-xl bg-zinc-100"
              />
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-zinc-200 h-28" />
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col">
        
        {/* Topbar */}
        <header className="h-16 border-b bg-white px-6 flex items-center justify-between">
          <div className="h-10 w-96 rounded-xl bg-zinc-100" />
          <div className="flex items-center gap-4">
            <div className="h-8 w-8 rounded-full bg-zinc-200" />
            <div className="h-8 w-8 rounded-full bg-zinc-200" />
            <div className="h-9 w-9 rounded-full bg-zinc-300" />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div className="space-y-2">
              <div className="h-6 w-56 bg-zinc-200 rounded" />
              <div className="h-4 w-72 bg-zinc-100 rounded" />
            </div>
            <div className="h-10 w-44 bg-zinc-200 rounded-xl" />
          </div>

          {/* Cards */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-2xl border bg-white p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-zinc-200 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-40 bg-zinc-200 rounded" />
                  <div className="h-3 w-56 bg-zinc-100 rounded" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="h-6 w-20 bg-zinc-100 rounded-full" />
                <div className="h-6 w-12 bg-zinc-200 rounded-full" />
                <div className="h-8 w-8 bg-zinc-100 rounded-lg" />
              </div>
            </div>
          ))}
        </main>
      </div>
    </div>
  );
};
export default DashboardSkeleton;