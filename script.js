// Inisialisasi peta
const map = L.map("map").setView([-6.3065, 106.7562], 17);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors",
}).addTo(map);

// Data lokasi gedung kampus
const locations = {
  LokasiSaya: null,
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

// Pasang marker ke peta
for (const [key, coords] of Object.entries(locations)) {
  if (coords) {
    L.marker(coords).addTo(map).bindPopup(`Gedung ${key}`);
  }
}

// Fungsi lokasi saya
function showMyLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation tidak didukung oleh browser ini.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      locations.LokasiSaya = [lat, lng];

      if (window.myLocationMarker) {
        map.removeLayer(window.myLocationMarker);
      }

      window.myLocationMarker = L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: "https://cdn-icons-png.flaticon.com/512/487/487021.png",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -32],
        }),
      })
        .addTo(map)
        .bindPopup("Lokasi Saya")
        .openPopup();

      map.setView([lat, lng], 17);
    },
    () => {
      alert("Gagal mendapatkan lokasi Anda.");
    }
  );
}

// Fungsi mencari rute
function findRoute() {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;

  if (!start || !end) {
    alert("Silakan pilih lokasi awal dan tujuan.");
    return;
  }

  if (start === end) {
    alert("Lokasi awal dan tujuan tidak boleh sama.");
    return;
  }

  if (start === "LokasiSaya" && !locations.LokasiSaya) {
    alert(
      "Mohon klik tombol Lokasi Saya untuk mendapatkan posisi Anda terlebih dahulu."
    );
    return;
  }

  const startCoords = locations[start];
  const endCoords = locations[end];

  if (!startCoords || !endCoords) {
    alert("Lokasi tidak ditemukan.");
    return;
  }

  if (window.routingControl) {
    map.removeControl(window.routingControl);
  }

  window.routingControl = L.Routing.control({
    waypoints: [L.latLng(startCoords), L.latLng(endCoords)],
    routeWhileDragging: false,
    createMarker: (i, wp) => {
      const iconUrl =
        i === 0
          ? "https://cdn-icons-png.flaticon.com/512/64/64113.png"
          : "https://cdn-icons-png.flaticon.com/512/149/149059.png";

      return L.marker(wp.latLng, {
        icon: L.icon({
          iconUrl,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        }),
      }).bindPopup(i === 0 ? "Start" : "End");
    },
  })
    .on("routesfound", function (e) {
      const route = e.routes[0];
      const distance = route.summary.totalDistance;
      const walkingSpeed = 70;
      const motorcycleSpeed = 200;

      const walkTime = (distance / walkingSpeed).toFixed(1);
      const motorTime = (distance / motorcycleSpeed).toFixed(1);

      const infoDiv = document.getElementById("info");
      infoDiv.style.display = "block";
      infoDiv.innerHTML = `
        <strong>Petunjuk Arah:</strong> Dari <em>${start}</em> ke <em>${end}</em><br/>
        <strong>Jarak:</strong> ${(distance / 1000).toFixed(2)} km<br/>
        <strong>Estimasi waktu tempuh:</strong><br/>
        🚶 Jalan kaki: ${walkTime} menit<br/>
        🛵 Motor: ${motorTime} menit
      `;

      // Tambahkan tombol toggle ke panel routing
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
    })
    .addTo(map);
}
