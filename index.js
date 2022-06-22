"use strict";

function initMap() {
    var myLatlng = { lat: 25.2138, lng: 75.8648 };
    var map = new google.maps.Map(document.getElementById("map"), {
        zoom: 8,
        center: myLatlng,
    });
    // Configure the click listener.
    map.addListener("click", function (mapsMouseEvent) {
        // Close the current InfoWindow.
        new google.maps.Marker({
            position: mapsMouseEvent.latLng,
            map: map,
            title: JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
        });
        const latlong=JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2);
        document.getElementById('lat').value = latlong.lat;
        document.getElementById('lng').value = latlong.lng;
        console.log(JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2));
    });
}
window.initMap = initMap;
