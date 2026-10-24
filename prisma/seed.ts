import {
  PrismaClient,
  ExtraPricing,
  LocationType,
  CarClass,
  CarCategory,
  Transmission,
  FuelType,
} from "@prisma/client";

const prisma = new PrismaClient();

const BAM_PER_EUR = 1.95583;
const eur = (v: number) => Math.round(v * BAM_PER_EUR * 100) / 100;

const locations = [
  {
    slug: "sarajevo-poslovnica",
    name: "Poslovnica Sarajevo",
    type: LocationType.HEAD_OFFICE,
    street: "Munira Gavrankapetanovića 108",
    city: "Sarajevo",
    postalCode: "71210",
    latitude: 43.837469,
    longitude: 18.3302792,
    sortOrder: 0,
  },
  {
    slug: "aerodrom-sarajevo",
    name: "Aerodrom Sarajevo (SJJ)",
    type: LocationType.AIRPORT,
    street: "Kurta Schorka 36",
    city: "Sarajevo",
    postalCode: "71210",
    latitude: 43.8246,
    longitude: 18.3315,
    sortOrder: 1,
  },
  {
    slug: "dostava-na-adresu",
    name: "Dostava na adresu (Sarajevo)",
    type: LocationType.CITY_OFFICE,
    street: "Vaša adresa u Sarajevu",
    city: "Sarajevo",
    postalCode: "71000",
    sortOrder: 2,
  },
];

type SeedCar = {
  slug: string;
  brand: string;
  model: string;
  title: string;
  year: number;
  carClass: CarClass;
  categories: CarCategory[];
  passengers: number;
  doors: number;
  luggage: number;
  fuelType: FuelType;
  priceEur: number;
  depositEur: number;
  image: string;
  isFeatured?: boolean;
  sortOrder: number;
};

