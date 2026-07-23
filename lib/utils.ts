import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const vehiclePricesMap: Record<string, number> = {
  'First Class Sedan': 300,
  'Premium SUV': 200,
  'VIP Business Van': 150,
  'Executive Sedan': 120,
}

export function getVehiclePrice(vehicleType?: string): number {
  if (!vehicleType) return 150;
  if (vehiclePricesMap[vehicleType]) return vehiclePricesMap[vehicleType];
  const lower = vehicleType.toLowerCase();
  for (const [key, price] of Object.entries(vehiclePricesMap)) {
    if (lower.includes(key.toLowerCase())) return price;
  }
  return 150;
}
