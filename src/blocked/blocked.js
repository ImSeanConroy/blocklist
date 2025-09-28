document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);

  const site = params.get("site") || "this site";
  const start = formatHour(params.get("start"));
  const end = formatHour(params.get("end"));

  const siteEl = document.getElementById("site");
  const startEl = document.getElementById("start");
  const endEl = document.getElementById("end");

  if (siteEl) siteEl.textContent = site;
  if (startEl) startEl.textContent = start;
  if (endEl) endEl.textContent = end;
});

function formatHour(value) {
  const hour = parseInt(value, 10);
  if (isNaN(hour) || hour < 0 || hour > 23) return "00";
  return hour.toString().padStart(2, "0");
}
