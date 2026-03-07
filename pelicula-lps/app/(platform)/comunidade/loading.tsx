export default function ComunidadeLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="skeleton h-8 w-48 mb-2" />
        <div className="skeleton h-4 w-64" />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-8 w-24 rounded-full" />
        ))}
      </div>

      {/* Post skeletons */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-card border border-white/5 rounded-xl p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="skeleton w-10 h-10 rounded-full" />
              <div>
                <div className="skeleton h-4 w-28 mb-1" />
                <div className="skeleton h-3 w-20" />
              </div>
            </div>
            <div className="skeleton h-5 w-3/4 mb-2" />
            <div className="skeleton h-4 w-full mb-1" />
            <div className="skeleton h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}
