"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import type { Availability } from "@/types";

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
const MONTHS = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = Array(offset).fill(null);
  for (let i = 1; i <= daysInMonth; i++) cells.push(i);
  return cells;
}

export default function VerfuegbarkeitPage() {
  const { profile } = useAuth();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [newStart, setNewStart] = useState("09:00");
  const [newEnd, setNewEnd] = useState("17:00");
  const [saving, setSaving] = useState(false);

  const dateStr = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  const freeDays = new Set(availabilities.map((a) => {
    const d = new Date(a.date);
    if (d.getFullYear() === year && d.getMonth() === month) return d.getDate();
    return null;
  }).filter(Boolean));

  const selectedSlots = selectedDay
    ? availabilities.filter((a) => a.date === dateStr(selectedDay))
    : [];

  useEffect(() => {
    if (!profile) return;
    const from = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const to = `${year}-${String(month + 1).padStart(2, "0")}-31`;
    supabase
      .from("availability")
      .select("*")
      .eq("sitter_id", profile.id)
      .gte("date", from)
      .lte("date", to)
      .then(({ data }) => setAvailabilities((data as Availability[]) ?? []));
  }, [profile, year, month]);

  async function addSlot() {
    if (!profile || !selectedDay) return;
    setSaving(true);
    const { data } = await supabase
      .from("availability")
      .insert({
        sitter_id: profile.id,
        date: dateStr(selectedDay),
        start_time: newStart,
        end_time: newEnd,
        is_booked: false,
      })
      .select()
      .single();
    if (data) setAvailabilities((prev) => [...prev, data as Availability]);
    setSaving(false);
  }

  async function removeSlot(id: string) {
    await supabase.from("availability").delete().eq("id", id);
    setAvailabilities((prev) => prev.filter((a) => a.id !== id));
  }

  const cells = getCalendarDays(year, month);

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">Verfügbarkeit</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Calendar */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); }}
              className="p-1 hover:bg-gray-100 rounded-lg text-sm"
            >
              ←
            </button>
            <span className="text-sm font-medium">
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={() => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); }}
              className="p-1 hover:bg-gray-100 rounded-lg text-sm"
            >
              →
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-xs text-gray-400 py-1 font-medium">
                {d}
              </div>
            ))}
            {cells.map((day, i) => {
              if (!day) return <div key={i} />;
              const isFree = freeDays.has(day);
              const isSelected = selectedDay === day;
              const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDay(day)}
                  className={`
                    text-center py-1.5 rounded-lg text-sm transition
                    ${isSelected ? "bg-brand-600 text-white font-medium" :
                      isFree ? "bg-emerald-50 text-emerald-700 font-medium hover:bg-emerald-100" :
                      "text-gray-600 hover:bg-gray-50"}
                    ${isToday && !isSelected ? "ring-1 ring-brand-400" : ""}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="flex gap-4 mt-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-emerald-100 inline-block" />
              Frei
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded bg-brand-600 inline-block" />
              Ausgewählt
            </span>
          </div>
        </div>

        {/* Time slots for selected day */}
        <div className="bg-white border border-gray-100 rounded-xl p-5">
          <h2 className="text-sm font-medium mb-4">
            {selectedDay
              ? `${selectedDay}. ${MONTHS[month]}`
              : "Tag auswählen"}
          </h2>

          {selectedDay && (
            <>
              <div className="space-y-2 mb-4">
                {selectedSlots.length === 0 && (
                  <p className="text-xs text-gray-400">Noch keine Zeitfenster.</p>
                )}
                {selectedSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2"
                  >
                    <span className="text-sm text-emerald-700">
                      {slot.start_time.slice(0, 5)} – {slot.end_time.slice(0, 5)} Uhr
                    </span>
                    {slot.is_booked ? (
                      <span className="text-xs text-gray-400">Gebucht</span>
                    ) : (
                      <button
                        onClick={() => removeSlot(slot.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition"
                      >
                        Entfernen
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs text-gray-400 mb-3">Zeitfenster hinzufügen:</p>
                <div className="flex gap-2 items-center mb-3">
                  <input
                    type="time"
                    value={newStart}
                    onChange={(e) => setNewStart(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                  <span className="text-gray-400 text-sm">–</span>
                  <input
                    type="time"
                    value={newEnd}
                    onChange={(e) => setNewEnd(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm"
                  />
                </div>
                <Button onClick={addSlot} disabled={saving} className="w-full justify-center">
                  {saving ? "Speichern..." : "+ Hinzufügen"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
