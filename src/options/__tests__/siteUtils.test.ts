import {
  formatSchedule,
  isWithinSchedule,
  normalizeSiteInput,
  normalizeStoredSites,
} from "../siteUtils";
import { describe, expect, it } from "vitest";

describe("siteUtils", () => {
  describe("normalizeSiteInput", () => {
    it("normalizes protocol and path", () => {
      expect(normalizeSiteInput("https://Example.com/news")).toBe("example.com");
    });

    it("supports wildcard domains", () => {
      expect(normalizeSiteInput("*.youtube.com")).toBe("*.youtube.com");
    });

    it("rejects invalid values", () => {
      expect(normalizeSiteInput("bad value")).toBeNull();
      expect(normalizeSiteInput("")).toBeNull();
    });
  });

  describe("formatSchedule", () => {
    it("formats always-blocking schedule", () => {
      expect(formatSchedule({ startHour: 0, endHour: 0, enabled: true })).toBe(
        "Always blocked",
      );
    });

    it("formats overnight schedule", () => {
      expect(formatSchedule({ startHour: 22, endHour: 6, enabled: true })).toContain(
        "overnight",
      );
    });
  });

  describe("isWithinSchedule", () => {
    it("matches standard daytime schedule", () => {
      const rule = { startHour: 9, endHour: 17, enabled: true };
      expect(isWithinSchedule(rule, new Date("2026-03-16T10:00:00"))).toBe(true);
      expect(isWithinSchedule(rule, new Date("2026-03-16T18:00:00"))).toBe(false);
    });

    it("matches overnight schedule", () => {
      const rule = { startHour: 22, endHour: 6, enabled: true };
      expect(isWithinSchedule(rule, new Date("2026-03-16T23:00:00"))).toBe(true);
      expect(isWithinSchedule(rule, new Date("2026-03-16T05:00:00"))).toBe(true);
      expect(isWithinSchedule(rule, new Date("2026-03-16T13:00:00"))).toBe(false);
    });

    it("respects day-of-week restrictions", () => {
      // 2026-03-16 is a Monday (day 1)
      const weekdayRule = { startHour: 9, endHour: 17, enabled: true, days: [1, 2, 3, 4, 5] };
      expect(isWithinSchedule(weekdayRule, new Date("2026-03-16T10:00:00"))).toBe(true);
      // 2026-03-15 is a Sunday (day 0) — not in days
      expect(isWithinSchedule(weekdayRule, new Date("2026-03-15T10:00:00"))).toBe(false);
    });
  });

  describe("normalizeStoredSites", () => {
    it("normalizes unknown stored values", () => {
      const normalized = normalizeStoredSites({
        "Example.com": { startHour: "8", endHour: 20 },
      });

      expect(normalized["example.com"]).toEqual({
        startHour: 8,
        endHour: 20,
        enabled: true,
        days: [0, 1, 2, 3, 4, 5, 6],
      });
    });

    it("returns empty object for invalid payload", () => {
      expect(normalizeStoredSites(null)).toEqual({});
      expect(normalizeStoredSites("value")).toEqual({});
    });
  });
});
