document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(["sites"], (result) => {
    const blockedSites = result.sites || {};
    console.log(result);
    console.log(blockedSites);
  });
  // const startHour = document.getElementById("startHour");
  // const endHour = document.getElementById("endHour");

  // chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  //   const currentTab = tabs[0];
  //   const currentUrl = currentTab.url;

  //   chrome.storage.sync.get(["sites"], (result) => {
  //     const blockedSites = result.sites || {};

  //     const blockSchedule = blockedSites[currentUrl];

  //     startHour.textContent = blockSchedule.startHour;
  //     endHour.textContent = blockSchedule.endHour;
  //   });
  // });
});
