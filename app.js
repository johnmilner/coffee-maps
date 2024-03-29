// Define map
const myMap = L.map('map');

// Define icon
const coffeeCup = L.icon({
  iconUrl: 'https://taniarascia.github.io/coffee/images/coffee.png',
  shadowUrl: '',
  iconSize: [35, 65]
});

// Define basemap
const myBasemap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}', {
  attribution: 'Tiles &copy; Esri &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC',
  maxZoom: 16
});

// Add basemap to map id
myBasemap.addTo(myMap);

// Set center of the map
myMap.setView([41.939948, -87.650673], 12);

// Make an XMLHttpRequest to the JSON data
const request = new XMLHttpRequest();
request.open('GET', 'locations.json', true);

request.onload = function () {
  // begin accessing JSON data here
  const data = JSON.parse(this.response);

  // Reduce neighborhoods down to how many they are, and count them
  const neighborhoodCount = data.cafes.reduce((sums, cafe) => {
    sums[cafe.neighborhood] = (sums[cafe.neighborhood] || 0) + 1;
    return sums;
  }, {});

  // Create a sidebar
  const sidebar = document.getElementById('neighborhoods');
  const h3 = document.createElement("h3");
  h3.innerHTML = "Neighborhood Count";
  sidebar.appendChild(h3);

  // Print all neighborhoods in sidebar
  for (let neighborhood in neighborhoodCount) {
    const p = document.createElement("p");
    p.innerHTML = `<b>${neighborhood}</b> : ${neighborhoodCount[neighborhood]}`;
    sidebar.appendChild(p);
  }

  // Print cafe markers
  const cafes = data.cafes.map(cafe => {
    console.log(cafe.store_id);

    L.marker([cafe.lat, cafe.long], {
      icon: coffeeCup
    }).bindPopup(`
        <h2>${cafe.name}</h2>
        <p><b>City:</b> ${cafe.city}</p>
        <p><b>Name:</b> ${cafe.name}</p>
        <p><b>Country:</b> ${cafe.country}</p>
        <p><b>Store ID:</b> ${cafe.store_id}</p>
    `).openPopup().addTo(myMap);
  });
}

request.send();

 // "city": "Hong Kong", 
 //    "name": "Plaza Hollywood", 
 //    "country": "CN", 
 //    "longitude": 114.20169067382812, 
 //    "latitude": 22.340700149536133, 
 //    "store_id": 1