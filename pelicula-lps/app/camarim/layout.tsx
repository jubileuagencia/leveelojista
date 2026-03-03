export default function CamarimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-theme="light" className="bg-void text-text min-h-screen">
      {children}
    </div>
  );
}
