export default function CatalogoLoading() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero skeleton */}
      <div className="skeleton aspect-[21/9] rounded-2xl" />

      {/* Row title */}
      <div>
        <div className="skeleton h-6 w-40 mb-4" />
        <div className="flex gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-64 shrink-0">
              <div className="skeleton aspect-video rounded-xl mb-3" />
              <div className="skeleton h-4 w-3/4 mb-2" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
