const DEFAULT_RULE = {
  startHour: 9,
  endHour: 17,
  enabled: true,
  days: [0, 1, 2, 3, 4, 5, 6],
};

let cachedSites = {};

initializeStorage();

chrome.runtime.onInstalled.addListener(async () => {
  await initializeStorage();
});

chrome.runtime.onStartup.addListener(async () => {
  await loadSitesCache();
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "sync" && changes.sites) {
    cachedSites = changes.sites.newValue || {};
  }
});

chrome.webNavigation.onBeforeNavigate.addListener(async (details) => {
  if (details.frameId !== 0 || details.tabId < 0 || shouldIgnoreUrl(details.url)) {
    return;
  }

  const hostname = getHostname(details.url);
  if (!hostname) {
    return;
  }

  if (!Object.keys(cachedSites).length) {
    await loadSitesCache();
  }

  for (const [domainPattern, ruleValue] of Object.entries(cachedSites)) {
    const rule = normalizeRule(ruleValue);

    if (!rule.enabled || !isDomainMatch(hostname, domainPattern)) {
      continue;
    }

    if (!isWithinBlockTime(rule)) {
      continue;
    }

    const blockedUrl = chrome.runtime.getURL("blocked/blocked.html");
    const redirectUrl = `${blockedUrl}?site=${encodeURIComponent(
      domainPattern,
    )}&start=${rule.startHour}&end=${rule.endHour}`;

    await chrome.tabs.update(details.tabId, {
      url: redirectUrl,
    });

    return;
  }
});

async function initializeStorage() {
  const result = await chrome.storage.sync.get(["sites"]);

  if (!result.sites) {
    await chrome.storage.sync.set({ sites: {} });
    cachedSites = {};
    return;
  }

  cachedSites = result.sites;
}

async function loadSitesCache() {
  const result = await chrome.storage.sync.get(["sites"]);
  cachedSites = result.sites || {};
}

function shouldIgnoreUrl(url) {
  if (!url) {
    return true;
  }

  const extensionBlockedPage = chrome.runtime.getURL("blocked/blocked.html");

  return (
    url.startsWith(extensionBlockedPage) ||
    /^(chrome|chrome-extension|edge|about|devtools|view-source):/i.test(url)
  );
}

function getHostname(url) {
  try {
    return new URL(url).hostname.toLowerCase();
  } catch {
    return "";
  }
}

function normalizeRule(ruleValue) {
  const startHour = normalizeHour(ruleValue?.startHour, DEFAULT_RULE.startHour);
  const endHour = normalizeHour(ruleValue?.endHour, DEFAULT_RULE.endHour);
  const rawDays = ruleValue?.days;
  const days = Array.isArray(rawDays)
    ? rawDays.filter((d) => typeof d === "number" && d >= 0 && d <= 6)
    : DEFAULT_RULE.days;

  return {
    startHour,
    endHour,
    enabled:
      typeof ruleValue?.enabled === "boolean"
        ? ruleValue.enabled
        : DEFAULT_RULE.enabled,
    days: days.length > 0 ? days : DEFAULT_RULE.days,
  };
}

function normalizeHour(value, fallback) {
  const parsedValue = Number.parseInt(value, 10);

  if (Number.isNaN(parsedValue) || parsedValue < 0 || parsedValue > 23) {
    return fallback;
  }

  return parsedValue;
}

function normalizeDomainPattern(domainPattern) {
  if (!domainPattern) {
    return "";
  }

  const trimmedValue = String(domainPattern).trim().toLowerCase();

  if (!trimmedValue) {
    return "";
  }

  let hostname = trimmedValue;

  try {
    const asUrl = trimmedValue.includes("://")
      ? new URL(trimmedValue)
      : new URL(`https://${trimmedValue}`);

    hostname = asUrl.hostname.toLowerCase();
  } catch {
    hostname = trimmedValue.split("/")[0].toLowerCase();
  }

  return hostname.replace(/^\.+/, "").replace(/\.+$/, "");
}

function toWildcardRegex(pattern) {
  const escapedPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");

  return new RegExp(`^${escapedPattern}$`, "i");
}

function isDomainMatch(hostname, domainPattern) {
  const normalizedHostname = hostname.toLowerCase();
  const normalizedPattern = normalizeDomainPattern(domainPattern);

  if (!normalizedPattern) {
    return false;
  }

  if (normalizedPattern.includes("*")) {
    return toWildcardRegex(normalizedPattern).test(normalizedHostname);
  }

  return (
    normalizedHostname === normalizedPattern ||
    normalizedHostname.endsWith(`.${normalizedPattern}`)
  );
}

function isWithinBlockTime(blockSchedule) {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();

  const activeDays = Array.isArray(blockSchedule?.days) && blockSchedule.days.length > 0
    ? blockSchedule.days
    : DEFAULT_RULE.days;

  if (!activeDays.includes(currentDay)) {
    return false;
  }

  const startHour = normalizeHour(blockSchedule?.startHour, DEFAULT_RULE.startHour);
  const endHour = normalizeHour(blockSchedule?.endHour, DEFAULT_RULE.endHour);

  // start == end means "always block".
  if (startHour === endHour) {
    return true;
  }

  if (startHour < endHour) {
    return currentHour >= startHour && currentHour < endHour;
  }

  // Overnight schedule (for example, 22 to 06).
  return currentHour >= startHour || currentHour < endHour;
}
