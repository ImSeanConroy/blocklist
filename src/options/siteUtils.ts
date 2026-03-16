import { BlockedSites, DEFAULT_RULE, SiteRule } from "./types";

function isHour(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 23;
}

export function normalizeHour(value: unknown, fallback: number): number {
  const parsed = typeof value === "string" ? Number.parseInt(value, 10) : value;

  if (isHour(parsed)) {
    return parsed;
  }

  return fallback;
}

export function sanitizeRule(value: unknown): SiteRule {
  const asObject = typeof value === "object" && value !== null ? value as Partial<SiteRule> : {};

  return {
    startHour: normalizeHour(asObject.startHour, DEFAULT_RULE.startHour),
    endHour: normalizeHour(asObject.endHour, DEFAULT_RULE.endHour),
    enabled: typeof asObject.enabled === "boolean" ? asObject.enabled : DEFAULT_RULE.enabled,
  };
}

function sanitizeSiteKey(value: string): string {
  return value.trim().toLowerCase().replace(/^\.+/, "").replace(/\.+$/, "");
}

function isValidDomainPattern(value: string): boolean {
  if (!value || value.includes(" ")) {
    return false;
  }

  if (!/^[a-z0-9*.-]+$/.test(value)) {
    return false;
  }

  if (value.includes("..")) {
    return false;
  }

  return /[a-z0-9]/.test(value);
}

export function normalizeSiteInput(rawInput: string): string | null {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    return null;
  }

  let candidate = trimmed.toLowerCase();

  if (candidate.includes("://")) {
    try {
      candidate = new URL(candidate).hostname.toLowerCase();
    } catch {
      return null;
    }
  }

  candidate = candidate.split("/")[0].split(":")[0];
  candidate = sanitizeSiteKey(candidate);

  if (!isValidDomainPattern(candidate)) {
    return null;
  }

  return candidate;
}

export function formatHour(hour: number): string {
  return String(hour).padStart(2, "0");
}

export function formatSchedule(rule: SiteRule): string {
  if (rule.startHour === rule.endHour) {
    return "Always blocked";
  }

  const base = `${formatHour(rule.startHour)}:00 to ${formatHour(rule.endHour)}:00`;

  if (rule.startHour > rule.endHour) {
    return `${base} (overnight)`;
  }

  return base;
}

export function isWithinSchedule(rule: SiteRule, date: Date = new Date()): boolean {
  const currentHour = date.getHours();

  if (rule.startHour === rule.endHour) {
    return true;
  }

  if (rule.startHour < rule.endHour) {
    return currentHour >= rule.startHour && currentHour < rule.endHour;
  }

  return currentHour >= rule.startHour || currentHour < rule.endHour;
}

export function normalizeStoredSites(value: unknown): BlockedSites {
  if (typeof value !== "object" || value === null) {
    return {};
  }

  const entries = Object.entries(value as Record<string, unknown>)
    .map(([site, rawRule]) => [sanitizeSiteKey(site), sanitizeRule(rawRule)] as const)
    .filter(([site]) => isValidDomainPattern(site));

  return Object.fromEntries(entries);
}
