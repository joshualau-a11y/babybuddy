"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Booking } from "@/types";

export function useBookings(userId: string, role: "parent" | "sitter") {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    const col = role === "parent" ? "parent_id" : "sitter_id";
    const related =
      role === "parent"
        ? "sitter:profiles!sitter_id(*)"
        : "parent:profiles!parent_id(*)";

    supabase
      .from("bookings")
      .select(`*, availability(*), ${related}`)
      .eq(col, userId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setBookings((data as Booking[]) ?? []);
        setLoading(false);
      });
  }, [userId, role]);

  return { bookings, loading };
}
