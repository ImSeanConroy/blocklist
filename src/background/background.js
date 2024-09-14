// Initialize blocked sites and schedule on extension install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({
    sites: {}, // Add your actual blocked sites here
  });
});

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.storage.sync.get(["sites"], (result) => {
    const blockedSites = result.sites || {};
    const url = new URL(details.url);

    // console.log(`Navigating to: ${url.hostname}`);  // Debugging: Log the hostname
    // console.log(`Blocked sites: ${blockedSites}`);  // Debugging: Log blocked sites list

    if (
      details.frameId === 0 &&
      blockedSites.hasOwnProperty(url.hostname) &&
      isWithinBlockTime(blockedSites[url.hostname])
    ) {
      chrome.tabs.update(details.tabId, { url: "blocked/blocked.html" });
    }
  });
});

// Function to check if the current time is within the blocking schedule
function isWithinBlockTime(blockSchedule) {
  const currentHour = new Date().getHours();
  return (
    currentHour >= blockSchedule.startHour &&
    currentHour < blockSchedule.endHour
  );
}
