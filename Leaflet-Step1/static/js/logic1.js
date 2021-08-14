var map = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
});
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1Ijoid2FycmVuczA5MjQiLCJhIjoiY2tyem4wa3lpMWJ0ajJ3azNrMGJ2b29qMCJ9.CSiGXvmy_7iNH3p1CpAQ7Q", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
}).addTo(map);
var earthquakes = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
d3.json(earthquakes, function(response) {
    console.log(response);
    function styleInfo(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.geometry.coordinates[2]),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }
    function getColor(depth) {
        switch (true) {
            case depth > 90:
                return "#EA2C2C";
            case depth > 70:
                return "#EA822C";
            case depth > 50:
                return "#EE9C00";
            case depth > 30:
                return "#EECC00";
            case depth > 10:
                return "#D4EE00";
            default:
                return "#98EE00";
        }
    }
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 3;
    }
    L.geoJson (response, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker (latlng);
        },
        style: styleInfo,
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude:" + feature.properties.mag + "<br> Location:" + feature.properties.place);
        }
    }).addTo(map)
});
function getColor(depth) {
    switch (true) {
        case depth > 90:
            return "#EA2C2C";
        case depth > 70:
            return "#EA822C";
        case depth > 50:
            return "#EE9C00";
        case depth > 30:
            return "#EECC00";
        case depth > 10:
            return "#D4EE00";
        default:
            return "#98EE00";
    }
}
var legend = L.control({
    position: "bottomright"
});
legend.onAdd = function (map) {
    var div = L
        .DomUtil
        .create("div", "info legend"),
        grades = [0,10,30,50,70,90],
        labels = [],
        from, to;
    for (var i = 0; i < grades.length; i++) {
        from = grades[i];
        to = grades[i + 1];
        labels.push(
            '<i style="background:' + getColor(from + 1) + '"></i> ' +
            from + (to ? '&ndash;' + to : '+'));
    }
    div.innerHTML = labels.join('<br>');
    return div;
};
legend.addTo(map);