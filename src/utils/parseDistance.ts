/**
 * Parses a distance string supporting both standard (5.2) and European (5,2) formats.
 * Returns null if the value is invalid or out of plausible running range (0.1–200 km).
 */
export function parseDistance(raw: string): number | null {
  const normalized = raw.replace(',', '.');
  const value = parseFloat(normalized);
  if (isNaN(value) || value <= 0 || value > 200) return null;
  return value;
}
