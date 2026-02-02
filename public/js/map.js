document.addEventListener("DOMContentLoaded", function () {

  const mapDiv = document.getElementById("map");

  // data attributes are strings → OK for Leaflet
  const lat = Number(mapDiv.dataset.lat);
  const lng = Number(mapDiv.dataset.lng);

  const map = L.map("map").setView([lat, lng], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup("Listing location");

  setTimeout(() => {
    map.invalidateSize();
  }, 300);
});
