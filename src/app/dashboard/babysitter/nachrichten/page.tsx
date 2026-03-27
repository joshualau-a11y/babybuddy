"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Avatar } from "@/components/ui/Avatar";
import type { Conversation, Profile } from "@/types";
import { cn } from "@/lib/utils";

export default function SitterNachrichtenPage() {
  const { profile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [active, setActive] = useState<Conversation | null>(null);

  useEffect(() => {
    if (!profile) return;
    supabase
      .from("conversations")
      .select("*, parent:profiles!parent_id(*)")
      .eq("sitter_id", profile.id)
      .order("updated_at", { ascending: false })
      .then(({ data }) => {
        const convs: Conversation[] = (data ?? []).map((c) => {
          const row = c as Record<string, unknown>;
          return {
            id: row.id as string,
            parent_id: row.parent_id as string,
            sitter_id: row.sitter_id as string,
            last_message: row.last_message as string | undefined,
            updated_at: row.updated_at as string,
            other_user: row.parent as Profile | undefined,
          };
        });
        setConversations(convs);
        if (convs.length > 0) setActive(convs[0]);
      });
  }, [profile]);

  if (!profile) return null;

  return (
    <div>
      <h1 className="text-xl font-medium mb-6">Nachrichten</h1>
      <div className="flex gap-4 h-[560px] bg-white border border-gray-100 rounded-xl overflow-hidden">
        <div className="w-52 flex-shrink-0 border-r border-gray-100 overflow-y-auto">
          {conversations.length === 0 && (
            <p className="text-xs text-gray-400 p-4">Keine Gespräche</p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left",
                active?.id === c.id && "bg-brand-50"
              )}
            >
              <Avatar name={c.other_user?.full_name ?? "?"} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">
                  {c.other_user?.full_name}
                </p>
                {c.last_message && (
                  <p className="text-xs text-gray-400 truncate">{c.last_message}</p>
                )}
              </div>
            </button>
          ))}
        </div>
        <div className="flex-1 overflow-hidden">
          {active ? (
            <ChatWindow conversation={active} currentUserId={profile.id} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400 text-sm">
              Gespräch auswählen
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
