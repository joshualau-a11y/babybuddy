import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white p-8">
      <div className="text-center max-w-lg">
        <div className="text-5xl mb-6">🍼</div>
        <h1 className="text-4xl font-medium text-gray-900 mb-3">BabyBuddy</h1>
        <p className="text-gray-500 mb-10 text-lg leading-relaxed">
          Zuverlässige Babysitter in deiner Nähe finden und buchen – oder deine
          freien Termine als Babysitter anbieten.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/auth/login"
            className="px-6 py-3 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-800 transition"
          >
            Anmelden
          </Link>
          <Link
            href="/auth/register"
            className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
          >
            Registrieren
          </Link>
        </div>
        <div className="mt-16 grid grid-cols-3 gap-6 text-center">
          {[
            { icon: "🔍", title: "Finden", desc: "Babysitter in deiner Nähe" },
            { icon: "📅", title: "Buchen", desc: "Freie Termine reservieren" },
            { icon: "💬", title: "Chatten", desc: "Direkt kommunizieren" },
          ].map((f) => (
            <div key={f.title}>
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-medium text-gray-800">{f.title}</div>
              <div className="text-xs text-gray-400 mt-1">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
