export default function AdminLoading() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="skeleton h-8 w-40 mb-6" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-card border border-white/5 rounded-xl p-5">
            <div className="skeleton h-4 w-20 mb-2" />
            <div className="skeleton h-8 w-16" />
          </div>
        ))}
      </div>

      {/* Tables */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-white/5 rounded-xl p-5">
          <div className="skeleton h-5 w-32 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-full mb-2 rounded-lg" />
          ))}
        </div>
        <div className="bg-card border border-white/5 rounded-xl p-5">
          <div className="skeleton h-5 w-40 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-10 w-full mb-2 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
