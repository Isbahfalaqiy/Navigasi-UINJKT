const map = L.map("map").setView([-6.3065, 106.7562], 17);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Lokasi kampus
const locations = {
  FST: [-6.306305, 106.752822],
  FDIKOM: [-6.306919, 106.753608],
  FITK: [-6.306871112804703, 106.75524924067403],
  FAH: [-6.3133959096450045, 106.75534459437401],
  Rektorat: [-6.306664867944179, 106.75615934105818],
  Perpustakaan: [-6.306222938192857, 106.75374960143508],
  Kemahasiswaan: [-6.306206750850541, 106.75532856796707],
  MasjidSC: [-6.306235993185436, 106.75467906797485],
  PLT: [-6.30609530905079, 106.75317195082494],
  FISIP: [-6.309149, 106.759441],
  PSIKOLOGI: [-6.309715, 106.759458],
  KEDOKTERAN: [-6.311990463930815, 106.7600022649262],
  PPG: [-6.386193812644769, 106.74494002136062],
  Auditorium: [-6.306291872034081, 106.755889629895],
  FDI: [-6.306065534960433, 106.75650073775569],
  Ushuluddin: [-6.306804107345143, 106.75392545389539],
  KantinFST: [-6.306328238087952, 106.75213763715745],
  SC: [-6.306296515436824, 106.755031896224],
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
  })
    .on("routesfound", function (e) {
      const route = e.routes[0];
      const distance = route.summary.totalDistance; // in meters
      const walkingSpeed = 70; // meters/min (lebih realistis seperti Google Maps)
      const motorcycleSpeed = 200; // meters/min (perkiraan rata-rata)

      const walkTime = (distance / walkingSpeed).toFixed(1);
      const motorTime = (distance / motorcycleSpeed).toFixed(1);

      document.getElementById("info").innerHTML = `
        <strong>Petunjuk Arah:</strong> Dari Gedung ${start} ke Gedung ${end}<br/>
        <strong>Jarak (rute sebenarnya):</strong> ${(distance / 1000).toFixed(
          2
        )} km<br/>
        <strong>Estimasi waktu tempuh:</strong><br/>
        🚶 Jalan kaki: ${walkTime} menit<br/>
        🛵 Motor: ${motorTime} menit<br/>
      `;
    })
    .addTo(map);
  window.routingControl.on("routesfound", function () {
    setTimeout(() => {
      const container = document.querySelector(".leaflet-routing-container");

      if (container && !container.classList.contains("has-toggle")) {
        const toggleBtn = document.createElement("div");
        toggleBtn.className = "routing-toggle";
        toggleBtn.innerText = "⬇️ / ⬆️";
        toggleBtn.onclick = () => {
          container.classList.toggle("collapsed");
        };

        container.prepend(toggleBtn);
        container.classList.add("collapsed", "has-toggle");
      }
    }, 500);
  });
}
