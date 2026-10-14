# ABC Rent a Car

Sistem za najam vozila za ABC Rent a Car, Sarajevo. Gosti pretražuju vozni park, provjeravaju dostupnost za svoje datume i šalju upit. Osoblje potvrđuje rezervaciju, predaje vozilo, štampa ugovor i zatvara najam iz jednog admin panela.

**Domen:** [abcrentacar.ba](https://abcrentacar.ba)

## Tehnologije

Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma, Supabase (Postgres i Storage), next-intl (BS/EN), Resend, Vercel.

## Pokretanje lokalno

```bash
npm install
cp .env.example .env.local
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

## Seed

`prisma/seed.ts` upisuje tri lokacije preuzimanja (poslovnica, Aerodrom Sarajevo, dostava na adresu) i 19 vozila sa slikama iz `public/cars`. Cijene su u bazi spremljene u KM po fiksnom kursu 1 EUR = 1,95583 KM, a sajt ih po defaultu prikazuje u eurima.

## Struktura

- `app/[locale]` javne stranice (bs, en)
- `app/admin` admin panel
- `components/home` sekcije početne stranice
- `lib/site-config.ts` podaci o firmi, kontakti i navigacija
- `messages` prijevodi

Powered and designed by [mehiccdev](https://mehiccdev.com).
