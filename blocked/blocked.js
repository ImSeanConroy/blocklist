document.addEventListener("DOMContentLoaded", () => {
  const startHour = document.getElementById("startHour");
  const endHour = document.getElementById("endHour");

  chrome.storage.sync.get(["blockSchedule"], (result) => {
    const blockSchedule = result.blockSchedule || { startHour: 0, endHour: 24 };

    startHour.textContent = blockSchedule.startHour;
    endHour.textContent = blockSchedule.endHour;
  });
});
