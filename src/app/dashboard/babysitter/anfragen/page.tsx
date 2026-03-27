"use client";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { formatDate, formatTime } from "@/lib/utils";
import { useState } from "react";
import type { Booking } from "@/types";

export default function AnfragenPage() {
  const { profile } = useAuth();
  const { bookings, loading } = useBookings(profile?.id ?? "", "sitter");
  const [updating, setUpdating] = useState<string | null>(null);

  const pending = bookings.filter((b) => b.status === "pending");
  const confirmed = bookings.filter((b) => b.status === "confirmed");

  async function updateStatus(id: string, status: "confirmed" | "cancelled") {
    setUpdating(id);
    await supabase.from("bookings").update({ status }).eq("id", id);
    setUpdating(null);
    window.location.reload();
  }

  function BookingCard({ b, showActions }: { b: Booking; showActions: boolean }) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="flex items-start gap-4">
          <Avatar name={b.parent?.full_name ?? "?"} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium text-sm">
                Familie {b.parent?.full_name?.split(" ").pop()}
              </p>
              <Badge variant={b.status === "confirmed" ? "teal" : "amber"}>
                {b.status === "confirmed" ? "Bestätigt" : "Ausstehend"}
              </Badge>
            </div>
            {b.availability && (
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(b.availability.date)} ·{" "}
                {formatTime(b.availability.start_time)}–
                {formatTime(b.availability.end_time)}
              </p>
            )}
            <p className="text-xs text-gray-400">
              {b.child_count} {b.child_count === 1 ? "Kind" : "Kinder"}
            </p>
            {b.message && (
              <p className="text-xs text-gray-500 mt-1 italic">
                &ldquo;{b.message}&rdquo;
              </p>
            )}
          </div>
        </div>
        {showActions && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
            <Button
              size="sm"
              onClick={() => updateStatus(b.id, "confirmed")}
              disabled={updating === b.id}
            >
              Annehmen
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateStatus(b.id, "cancelled")}
              disabled={updating === b.id}
            >
              Ablehnen
            </Button>
          </div>
        )}
      </div>
    );
  }

  if (loading) {
    return <div className="text-sm text-gray-400 text-center py-12">Laden...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">Buchungsanfragen</h1>

      {pending.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Offene Anfragen ({pending.length})
          </h2>
          <div className="space-y-3">
            {pending.map((b) => (
              <BookingCard key={b.id} b={b} showActions={true} />
            ))}
          </div>
        </section>
      )}

      {confirmed.length > 0 && (
        <section>
          <h2 className="text-sm font-medium text-gray-500 mb-3">
            Bestätigte Buchungen
          </h2>
          <div className="space-y-3">
            {confirmed.map((b) => (
              <BookingCard key={b.id} b={b} showActions={false} />
            ))}
          </div>
        </section>
      )}

      {bookings.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📨</div>
          <p className="text-sm">Noch keine Anfragen.</p>
        </div>
      )}
    </div>
  );
}
