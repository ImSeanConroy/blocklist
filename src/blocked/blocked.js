document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const site = params.get("site") || "this site";
  const start = parseHour(params.get("start"));
  const end = parseHour(params.get("end"));

  const siteEl = document.getElementById("site");
  const scheduleEl = document.getElementById("schedule");

  if (siteEl) siteEl.textContent = site;

  if (scheduleEl) {
    scheduleEl.textContent = formatSchedule(start, end);
  }
});

function parseHour(value) {
  const hour = parseInt(value, 10);

  if (isNaN(hour) || hour < 0 || hour > 23) {
    return 0;
  }

  return hour;
}

function formatHour(hour) {
  return String(hour).padStart(2, "0");
}

function formatSchedule(startHour, endHour) {
  if (startHour === endHour) {
    return "all hours";
  }

  const base = `${formatHour(startHour)}:00 to ${formatHour(endHour)}:00`;

  if (startHour > endHour) {
    return `${base} (overnight)`;
  }

  return base;
}
