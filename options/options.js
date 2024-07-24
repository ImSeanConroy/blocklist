document.addEventListener('DOMContentLoaded', () => {
  const blockedList = document.getElementById('blocked-list');
  const siteInput = document.getElementById('siteInput');
  const blockButton = document.getElementById('blockButton');
  const startHourInput = document.getElementById('startHour');
  const endHourInput = document.getElementById('endHour');
  const setScheduleButton = document.getElementById('setScheduleButton');

  // Function to enable or disable the block button based on the current time and block schedule
  function updateSetScheduleButtonState(startHour, endHour) {
    if (isCurrentTimeBetween(startHour, endHour)) {
      setScheduleButton.disabled = true;
      console.log('Block button disabled during active block time.');
    } else {
      setScheduleButton.disabled = false;
      console.log('Block button enabled.');
    }
  }
  
  // Function to check if current time is between start and end hours
  function isCurrentTimeBetween(startHour, endHour) {
    const currentHour = new Date().getHours();
    if (startHour <= endHour) {
      return currentHour >= startHour && currentHour < endHour;
    } else {
      // If startHour is greater than endHour, it's a span across midnight
      return currentHour >= startHour || currentHour < endHour;
    }
  }

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

    // Update set schedule button state based on the current block schedule
    updateSetScheduleButtonState(blockSchedule.startHour, blockSchedule.endHour);
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

    // Validate new block schedule input
    if (isNaN(startHour) || isNaN(endHour) || startHour < 0 || startHour > 23 || endHour < 0 || endHour > 23) {
      console.log('Invalid input for start or end hour.');
      return; // Prevent further execution if input is invalid
    }

    // Get current block schedule from storage
    chrome.storage.sync.get(['blockSchedule'], (result) => {
      const currentSchedule = result.blockSchedule || { startHour: 0, endHour: 24 };

      // Check if current time is between the current block schedule
      if (isCurrentTimeBetween(currentSchedule.startHour, currentSchedule.endHour)) {
        console.log('Cannot update schedule during active block time.');
        return; // Prevent further execution if current time is within active block schedule
      }

      // Set new block schedule
      chrome.storage.sync.set({ blockSchedule: { startHour, endHour } }, () => {
        console.log('Block schedule set');

        // Update set schedule button state based on the new block schedule
        updateSetScheduleButtonState(startHour, endHour);
      });
    });
  });
});
