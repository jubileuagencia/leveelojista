export default function MinhaContaLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="skeleton h-8 w-40" />
      <div className="bg-card border border-white/5 rounded-xl p-6 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i}>
            <div className="skeleton h-3 w-16 mb-1.5" />
            <div className="skeleton h-5 w-48" />
          </div>
        ))}
      </div>
      <div className="bg-card border border-white/5 rounded-xl p-6">
        <div className="skeleton h-5 w-32 mb-4" />
        <div className="skeleton h-16 w-full rounded-lg" />
      </div>
    </div>
  );
}
