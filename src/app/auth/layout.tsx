export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-3xl">🍼</span>
          <h1 className="text-xl font-medium text-gray-900 mt-2">BabyBuddy</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
