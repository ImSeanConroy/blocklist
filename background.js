// Initialize blocked sites and schedule on extension install
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ 
    blockedSites: [], // Add your actual blocked sites here
    blockSchedule: { startHour: 9, endHour: 17 }  // Example block schedule
  });
});

// Listen for navigation events
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.storage.sync.get(['blockedSites', 'blockSchedule'], (result) => {
    const blockedSites = result.blockedSites || [];
    const blockSchedule = result.blockSchedule || { startHour: 0, endHour: 18 };
    const url = new URL(details.url);

    // Debugging
    // console.log(`Navigating to: ${url.hostname}`);  // Debugging: Log the hostname
    // console.log(`Blocked sites: ${blockedSites}`);  // Debugging: Log blocked sites list
    // console.log(`Block schedule: ${blockSchedule.startHour} - ${blockSchedule.endHour}`);  // Debugging: Log block schedule

    if (details.frameId === 0 && blockedSites.includes(url.hostname) && isWithinBlockTime(blockSchedule)) {
      chrome.tabs.update(details.tabId, { url: 'blocked/blocked.html' });
    }
  });
});

// Function to check if the current time is within the blocking schedule
function isWithinBlockTime(blockSchedule) {
  const currentHour = new Date().getHours();
  return currentHour >= blockSchedule.startHour && currentHour < blockSchedule.endHour;
}
