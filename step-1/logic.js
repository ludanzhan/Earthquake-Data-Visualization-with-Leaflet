
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"


d3.json(url).then(function (data) {
  // Once we get a response, send the data.features object to the createFeatures function.
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  // Define a function that we want to run once for each feature in the features array.
  // Give each feature a popup that describes the place and time of the earthquake.
  function onEachFeature(feature, layer) {
    layer.bindPopup(
      "Magnitude: "
        + feature.properties.mag
        + "<br>Depth: "
        + feature.geometry.coordinates[2]
        + "<br>Location: "
        + feature.properties.place
    );

  }

  function depthColor(depth){
    if(depth > 90){
      return "#f21111"
    }
    else if(depth > 70){
      return "#f24911"
    }
    else if(depth > 50){
      return "#f28211"
    }
    else if(depth > 30){
      return "#f2ae11"
    }
    else if(depth > 10){
      return "#eef211"
    } 

    return "#9cf211"
  }
 
  function style (feature){
    return {  opacity: 1,
      fillOpacity: 1,
      fillColor: depthColor(feature.geometry.coordinates[2]),
      radius: feature.properties.mag*5,
      color: "#000000",
      stroke: true,
      weight: 0.5}
  }

  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: style
  });

  
  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
}

function createMap(earthquakes) {

  // Create the base layers.
  var street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  L.circleMarkers


  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load.
  var map = L.map("map", {
    center: [
      40.7, -94.5
    ],
    zoom: 5,
    layers: [street, earthquakes]
  });

  var legend = L.control({
     position: "bottomright" 
  })

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var level = [-10, 10 ,30, 50 ,70 ,90];
    var colors = ["#f21111", "#f24911","#f28211", "#f2ae11","#eef211", "#9cf211"];

    for (var i = 0; i < level.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> "
      + level[i] + (level[i + 1] ? "&ndash;" + level[i + 1] + "<br>" : "+");

    }


    return div
  }
  
   legend.addTo(map);
}
