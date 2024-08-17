document.addEventListener("DOMContentLoaded", () => {
  const blockedList = document.getElementById("blockedList");
  const blockButton = document.getElementById("blockButton");
  const siteInput = document.getElementById("siteInput");
  const menu = document.getElementById("menu");
  const startHourInput = document.getElementById("startHour");
  const endHourInput = document.getElementById("endHour");
  const setScheduleButton = document.getElementById("setScheduleButton");

  var selectedSite = "";

  // Create favicon element with specified size
  function createFaviconElement(site) {
    const img = document.createElement("img");
    img.src = `https://www.google.com/s2/favicons?domain=${site}&size=24`; // Modify if favicons are hosted elsewhere
    img.alt = "Favicon";
    img.style.width = "24px"; // Adjust size as needed
    img.style.height = "24px"; // Adjust size as needed
    img.style.marginRight = "8px"; // Space between favicon and site name
    return img;
  }

  // Add element to list
  function addElementToList(blockedList, site, siteObject) {
    const li = document.createElement("li");
    li.textContent = site;
    const favicon = createFaviconElement(site); // Ensure this function exists

    li.addEventListener("click", (event) => {
      showMenu(event, site, siteObject);
    });

    li.prepend(favicon);
    blockedList.appendChild(li);
  }

  // Block site
  blockButton.addEventListener("click", () => {
    const site = siteInput.value.trim();
    console.log("site", site)
    if (site) {

      chrome.storage.sync.get(["sites"]).then((result) => {
        var blockedSites = result.sites || {};
        console.log("result", result)

        // Check if the site is already blocked
        if (!blockedSites.hasOwnProperty(site)) {
          blockedSites[site] = { startHour: 9, endHour: 17 };

          // Save the updated blockedSites object
          chrome.storage.sync.set({ sites: blockedSites }).then(() => {
            console.log("Added blockedSites:", blockedSites);

            // Update the UI with the newly blocked site
            addElementToList(blockedList, site, blockedSites[site]);
          });
        }
      });
    }
  });

  // Load blocked sites
  chrome.storage.sync.get(["sites"]).then((result) => {
    const blockedSites = result.sites || {};
    console.log("Loaded blockedSites:", blockedSites);

    // Iterate over the keys of the blockedSites object
    Object.keys(blockedSites).forEach((site) => {
      addElementToList(blockedList, site, blockedSites[site]);
    });
  });

  // Create and show menu
  function showMenu(event, site, siteObject) {
    menu.style.display = "block";

    selectedSite = site;
    startHourInput.value = siteObject.startHour;
    endHourInput.value = siteObject.endHour;

    // Hide menu when clicking outside
    function handleClickOutside(e) {
      if (!menu.contains(e.target) && !event.target.contains(e.target)) {
        menu.style.display = "none";
        selectedSite = "";
        document.removeEventListener("click", handleClickOutside);
      }
    }
    document.addEventListener("click", handleClickOutside);
  }

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
    chrome.storage.sync.get(["sites"]).then((result) => {
      var blockedSites = result.sites || {};
      
      if (blockedSites.hasOwnProperty(selectedSite)) {
        blockedSites[selectedSite] = { startHour, endHour }
       
        chrome.storage.sync.set({ sites: blockedSites }).then(() => {
          console.log("Updates blockedSites:", blockedSites);
        });
      }
    });
  });
});
