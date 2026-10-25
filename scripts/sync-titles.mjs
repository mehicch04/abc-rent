import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const titles = [
  ["mercedes-e-klasa-2019", "Mercedes E klasa", "Mercedes E 220 d Avantgarde"],
  ["audi-q7", "Audi Q7", "Audi Q7 50 TDI quattro"],
  ["skoda-kodiaq", "Škoda Kodiaq", "Škoda Kodiaq 2.0 TDI Style"],
  ["skoda-octavia-2021", "Škoda Octavia", "Škoda Octavia 2.0 TDI Style"],
  ["vw-t-cross", "VW T-Cross", "VW T-Cross 1.0 TSI Style"],
  ["mercedes-vito-2020", "Mercedes Vito (8+1)", "Mercedes Vito Tourer 8+1"],
  ["mercedes-e-klasa-2018", "Mercedes E klasa (2018)", "Mercedes E 220 d Elegance"],
  ["skoda-karoq", "Škoda Karoq", "Škoda Karoq 2.0 TDI Style"],
  ["peugeot-3008", "Peugeot 3008", "Peugeot 3008 1.5 BlueHDi Allure"],
  ["seat-arona", "Seat Arona", "Seat Arona 1.0 TSI FR"],
  ["vw-polo", "VW Polo", "VW Polo 1.0 TSI Life"],
  ["skoda-scala", "Škoda Scala", "Škoda Scala 1.0 TSI Ambition"],
  ["vw-golf-7", "VW Golf 7", "VW Golf 7 1.6 TDI Comfortline"],
  ["skoda-octavia-karavan-2018", "Škoda Octavia Karavan", "Škoda Octavia Combi 1.6 TDI"],
  ["vw-touran", "VW Touran", "VW Touran 2.0 TDI Highline"],
  ["vw-sharan", "VW Sharan", "VW Sharan 2.0 TDI Highline"],
  ["vw-caravelle", "VW Caravelle (8+1)", "VW Caravelle 2.0 TDI 8+1"],
  ["vw-transporter", "VW Transporter (8+1)", "VW Transporter 2.0 TDI 8+1"],
  ["mercedes-vito-2014", "Mercedes Vito (2014)", "Mercedes Vito 116 CDI 8+1"],
];

let updated = 0;
for (const [slug, from, to] of titles) {
  const r = await prisma.car.updateMany({ where: { slug, title: from }, data: { title: to } });
  updated += r.count;
  console.log(r.count ? `updated  ${slug}: ${to}` : `skipped  ${slug}`);
}
console.log(`done, ${updated} updated`);
await prisma.$disconnect();
