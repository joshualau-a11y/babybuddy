"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, formatTime } from "@/lib/utils";
import type { Booking } from "@/types";

export default function BabysitterDashboard() {
  const { profile } = useAuth();
  const [stats, setStats] = useState({ total: 0, pending: 0, rating: 0 });
  const [upcoming, setUpcoming] = useState<Booking[]>([]);

  useEffect(() => {
    if (!profile) return;

    supabase
      .from("bookings")
      .select("*, availability(*), parent:profiles!parent_id(*)")
      .eq("sitter_id", profile.id)
      .in("status", ["confirmed", "pending"])
      .order("created_at", { ascending: false })
      .limit(5)
      .then(({ data }) => setUpcoming((data as Booking[]) ?? []));

    supabase
      .from("bookings")
      .select("status", { count: "exact" })
      .eq("sitter_id", profile.id)
      .then(({ count, data }) => {
        const pending = data?.filter((b) => b.status === "pending").length ?? 0;
        setStats((prev) => ({ ...prev, total: count ?? 0, pending }));
      });
  }, [profile]);

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">
        Hallo, {profile?.full_name?.split(" ")[0]} 👋
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[
          { label: "Buchungen gesamt", value: stats.total },
          { label: "Offene Anfragen", value: stats.pending },
          { label: "Bewertung", value: "4.9 ★" },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white border border-gray-100 rounded-xl p-4 text-center"
          >
            <div className="text-2xl font-medium text-brand-600">{s.value}</div>
            <div className="text-xs text-gray-400 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Upcoming bookings */}
      <h2 className="text-sm font-medium text-gray-500 mb-3">Nächste Einsätze</h2>
      {upcoming.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-sm">Noch keine Buchungen.</p>
        </div>
      )}
      <div className="space-y-3">
        {upcoming.map((b) => (
          <div
            key={b.id}
            className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4"
          >
            <Avatar name={b.parent?.full_name ?? "?"} />
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">Familie {b.parent?.full_name?.split(" ").pop()}</p>
              {b.availability && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDate(b.availability.date)} ·{" "}
                  {formatTime(b.availability.start_time)}–
                  {formatTime(b.availability.end_time)}
                </p>
              )}
            </div>
            <Badge variant={b.status === "confirmed" ? "teal" : "amber"}>
              {b.status === "confirmed" ? "Bestätigt" : "Ausstehend"}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
