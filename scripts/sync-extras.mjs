import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const bam = (eur) => Math.round(eur * 1.95583 * 100) / 100;

const extras = [
  {
    id: "abc-no-deposit",
    data: {
      nameHr: "Puno osiguranje bez depozita",
      nameEn: "Full insurance, no deposit",
      noteHr: "Ne ostavljate depozit pri preuzimanju",
      noteEn: "No deposit to leave at pick-up",
    },
  },
  {
    id: "abc-additional-driver",
    data: {
      nameHr: "Dodatni vozač",
      nameEn: "Additional driver",
      noteHr: "Drugi vozač upisan u ugovor o najmu",
      noteEn: "A second driver on the rental agreement",
      pricing: "PER_DAY",
      price: bam(5),
      maxQty: 2,
      totalStock: 99,
      sortOrder: 3,
      isActive: true,
    },
  },
  {
    id: "abc-all-inclusive",
    data: {
      nameHr: "All inclusive: auto i vozač",
      nameEn: "All inclusive: car and driver",
      noteHr: "Auto, vozač, gorivo i parking u jednoj dnevnoj cijeni",
      noteEn: "Car, driver, fuel and parking in one daily price",
      pricing: "PER_DAY",
      price: bam(150),
      maxQty: 1,
      totalStock: 3,
      sortOrder: 6,
      isActive: true,
    },
  },
];

for (const { id, data } of extras) {
  const exists = await prisma.extra.findUnique({ where: { id } });
  if (exists) await prisma.extra.update({ where: { id }, data });
  else if (data.pricing) await prisma.extra.create({ data: { id, ...data } });
  console.log(`${id}: ${exists ? "updated" : data.pricing ? "created" : "skipped"}`);
}
await prisma.$disconnect();
