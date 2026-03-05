export default function CourseLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="skeleton h-4 w-20 mb-4" />
      <div className="skeleton h-8 w-2/3 mb-2" />
      <div className="skeleton h-5 w-1/2 mb-3" />
      <div className="skeleton h-4 w-full mb-1" />
      <div className="skeleton h-4 w-3/4 mb-8" />

      {/* Module skeletons */}
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-card border border-white/5 rounded-xl p-5"
          >
            <div className="flex justify-between">
              <div className="skeleton h-5 w-48" />
              <div className="skeleton h-4 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
