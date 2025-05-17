const map = L.map("map").setView([-6.3065, 106.7562], 17);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Lokasi kampus
const locations = {
  FST: [-6.306305, 106.752822],
  FDIKOM: [-6.306919, 106.753608],
  FITK: [-6.30738, 106.75448],
  FAH: [-6.30718, 106.75515],
  Rektorat: [-6.30597, 106.75555],
  Perpustakaan: [-6.306222938192857, 106.75374960143508],
  Masjid: [-6.30603, 106.75691],
  PLT: [-6.30609530905079, 106.75317195082494],
  FISIP: [-6.309149, 106.759441],
  PSIKOLOGI: [-6.309715, 106.759458],
  KEDOKTERAN: [-6.311990463930815, 106.7600022649262],
  PPG: [-6.386193812644769, 106.74494002136062],
};

// Marker
for (const [key, coords] of Object.entries(locations)) {
  L.marker(coords).addTo(map).bindPopup(`Gedung ${key}`);
}

// Fungsi cari rute
function findRoute() {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!start || !end || start === end) {
    alert("Pilih dua lokasi yang berbeda.");
    return;
  }

  const pointA = L.latLng(locations[start]);
  const pointB = L.latLng(locations[end]);

  if (window.routingControl) {
    map.removeControl(window.routingControl);
  }

  window.routingControl = L.Routing.control({
    waypoints: [pointA, pointB],
    routeWhileDragging: false,
    show: false,
    createMarker: () => null,
  }).addTo(map);

  const distance = map.distance(pointA, pointB); // meter

  const walkingSpeed = 80; // meter/menit
  const motorcycleSpeed = 300; // meter/menit

  const walkTime = (distance / walkingSpeed).toFixed(1);
  const motorTime = (distance / motorcycleSpeed).toFixed(1);

  document.getElementById("info").innerHTML = `
    <strong>Petunjuk Arah:</strong> Dari Gedung ${start} ke Gedung ${end}<br/>
    <strong>Jarak (garis lurus):</strong> ${(distance / 1000).toFixed(
      2
    )} km<br/>
    <strong>Estimasi waktu tempuh:</strong><br/>
    🚶 Jalan kaki: ${walkTime} menit<br/>
    🛵 Motor: ${motorTime} menit<br/>
    
  `;
}
