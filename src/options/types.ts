export type SiteRule = {
  startHour: number;
  endHour: number;
  enabled: boolean;
  days?: number[]; // 0=Sun, 1=Mon, ..., 6=Sat; undefined means all days
};

export type BlockedSites = Record<string, SiteRule>;

export const DEFAULT_RULE: SiteRule = {
  startHour: 9,
  endHour: 17,
  enabled: true,
  days: [0, 1, 2, 3, 4, 5, 6],
};
