"use client";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { SitterProfile, Availability } from "@/types";
import { formatTime } from "@/lib/utils";

interface SitterCardProps {
  sitter: SitterProfile;
  availabilities: Availability[];
  onBook: (sitter: SitterProfile, slot: Availability) => void;
  onMessage: (sitter: SitterProfile) => void;
}

export function SitterCard({
  sitter,
  availabilities,
  onBook,
  onMessage,
}: SitterCardProps) {
  const freeSlots = availabilities.filter((a) => !a.is_booked);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 mb-3 shadow-sm">
      <div className="flex gap-4">
        <Avatar name={sitter.full_name} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-medium text-gray-900">{sitter.full_name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {sitter.years_experience} Jahre Erfahrung ·{" "}
                <span className="text-amber-600">
                  ★ {sitter.rating?.toFixed(1)}
                </span>{" "}
                ({sitter.review_count} Bewertungen)
              </p>
            </div>
            <p className="text-sm font-medium text-brand-600 flex-shrink-0">
              {sitter.hourly_rate} €/h
            </p>
          </div>

          {sitter.bio && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {sitter.bio}
            </p>
          )}

          <div className="flex flex-wrap gap-1 mt-2">
            {sitter.certifications?.map((c) => (
              <Badge key={c} variant="purple">
                {c}
              </Badge>
            ))}
          </div>

          <div className="mt-3">
            <p className="text-xs text-gray-400 mb-1.5">Freie Termine:</p>
            <div className="flex flex-wrap gap-1.5">
              {freeSlots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() => onBook(sitter, slot)}
                  className="text-xs px-3 py-1 rounded-full border border-gray-200 hover:border-brand-400 hover:bg-brand-50 hover:text-brand-600 transition-all"
                >
                  {new Date(slot.date).toLocaleDateString("de-DE", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                  })}{" "}
                  · {formatTime(slot.start_time)}–{formatTime(slot.end_time)}
                </button>
              ))}
              {freeSlots.length === 0 && (
                <span className="text-xs text-gray-400">
                  Keine freien Termine
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-gray-50">
        <Button size="sm" variant="outline" onClick={() => onMessage(sitter)}>
          Nachricht
        </Button>
      </div>
    </div>
  );
}
