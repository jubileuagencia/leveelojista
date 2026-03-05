export default function CheckoutLoading() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="skeleton h-8 w-56 mb-2" />
      <div className="skeleton h-4 w-80 mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-card border border-white/5 rounded-xl p-6">
            <div className="skeleton h-5 w-32 mb-4" />
            <div className="skeleton h-3 w-full mb-1" />
            <div className="skeleton h-3 w-3/4 mb-4" />
            <div className="skeleton h-8 w-24 mb-4" />
            <div className="skeleton h-5 w-5 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
