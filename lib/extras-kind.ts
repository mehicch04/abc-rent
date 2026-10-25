/** The all inclusive package already contains the car, so the rental is not charged on top of it. */
export function isAllInclusive(e: { nameEn: string }): boolean {
  return e.nameEn.trim().toLowerCase().startsWith("all inclusive");
}

export function isPrivateDriver(e: { nameEn: string }): boolean {
  return e.nameEn.trim().toLowerCase() === "private driver";
}

export function isNoDeposit(e: { nameEn: string }): boolean {
  return e.nameEn.trim().toLowerCase().includes("no deposit");
}
