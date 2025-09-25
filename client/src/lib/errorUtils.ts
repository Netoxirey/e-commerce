export function getErrorMessage(message: string | string[] | undefined, fallback: string): string {
  if (!message) return fallback;
  return Array.isArray(message) ? message[0] : message;
}
