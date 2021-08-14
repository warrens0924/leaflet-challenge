// grayscale background.
var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoid2FycmVuczA5MjQiLCJhIjoiY2tyem4wa3lpMWJ0ajJ3azNrMGJ2b29qMCJ9.CSiGXvmy_7iNH3p1CpAQ7Q");
// satellite background.
var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoid2FycmVuczA5MjQiLCJhIjoiY2tyem4wa3lpMWJ0ajJ3azNrMGJ2b29qMCJ9.CSiGXvmy_7iNH3p1CpAQ7Q");
// outdoors background.
var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1Ijoid2FycmVuczA5MjQiLCJhIjoiY2tyem4wa3lpMWJ0ajJ3azNrMGJ2b29qMCJ9.CSiGXvmy_7iNH3p1CpAQ7Q");
// map object to an array of layers we created.
var map = L.map("map", {
  center: [37.09, -95.71],
  zoom: 5,
  layers: [graymap_background, satellitemap_background, outdoors_background]
});
// adding one 'graymap' tile layer to the map.
graymap_background.addTo(map);
// layers for two different sets of data, earthquakes and tectonicplates.
var tectonicplates = new L.LayerGroup();
var earthquakes = new L.LayerGroup();
// base layers
var baseMaps = {
  Satellite: satellitemap_background,
  Grayscale: graymap_background,
  Outdoors: outdoors_background
};
// overlays
var overlayMaps = {
  "Tectonic Plates": tectonicplates,
  "Earthquakes": earthquakes
};
// control which layers are visible.
L
  .control
  .layers(baseMaps, overlayMaps)
  .addTo(map);
// retrieve earthquake geoJSON data.
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }
  // Define the color of the marker based on the magnitude of the earthquake.
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#EA2C2C";
      case magnitude > 4:
        return "#EA822C";
      case magnitude > 3:
        return "#EE9C00";
      case magnitude > 2:
        return "#EECC00";
      case magnitude > 1:
        return "#D4EE00";
      default:
        return "#98EE00";
    }
  }
  // define the radius of the earthquake marker based on its magnitude.
  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }
    return magnitude * 3;
  }
  // add GeoJSON layer to the map
  L.geoJson(data, {
    pointToLayer: function(_feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }
  }).addTo(earthquakes);
  earthquakes.addTo(map);
  var legend = L.control({
    position: "bottomright"
  });
  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");
    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98EE00",
      "#D4EE00",
      "#EECC00",
      "#EE9C00",
      "#EA822C",
      "#EA2C2C"
    ];
    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };
  legend.addTo(map);
  // retrive Tectonic Plate geoJSON data.
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(tectonicplates);
      // add the tectonicplates layer to the map.
      tectonicplates.addTo(map);
    });
});