const cars: SeedCar[] = [
  { slug: "mercedes-e-klasa-2019", brand: "Mercedes-Benz", model: "E klasa", title: "Mercedes E klasa", year: 2019, carClass: CarClass.LUXURY, categories: [CarCategory.LIMUZINA, CarCategory.LUXURY], passengers: 5, doors: 4, luggage: 3, fuelType: FuelType.DIESEL, priceEur: 90, depositEur: 300, image: "/cars/mercedes-e-class-2019.webp", isFeatured: true, sortOrder: 0 },
  { slug: "audi-q7", brand: "Audi", model: "Q7", title: "Audi Q7", year: 2018, carClass: CarClass.LUXURY, categories: [CarCategory.SUV, CarCategory.LUXURY], passengers: 7, doors: 5, luggage: 4, fuelType: FuelType.DIESEL, priceEur: 120, depositEur: 300, image: "/cars/audi-q7.webp", isFeatured: true, sortOrder: 1 },
  { slug: "skoda-kodiaq", brand: "Škoda", model: "Kodiaq", title: "Škoda Kodiaq", year: 2020, carClass: CarClass.SUV, categories: [CarCategory.SUV], passengers: 7, doors: 5, luggage: 4, fuelType: FuelType.DIESEL, priceEur: 80, depositEur: 200, image: "/cars/skoda-kodiaq.webp", isFeatured: true, sortOrder: 2 },
  { slug: "skoda-octavia-2021", brand: "Škoda", model: "Octavia", title: "Škoda Octavia", year: 2021, carClass: CarClass.MIDSIZE, categories: [CarCategory.LIMUZINA], passengers: 5, doors: 5, luggage: 3, fuelType: FuelType.DIESEL, priceEur: 65, depositEur: 200, image: "/cars/skoda-octavia-2021.webp", isFeatured: true, sortOrder: 3 },
  { slug: "vw-t-cross", brand: "Volkswagen", model: "T-Cross", title: "VW T-Cross", year: 2020, carClass: CarClass.SUV, categories: [CarCategory.SUV, CarCategory.COMPACT], passengers: 5, doors: 5, luggage: 2, fuelType: FuelType.PETROL, priceEur: 60, depositEur: 200, image: "/cars/vw-t-cross.webp", isFeatured: true, sortOrder: 4 },
  { slug: "mercedes-vito-2020", brand: "Mercedes-Benz", model: "Vito", title: "Mercedes Vito (8+1)", year: 2020, carClass: CarClass.MINIBUS, categories: [CarCategory.MINIBUS], passengers: 9, doors: 4, luggage: 6, fuelType: FuelType.DIESEL, priceEur: 120, depositEur: 200, image: "/cars/mercedes-vito-2020.webp", isFeatured: true, sortOrder: 5 },
  { slug: "mercedes-e-klasa-2018", brand: "Mercedes-Benz", model: "E klasa", title: "Mercedes E klasa (2018)", year: 2018, carClass: CarClass.LUXURY, categories: [CarCategory.LIMUZINA, CarCategory.LUXURY], passengers: 5, doors: 4, luggage: 3, fuelType: FuelType.DIESEL, priceEur: 80, depositEur: 300, image: "/cars/mercedes-e-class-2018.webp", sortOrder: 6 },
  { slug: "skoda-karoq", brand: "Škoda", model: "Karoq", title: "Škoda Karoq", year: 2020, carClass: CarClass.SUV, categories: [CarCategory.SUV], passengers: 5, doors: 5, luggage: 3, fuelType: FuelType.DIESEL, priceEur: 65, depositEur: 200, image: "/cars/skoda-karoq.webp", sortOrder: 7 },
  { slug: "peugeot-3008", brand: "Peugeot", model: "3008", title: "Peugeot 3008", year: 2020, carClass: CarClass.SUV, categories: [CarCategory.SUV], passengers: 5, doors: 5, luggage: 3, fuelType: FuelType.DIESEL, priceEur: 65, depositEur: 200, image: "/cars/peugeot-3008.webp", sortOrder: 8 },
  { slug: "seat-arona", brand: "Seat", model: "Arona", title: "Seat Arona", year: 2021, carClass: CarClass.COMPACT, categories: [CarCategory.SUV, CarCategory.COMPACT], passengers: 5, doors: 5, luggage: 2, fuelType: FuelType.PETROL, priceEur: 55, depositEur: 200, image: "/cars/seat-arona.webp", sortOrder: 9 },
  { slug: "vw-polo", brand: "Volkswagen", model: "Polo", title: "VW Polo", year: 2021, carClass: CarClass.COMPACT, categories: [CarCategory.COMPACT], passengers: 5, doors: 5, luggage: 2, fuelType: FuelType.PETROL, priceEur: 55, depositEur: 200, image: "/cars/vw-polo.webp", sortOrder: 10 },
  { slug: "skoda-scala", brand: "Škoda", model: "Scala", title: "Škoda Scala", year: 2021, carClass: CarClass.COMPACT, categories: [CarCategory.COMPACT], passengers: 5, doors: 5, luggage: 3, fuelType: FuelType.PETROL, priceEur: 55, depositEur: 200, image: "/cars/skoda-scala.webp", sortOrder: 11 },
  { slug: "vw-golf-7", brand: "Volkswagen", model: "Golf 7", title: "VW Golf 7", year: 2018, carClass: CarClass.COMPACT, categories: [CarCategory.COMPACT], passengers: 5, doors: 5, luggage: 2, fuelType: FuelType.DIESEL, priceEur: 45, depositEur: 200, image: "/cars/vw-golf-7.webp", sortOrder: 12 },
  { slug: "skoda-octavia-karavan-2018", brand: "Škoda", model: "Octavia Combi", title: "Škoda Octavia Karavan", year: 2018, carClass: CarClass.MIDSIZE, categories: [CarCategory.KARAVAN], passengers: 5, doors: 5, luggage: 4, fuelType: FuelType.DIESEL, priceEur: 50, depositEur: 200, image: "/cars/skoda-octavia-combi-2018.webp", sortOrder: 13 },
  { slug: "vw-touran", brand: "Volkswagen", model: "Touran", title: "VW Touran", year: 2019, carClass: CarClass.VAN, categories: [CarCategory.TRANSPORT], passengers: 7, doors: 5, luggage: 4, fuelType: FuelType.DIESEL, priceEur: 60, depositEur: 200, image: "/cars/vw-touran.webp", sortOrder: 14 },
  { slug: "vw-sharan", brand: "Volkswagen", model: "Sharan", title: "VW Sharan", year: 2019, carClass: CarClass.VAN, categories: [CarCategory.TRANSPORT], passengers: 7, doors: 5, luggage: 4, fuelType: FuelType.DIESEL, priceEur: 65, depositEur: 200, image: "/cars/vw-sharan.webp", sortOrder: 15 },
  { slug: "vw-caravelle", brand: "Volkswagen", model: "Caravelle", title: "VW Caravelle (8+1)", year: 2019, carClass: CarClass.MINIBUS, categories: [CarCategory.MINIBUS], passengers: 9, doors: 4, luggage: 6, fuelType: FuelType.DIESEL, priceEur: 100, depositEur: 200, image: "/cars/vw-caravelle.webp", sortOrder: 16 },
  { slug: "vw-transporter", brand: "Volkswagen", model: "Transporter", title: "VW Transporter (8+1)", year: 2019, carClass: CarClass.MINIBUS, categories: [CarCategory.MINIBUS], passengers: 9, doors: 4, luggage: 6, fuelType: FuelType.DIESEL, priceEur: 120, depositEur: 200, image: "/cars/vw-transporter.webp", sortOrder: 17 },
  { slug: "mercedes-vito-2014", brand: "Mercedes-Benz", model: "Vito", title: "Mercedes Vito (2014)", year: 2014, carClass: CarClass.MINIBUS, categories: [CarCategory.MINIBUS], passengers: 9, doors: 4, luggage: 6, fuelType: FuelType.DIESEL, priceEur: 90, depositEur: 200, image: "/cars/mercedes-vito-2014.webp", sortOrder: 18 },
];

