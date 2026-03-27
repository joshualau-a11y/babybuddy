"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Message, Conversation } from "@/types";
import { Avatar } from "@/components/ui/Avatar";

interface ChatWindowProps {
  conversation: Conversation;
  currentUserId: string;
}

export function ChatWindow({ conversation, currentUserId }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversation.id)
      .order("created_at")
      .then(({ data }) => setMessages((data as Message[]) ?? []));

    const channel = supabase
      .channel(`chat:${conversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversation.id}`,
        },
        (payload) => setMessages((prev) => [...prev, payload.new as Message])
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim()) return;
    const content = input.trim();
    setInput("");
    await supabase.from("messages").insert({
      conversation_id: conversation.id,
      sender_id: currentUserId,
      content,
    });
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-4 border-b border-gray-100">
        <Avatar
          name={conversation.other_user?.full_name ?? "?"}
          size="sm"
        />
        <span className="font-medium text-sm">
          {conversation.other_user?.full_name}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${
              m.sender_id === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                m.sender_id === currentUserId
                  ? "bg-brand-600 text-white rounded-br-sm"
                  : "bg-gray-100 text-gray-800 rounded-bl-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="p-3 border-t border-gray-100 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Nachricht schreiben..."
          className="flex-1 bg-gray-50 rounded-full px-4 py-2 text-sm outline-none border border-gray-200 focus:border-brand-400"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-brand-600 text-white rounded-full text-sm font-medium hover:bg-brand-800 transition"
        >
          Senden
        </button>
      </div>
    </div>
  );
}
