// Map-related fucntions
var map;
var myLatLng = new Object();
var infowindow = new google.maps.InfoWindow();
var storeName;
var markers = new Object();

// Adds a marker to the map and push to the markers dictionary.
function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
  });

  google.maps.event.addListener(marker, "click", function () {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });

  var marker_id = marker.position.lat() + "_" + marker.position.lng();
  markers[marker_id] = marker;
}

// Sets the map on all markers in the markers dictionary.
function setMapOnAll(map) {
  for (var key in markers) {
    markers[key].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the markers dictionary.
function clearMarkers() {
  setMapOnAll(null);
  markers = new Object();
}

function calculateAndDisplayRoute(
  directionsService,
  directionsDisplay,
  mode,
  start,
  end
) {
  directionsService.route(
    {
      origin: start,
      destination: end,
      travelMode: mode,
    },
    function (response, status) {
      if (status === "OK") {
        directionsDisplay.setDirections(response);
      } else {
        window.alert("No directions found");
      }
    }
  );
}

// Creates map centred in Singapore
function initMap() {
  var Singapore = new google.maps.LatLng(1.38, 103.8);
  map = new google.maps.Map(document.getElementById("map"), {
    center: Singapore,
    zoom: 11,
  });

  document.querySelector("#directions").innerHTML = "";
}

// Show Store Location as marker on map
function getStoreLocationMap(storeAddr) {
  initMap();
  var request = {
    query: storeAddr,
    fields: ["name", "geometry"],
  };

  service = new google.maps.places.PlacesService(map);

  service.findPlaceFromQuery(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      clearMarkers();
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
  });
}

// Show list of stores retrieved from API on page
function populateStoresOptions(storesArray) {
  let output = "";
  const container = document.querySelector(".contact-container");
  output += `<div class="card-deck">`;

  let headers = new Headers();
  headers.append("Access-Control-Allow-Origin", "*");

  storesArray.forEach(function (storeInfo) {
    var sName = `${storeInfo.licensee_name}`;
    var sAddr = `${storeInfo.block_house_num} ${storeInfo.street_name} ${storeInfo.postal_code}`;

    output += `
        <div class="col-lg-2 col-md-4 col-sm-6 px-0">
          <div class="card text-center">
            <div class="card-header">
              ${storeInfo.licensee_name}
            </div>
            <div class="card-body style='width: 12rem;'>
              <h5 class="card-title">${storeInfo.building_name}</h5>
              <p class="card-text text-muted">${storeInfo.block_house_num} ${storeInfo.street_name} ${storeInfo.postal_code}</p>
            </div>
            <div class="card-footer text-muted">
              <input type="submit" value="Map" onclick="return getStoreLocationMap('${sAddr}');"/>
            </div>
          </div>
        </div>
        `;
  });
  output += `</div>`;

  container.innerHTML = output;
}

$(function () {
  //Initialize Map
  initMap();

  $("#btn_retrieve").on("click", function (event) {
    var storesData;

    // Retrieves list of stores from data,gov.sg API
    fetch(
      "https://data.gov.sg/api/action/datastore_search?resource_id=3561a136-4ee4-4029-a5cd-ddf591cce643&limit=6"
    ).then((data) => populateStoresOptions(data.result.records));

    /*$.get(
      "https://data.gov.sg/api/action/datastore_search?resource_id=3561a136-4ee4-4029-a5cd-ddf591cce643&limit=6",
      function (data) {
        //alert(data.result.records[0].licensee_name);
        storesData = data;

        // Display list of retrieved store details
        populateStoresOptions(storesData.result.records);
      },
      "json"
    );*/
  });

  // Click event handler for btn_getDirections
  $("#btn_getDirections").on("click", function (event) {
    document.querySelector("#directions").innerHTML = "";
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var directionsService = new google.maps.DirectionsService();
    directionsDisplay.setMap(map);
    directionsDisplay.setPanel(document.getElementById("directions"));

    var start = $("#txtOrigin").val();
    var destMarker = Object.keys(markers)[0].split("_");
    var end = new google.maps.LatLng(destMarker[0], destMarker[1]);
    var mode = $("#selMode").val().toUpperCase();

    // Get directions from origin destination to store location
    calculateAndDisplayRoute(
      directionsService,
      directionsDisplay,
      mode,
      start,
      end
    );
  });
});
