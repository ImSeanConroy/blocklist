document.addEventListener("DOMContentLoaded", () => {
  const startHour = document.getElementById("startHour");
  const endHour = document.getElementById("endHour");

  chrome.storage.sync.get(["sites"], (result) => {
    const blockSchedule = result.sites || { };

    startHour.textContent = "Test";
    endHour.textContent = "Test";
  });
});
