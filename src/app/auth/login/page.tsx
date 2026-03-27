"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("E-Mail oder Passwort falsch.");
      setLoading(false);
      return;
    }

    // Fetch role and redirect
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    if (profile?.role === "sitter") {
      router.push("/dashboard/babysitter");
    } else {
      router.push("/dashboard/eltern");
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <h2 className="text-lg font-medium mb-6">Willkommen zurück</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1.5">E-Mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="deine@email.de"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1.5">Passwort</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800 transition disabled:opacity-50"
        >
          {loading ? "Anmelden..." : "Anmelden"}
        </button>
      </form>
      <p className="text-xs text-center text-gray-400 mt-5">
        Noch kein Konto?{" "}
        <Link href="/auth/register" className="text-brand-600 hover:underline">
          Jetzt registrieren
        </Link>
      </p>
    </div>
  );
}
