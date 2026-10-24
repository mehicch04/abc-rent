import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const price = Math.round(150 * 1.95583 * 100) / 100;
const data = {
  nameHr: "All inclusive: auto i vozač",
  nameEn: "All inclusive: car and driver",
  noteHr: "Auto, vozač, gorivo i parking u jednoj dnevnoj cijeni",
  noteEn: "Car, driver, fuel and parking in one daily price",
  pricing: "PER_DAY",
  price,
  maxQty: 1,
  totalStock: 3,
  sortOrder: 6,
  isActive: true,
};

await prisma.extra.upsert({ where: { id: "abc-all-inclusive" }, update: data, create: { id: "abc-all-inclusive", ...data } });
console.log("All inclusive: ok");
await prisma.$disconnect();
