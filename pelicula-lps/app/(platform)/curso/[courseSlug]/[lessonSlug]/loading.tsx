export default function LessonLoading() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="skeleton h-4 w-32 mb-4" />
      <div className="skeleton aspect-video rounded-xl mb-6" />
      <div className="skeleton h-7 w-2/3 mb-2" />
      <div className="skeleton h-4 w-full mb-1" />
      <div className="skeleton h-4 w-1/2" />
    </div>
  );
}
