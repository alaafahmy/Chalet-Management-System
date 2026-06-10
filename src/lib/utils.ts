export function formatRefID(id: string, prefix: string): string {
  if (!id) return '';
  return `${prefix}-${id.slice(-6).toUpperCase()}`;
}