const gallery = (main: string) => {
  const base = main.replace(/\.webp$/, "");
  return [main, `${base}-2.webp`, `${base}-3.webp`];
};

const extras = [
  { id: "abc-no-deposit", nameHr: "Bez depozita", nameEn: "No deposit", noteHr: "Mala dnevna naknada umjesto depozita", noteEn: "A small daily fee instead of a deposit", pricing: ExtraPricing.PER_DAY, eur: 10, maxQty: 1, totalStock: 99, sortOrder: 0 },
  { id: "abc-child-seat", nameHr: "Dječija sjedalica", nameEn: "Child seat", noteHr: "Za djecu od 1 do 5 godina", noteEn: "For children aged 1 to 5", pricing: ExtraPricing.PER_DAY, eur: 5, maxQty: 2, totalStock: 4, sortOrder: 1 },
  { id: "abc-booster-seat", nameHr: "Booster sjedište", nameEn: "Booster seat", noteHr: "Za djecu od 5 do 10 godina", noteEn: "For children aged 5 to 10", pricing: ExtraPricing.PER_DAY, eur: 10, maxQty: 2, totalStock: 4, sortOrder: 2 },
  { id: "abc-cross-border", nameHr: "Prelazak granice", nameEn: "Cross border", noteHr: "Vožnja izvan Bosne i Hercegovine", noteEn: "Driving outside Bosnia and Herzegovina", pricing: ExtraPricing.PER_RENTAL, eur: 15, maxQty: 1, totalStock: 99, sortOrder: 3 },
  { id: "abc-cleaning", nameHr: "Čišćenje vozila", nameEn: "Cleaning", noteHr: "Vozilo vraćate bez čišćenja", noteEn: "Return the car without cleaning it", pricing: ExtraPricing.PER_RENTAL, eur: 15, maxQty: 1, totalStock: 99, sortOrder: 4 },
  { id: "abc-private-driver", nameHr: "Privatni vozač", nameEn: "Private driver", noteHr: "Samo vozač, gorivo nije uključeno", noteEn: "Driver only, fuel not included", pricing: ExtraPricing.PER_DAY, eur: 50, maxQty: 1, totalStock: 3, sortOrder: 5 },
  { id: "abc-all-inclusive", nameHr: "All inclusive: auto i vozač", nameEn: "All inclusive: car and driver", noteHr: "Auto, vozač, gorivo i parking u jednoj dnevnoj cijeni", noteEn: "Car, driver, fuel and parking in one daily price", pricing: ExtraPricing.PER_DAY, eur: 150, maxQty: 1, totalStock: 3, sortOrder: 6 },
];

async function main() {
  for (const loc of locations) {
    await prisma.location.upsert({ where: { slug: loc.slug }, update: loc, create: loc });
  }

  for (const c of cars) {
    const data = {
      slug: c.slug,
      brand: c.brand,
      model: c.model,
      title: c.title,
      year: c.year,
      carClass: c.carClass,
      categories: c.categories,
      transmission: Transmission.AUTOMATIC,
      passengers: c.passengers,
      doors: c.doors,
      luggage: c.luggage,
      fuelType: c.fuelType,
      airCondition: true,
      pricePerDay: eur(c.priceEur),
      deposit: eur(c.depositEur),
      currency: "BAM",
      images: gallery(c.image),
      isAvailable: true,
      isFeatured: c.isFeatured ?? false,
      sortOrder: c.sortOrder,
    };
    await prisma.car.upsert({ where: { slug: c.slug }, update: data, create: data });
  }

  for (const { eur: price, ...e } of extras) {
    const data = { ...e, price: eur(price), isActive: true };
    await prisma.extra.upsert({ where: { id: e.id }, update: data, create: data });
  }
  await prisma.extra.updateMany({
    where: { id: { notIn: extras.map((e) => e.id) } },
    data: { isActive: false },
  });

  console.log(`Seeded ${locations.length} locations, ${cars.length} cars and ${extras.length} extras`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
