"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

const parentNav = [
  { label: "Babysitter finden", href: "/dashboard/eltern", icon: "🔍" },
  { label: "Meine Buchungen", href: "/dashboard/eltern/buchungen", icon: "📅" },
  { label: "Nachrichten", href: "/dashboard/eltern/nachrichten", icon: "💬" },
  { label: "Bewertungen", href: "/dashboard/eltern/bewertungen", icon: "⭐" },
];

const sitterNav = [
  { label: "Dashboard", href: "/dashboard/babysitter", icon: "🏠" },
  { label: "Verfügbarkeit", href: "/dashboard/babysitter/verfuegbarkeit", icon: "📅" },
  { label: "Anfragen", href: "/dashboard/babysitter/anfragen", icon: "📨" },
  { label: "Nachrichten", href: "/dashboard/babysitter/nachrichten", icon: "💬" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile, loading, signOut } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isSitter = pathname?.startsWith("/dashboard/babysitter");
  const nav = isSitter ? sitterNav : parentNav;

  async function handleSignOut() {
    await signOut();
    router.push("/auth/login");
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400 text-sm">Laden...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <span className="text-lg font-medium text-brand-600">🍼 BabyBuddy</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition",
                pathname === item.href
                  ? "bg-brand-50 text-brand-600 font-medium"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {profile && (
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Avatar name={profile.full_name} size="sm" />
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {profile.full_name}
                </p>
                <p className="text-xs text-gray-400 truncate">{profile.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full text-xs text-gray-400 hover:text-gray-600 text-left transition"
            >
              Abmelden
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto p-6">{children}</div>
      </main>
    </div>
  );
}
