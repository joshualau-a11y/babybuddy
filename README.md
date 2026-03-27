# 🍼 BabyBuddy – Next.js Starter

Babysitter-Buchungsplattform mit Next.js 14, Supabase und Tailwind CSS.

## Tech Stack

- **Next.js 14** – App Router, Server Components
- **TypeScript** – Typsicherheit
- **Tailwind CSS** – Styling
- **Supabase** – Auth, Datenbank (PostgreSQL), Realtime-Chat

---

## Setup in 4 Schritten

### 1. Projekt klonen & Dependencies installieren

```bash
git clone <dein-repo>
cd babybuddy
npm install
```

### 2. Supabase Projekt erstellen

1. Gehe zu [supabase.com](https://supabase.com) → Neues Projekt
2. Öffne den **SQL Editor**
3. Führe die gesamte Datei `supabase-schema.sql` aus
4. Kopiere **Project URL** und **Anon Key** aus den Projekteinstellungen

### 3. Umgebungsvariablen einrichten

```bash
cp .env.local.example .env.local
```

Dann `.env.local` bearbeiten:

```env
NEXT_PUBLIC_SUPABASE_URL=https://DEIN_PROJEKT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dein-anon-key
```

### 4. Entwicklungsserver starten

```bash
npm run dev
# → http://localhost:3000
```

---

## Projektstruktur

```
src/
├── app/
│   ├── page.tsx                      # Landingpage
│   ├── auth/
│   │   ├── login/page.tsx            # Login
│   │   └── register/page.tsx         # Registrierung (Eltern oder Babysitter)
│   └── dashboard/
│       ├── layout.tsx                # Sidebar-Navigation
│       ├── eltern/
│       │   ├── page.tsx              # Babysitter suchen & buchen
│       │   ├── buchungen/page.tsx    # Eigene Buchungen
│       │   ├── nachrichten/page.tsx  # Chat
│       │   └── bewertungen/page.tsx  # Bewertungen abgeben
│       └── babysitter/
│           ├── page.tsx              # Dashboard mit Statistiken
│           ├── verfuegbarkeit/page.tsx # Kalender & Zeitfenster
│           ├── anfragen/page.tsx     # Buchungsanfragen annehmen
│           └── nachrichten/page.tsx  # Chat
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Badge.tsx
│   │   └── Avatar.tsx
│   ├── sitter/
│   │   └── SitterCard.tsx
│   ├── booking/
│   │   └── BookingModal.tsx
│   └── chat/
│       └── ChatWindow.tsx           # Realtime-Chat via Supabase
├── hooks/
│   ├── useAuth.ts
│   └── useBookings.ts
├── lib/
│   ├── supabase.ts                  # Browser-Client
│   ├── supabase-server.ts           # Server-Client
│   └── utils.ts
└── types/
    └── index.ts                     # Alle TypeScript-Typen
```

---

## Nächste Schritte

- [ ] **Stripe** – Zahlungsabwicklung beim Buchen
- [ ] **E-Mail-Benachrichtigungen** – via Supabase Edge Functions
- [ ] **Profilseiten** – Babysitter-Profil bearbeiten
- [ ] **Karte** – Babysitter auf Google Maps anzeigen
- [ ] **Deployment** – `vercel deploy`
