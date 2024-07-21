chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ blockedSites: [], blockSchedule: { startHour: 0, endHour: 24 } });
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.storage.sync.get(['blockedSites', 'blockSchedule'], (result) => {
    const blockedSites = result.blockedSites || [];
    const blockSchedule = result.blockSchedule || { startHour: 0, endHour: 24 };
    const url = new URL(details.url);
    
    if (blockedSites.includes(url.hostname) && isWithinBlockTime(blockSchedule)) {
      chrome.tabs.update(details.tabId, { url: 'blocked/blocked.html' });
    }
  });
});

function isWithinBlockTime(blockSchedule) {
  const currentHour = new Date().getHours();
  return currentHour >= blockSchedule.startHour && currentHour < blockSchedule.endHour;
}
