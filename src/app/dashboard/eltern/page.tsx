"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SitterCard } from "@/components/sitter/SitterCard";
import { BookingModal } from "@/components/booking/BookingModal";
import { useAuth } from "@/hooks/useAuth";
import type { SitterProfile, Availability } from "@/types";

export default function SuchenPage() {
  const { profile } = useAuth();
  const [sitters, setSitters] = useState<SitterProfile[]>([]);
  const [availabilities, setAvailabilities] = useState<
    Record<string, Availability[]>
  >({});
  const [modal, setModal] = useState<{
    sitter: SitterProfile;
    slot: Availability;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("*")
      .eq("role", "sitter")
      .then(async ({ data }) => {
        const sitterList = (data as SitterProfile[]) ?? [];
        setSitters(sitterList);
        setLoading(false);

        const today = new Date().toISOString().split("T")[0];
        for (const s of sitterList) {
          const { data: av } = await supabase
            .from("availability")
            .select("*")
            .eq("sitter_id", s.id)
            .gte("date", today)
            .order("date");
          setAvailabilities((prev) => ({ ...prev, [s.id]: av ?? [] }));
        }
      });
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-medium">Babysitter finden</h1>
        <p className="text-sm text-gray-400">{sitters.length} verfügbar</p>
      </div>

      {loading && (
        <div className="text-sm text-gray-400 text-center py-12">Laden...</div>
      )}

      {!loading && sitters.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-4xl mb-3">👶</div>
          <p className="text-sm">Noch keine Babysitter registriert.</p>
        </div>
      )}

      {sitters.map((s) => (
        <SitterCard
          key={s.id}
          sitter={s}
          availabilities={availabilities[s.id] ?? []}
          onBook={(sitter, slot) => setModal({ sitter, slot })}
          onMessage={() => {}}
        />
      ))}

      {modal && profile && (
        <BookingModal
          sitter={modal.sitter}
          slot={modal.slot}
          parentId={profile.id}
          onClose={() => setModal(null)}
          onSuccess={() => {
            setModal(null);
          }}
        />
      )}
    </div>
  );
}
