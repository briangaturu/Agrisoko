export const unitConversion: Record<string, number> = {
  bag: 50,   // 1 bag = 50 kg
  bags: 50,
  kg: 1,     // kilograms remain the same
  g: 0.001,  // grams to kg
  lb: 0.453592, // pounds to kg
};

export const normalizeToKg = (quantity: number, unit: string) => {
  const factor = unitConversion[unit.toLowerCase()] || 1;
  return quantity * factor;
};