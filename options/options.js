document.addEventListener('DOMContentLoaded', () => {
  const blockedList = document.getElementById('blocked-list');
  const siteInput = document.getElementById('siteInput');
  const blockButton = document.getElementById('blockButton');
  const startHourInput = document.getElementById('startHour');
  const endHourInput = document.getElementById('endHour');
  const setScheduleButton = document.getElementById('setScheduleButton');

  // Load blocked sites
  chrome.storage.sync.get(['blockedSites', 'blockSchedule'], (result) => {
    const blockedSites = result.blockedSites || [];
    const blockSchedule = result.blockSchedule || { startHour: 0, endHour: 24 };
    
    blockedSites.forEach(site => {
      const li = document.createElement('li');
      li.textContent = site;
      blockedList.appendChild(li);
    });
    
    startHourInput.value = blockSchedule.startHour;
    endHourInput.value = blockSchedule.endHour;
  });

  // Block site
  blockButton.addEventListener('click', () => {
    const site = siteInput.value.trim();
    if (site) {
      chrome.storage.sync.get(['blockedSites'], (result) => {
        const blockedSites = result.blockedSites || [];
        if (!blockedSites.includes(site)) {
          blockedSites.push(site);
          chrome.storage.sync.set({ blockedSites }, () => {
            const li = document.createElement('li');
            li.textContent = site;
            blockedList.appendChild(li);
          });
        }
      });
    }
  });

  // Set block schedule
  setScheduleButton.addEventListener('click', () => {
    const startHour = parseInt(startHourInput.value, 10);
    const endHour = parseInt(endHourInput.value, 10);

    if (!isNaN(startHour) && !isNaN(endHour) && startHour >= 0 && startHour <= 23 && endHour >= 0 && endHour <= 23) {
      chrome.storage.sync.set({ blockSchedule: { startHour, endHour } }, () => {
        console.log('Block schedule set');
      });
    }
  });
});
