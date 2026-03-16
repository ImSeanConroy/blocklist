export type SiteRule = {
  startHour: number;
  endHour: number;
  enabled: boolean;
};

export type BlockedSites = Record<string, SiteRule>;

export const DEFAULT_RULE: SiteRule = {
  startHour: 9,
  endHour: 17,
  enabled: true,
};
