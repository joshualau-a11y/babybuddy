"use client";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import type { SitterProfile, Availability } from "@/types";
import { formatDate, formatTime } from "@/lib/utils";

interface BookingModalProps {
  sitter: SitterProfile;
  slot: Availability;
  parentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function BookingModal({
  sitter,
  slot,
  parentId,
  onClose,
  onSuccess,
}: BookingModalProps) {
  const [childCount, setChildCount] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.from("bookings").insert({
      parent_id: parentId,
      sitter_id: sitter.id,
      availability_id: slot.id,
      status: "pending",
      child_count: childCount,
      message: message || null,
    });
    setLoading(false);
    if (error) {
      setError("Fehler beim Senden. Bitte versuche es erneut.");
    } else {
      onSuccess();
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-xl">
        <h2 className="text-base font-medium mb-5">Buchungsanfrage senden</h2>

        <div className="space-y-4">
          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Babysitter
            </label>
            <p className="text-sm font-medium">{sitter.full_name}</p>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Termin</label>
            <p className="text-sm font-medium">
              {formatDate(slot.date)} · {formatTime(slot.start_time)}–
              {formatTime(slot.end_time)}
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Anzahl Kinder
            </label>
            <select
              value={childCount}
              onChange={(e) => setChildCount(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50"
            >
              {[1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} {n === 1 ? "Kind" : "Kinder"}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">
              Nachricht (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Alter der Kinder, besondere Hinweise..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none h-20 bg-gray-50"
            />
          </div>

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        <div className="flex justify-end gap-2 mt-5">
          <Button variant="outline" onClick={onClose}>
            Abbrechen
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Senden..." : "Anfrage senden"}
          </Button>
        </div>
      </div>
    </div>
  );
}
