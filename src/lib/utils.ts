export function formatRefID(id: string, prefix: string): string {
  if (!id) return '';
  if (prefix === 'CHL') return id;
  // Convert the last 6 chars of CUID into a purely numeric string
  const numericId = parseInt(id.slice(-6), 36).toString();
  // Pad with zeros to ensure it's at least 6 digits
  return numericId.padStart(6, '0');
}
