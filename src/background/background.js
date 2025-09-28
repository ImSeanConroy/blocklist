// Initialize blocked sites and schedule on extension install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    sites: {}, // format: { "example.com": { startHour: 9, endHour: 17 } }
  });
});

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.storage.sync.get(["sites"], (result) => {
    const blockedSites = result.sites || {};
    const url = new URL(details.url);
    const hostname = url.hostname;

    for (const domain in blockedSites) {
      if (
        details.frameId === 0 &&
        isDomainMatch(hostname, domain) &&
        isWithinBlockTime(blockedSites[domain])
      ) {
        const site = blockedSites[domain];
        chrome.tabs.update(details.tabId, {
          url: `blocked/blocked.html?site=${domain}&start=${site.startHour}&end=${site.endHour}`,
        });
        break;
      }
    }
  });
});

// Check if a hostname belongs to a blocked domain
function isDomainMatch(hostname, domain) {
  return (
    hostname === domain || hostname.endsWith("." + domain)
  );
}

// Function to check if the current time is within the blocking schedule
function isWithinBlockTime(blockSchedule) {
  const currentHour = new Date().getHours();
  return (
    currentHour >= blockSchedule.startHour &&
    currentHour < blockSchedule.endHour
  );
}
