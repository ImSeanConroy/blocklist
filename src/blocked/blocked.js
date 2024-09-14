document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const site = params.get("site");
  const start = params.get("start");
  const end = params.get("end");

  if (site && start && end) {
    document.getElementById("site").textContent = site;
    document.getElementById("start").textContent = start;
    document.getElementById("end").textContent = end;
  }
});
