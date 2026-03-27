"use client";
import { useAuth } from "@/hooks/useAuth";
import { useBookings } from "@/hooks/useBookings";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate, formatTime } from "@/lib/utils";
import type { BadgeVariant } from "@/components/ui/Badge";

const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  pending:   { label: "Ausstehend", variant: "amber" },
  confirmed: { label: "Bestätigt",  variant: "teal" },
  cancelled: { label: "Abgesagt",   variant: "red" },
  completed: { label: "Abgeschlossen", variant: "gray" },
};

export default function BuchungenPage() {
  const { profile } = useAuth();
  const { bookings, loading } = useBookings(profile?.id ?? "", "parent");

  if (loading) {
    return <div className="text-sm text-gray-400 py-12 text-center">Laden...</div>;
  }

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">Meine Buchungen</h1>

      {bookings.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">📅</div>
          <p className="text-sm">Noch keine Buchungen.</p>
        </div>
      )}

      <div className="space-y-3">
        {bookings.map((b) => {
          const status = statusMap[b.status] ?? statusMap.pending;
          return (
            <div
              key={b.id}
              className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-4"
            >
              <Avatar name={b.sitter?.full_name ?? "?"} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium text-sm">{b.sitter?.full_name}</p>
                  <Badge variant={status.variant}>{status.label}</Badge>
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
          );
        })}
      </div>
    </div>
  );
}
