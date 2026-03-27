"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "parent" as "parent" | "sitter",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (signUpError || !data.user) {
      setError(signUpError?.message ?? "Registrierung fehlgeschlagen.");
      setLoading(false);
      return;
    }

    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email: form.email,
      full_name: form.fullName,
      role: form.role,
    });

    if (profileError) {
      setError("Profil konnte nicht erstellt werden.");
      setLoading(false);
      return;
    }

    if (form.role === "sitter") {
      router.push("/dashboard/babysitter");
    } else {
      router.push("/dashboard/eltern");
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <h2 className="text-lg font-medium mb-6">Konto erstellen</h2>

      {/* Role selector */}
      <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
        {(["parent", "sitter"] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => update("role", r)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
              form.role === r
                ? "bg-white text-brand-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {r === "parent" ? "👨‍👩‍👧 Elternteil" : "👶 Babysitter"}
          </button>
        ))}
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 block mb-1.5">
            Vollständiger Name
          </label>
          <input
            type="text"
            value={form.fullName}
            onChange={(e) => update("fullName", e.target.value)}
            required
            placeholder="Max Mustermann"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1.5">E-Mail</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
            placeholder="deine@email.de"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        <div>
          <label className="text-xs text-gray-400 block mb-1.5">Passwort</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) => update("password", e.target.value)}
            required
            minLength={8}
            placeholder="Min. 8 Zeichen"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-brand-800 transition disabled:opacity-50"
        >
          {loading ? "Konto wird erstellt..." : "Registrieren"}
        </button>
      </form>
      <p className="text-xs text-center text-gray-400 mt-5">
        Schon ein Konto?{" "}
        <Link href="/auth/login" className="text-brand-600 hover:underline">
          Anmelden
        </Link>
      </p>
    </div>
  );
}
