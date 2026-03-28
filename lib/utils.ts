/**
 * Merges class names, filtering out falsy values.
 * Usage: cn("base", isActive && "active", undefined)  → "base active"
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
