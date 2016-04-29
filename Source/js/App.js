(function($) {

  $('.top-left').hide();

  $(document).on('ready', function(){

    var viewer = new Cesium.Viewer('cesiumContainer');
    var scene = viewer.scene;
    var clock = viewer.clock;

    window.zoneError = '';
    window.userDefinedFlight = false;
    window.resetting = false;

    function setNoFlyZoneIcon(){

        var airport_data = "https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json";

        var nofly = false;

        $.ajax({
          url: airport_data,
          dataType: 'json',
          async: false,
          success: function(data) {

              $.each( data, function( key, val ) {

                var latitude = data[key].lat;
                var longitude = data[key].lon;
                viewer.entities.add({
                  name : data[key].name + ', ' + data[key].country,
                  position : Cesium.Cartesian3.fromDegrees(latitude, longitude),
                  point : {
                    pixelSize : 3,
                    color : Cesium.Color.RED,
                    outlineColor : Cesium.Color.WHITE,
                    outlineWidth : 2
                  },
                  label : {
                    text : data[key].name + ', ' + data[key].country,
                    font : '8pt monospace',
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    outlineWidth : 2,
                    verticalOrigin : Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset : new Cesium.Cartesian2(0, -9)
                  }
                });
              });
            }
        });
    }

    function getCoordinates(x, y, z){

        //Create a Cartesian and determine it's Cartographic representation on a WGS84 ellipsoid.
        var coordinates = {};
        var position = new Cesium.Cartesian3(x,y,z);
        var cartographicPosition = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
        var pi = 3.14159265359;
        var latitude = cartographicPosition.latitude * (180/pi);
        var longitude = cartographicPosition.longitude * (180/pi);
        //console.log('Current position: https://www.google.com/maps/@' + latitude + ',' + longitude + ',8z');

        coordinates.latitude = latitude;
        coordinates.longitude = longitude;
        coordinates.height = (cartographicPosition.height) / 1000; //converting m to km

        return coordinates;

    }

    function distance(lat1, lon1, lat2, lon2, unit) {

        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        if (unit=="K") { dist = dist * 1.609344 }
        if (unit=="N") { dist = dist * 0.8684 }
        return dist;

    }

    function nearNoFly(lat, lng, height) {

        var airport_data = "https://gist.githubusercontent.com/tdreyno/4278655/raw/7b0762c09b519f40397e4c3e100b097d861f5588/airports.json";

        var nofly = false;

        $.ajax({
          url: airport_data,
          dataType: 'json',
          async: false,
          success: function(data) {

              $.each( data, function( key, val ) {

                var latitude = data[key].lat;
                var longitude = data[key].lon;

                var pointDistance = distance(lat, lng, latitude, longitude, 'K');
                pointDistance = pointDistance.toFixed(2);
                var string_height = height.toString();
                var dot_position = string_height.indexOf(".");
                string_height = string_height.substr(0, (dot_position + 3));

                console.log(pointDistance + ' is the pointDistance');

                if (pointDistance < 20 && height < 20) {

                    console.log('Your drone is less than 20k (' + pointDistance + ') away at altitude (km): ' + string_height + ' from airport: ' + data[key].name);
                    console.log(data[key]);

                    window.zoneError = 'Your drone is less than 20k (' + pointDistance + ' km) away at altitude (km): ' + string_height + ' from airport: ' + data[key].name;
                    nofly = true;

                    //if we dont exit the airport data distance calculating at this point, it will go on to tell us additional airports that are within 20k
                    //rather than identifying the first one

                    return false;
                }

              });

          }

        });

        return nofly;

    }

    viewer.camera.moveStart.addEventListener(function(e) {

        $('#notifications').hide();

        //console.log('Start');

        var startingCoordinates = getCoordinates(viewer.camera.position.x, viewer.camera.position.y, viewer.camera.position.z);

        // set a timer to stop and check the position every millisecond and stop the flight if less than 20K from an airport
        // we use milliseconds to help us stop the flight as soon as possible after recognizing that we're less than 20k away

        // we want to skip the 1-per-millisecond nearNoFly zone checks
        // if this is a user defined flight and we're just navigating to their starting location

        // we also want to skip this check if we are just resetting to the original view

        if(window.userDefinedFlight === false && window.resetting === false){

            window.intervalTimer = setInterval(function() {

                var newCoordinates = getCoordinates(viewer.camera.position.x, viewer.camera.position.y, viewer.camera.position.z);
                var near = nearNoFly(newCoordinates.latitude, newCoordinates.longitude, newCoordinates.height);

                //console.log('stop move at this time? ' + near);

                if (near === true) {

                    if(!$('.top-left').hasClass('visible')){
                        $('.top-left').fadeIn('slow', function (){
                            setTimeout(function() {
                                $('.top-left').fadeOut();
                            }, 30000);
                        });
                        $('.top-left').addClass('visible');
                        $('#no-drone-zone #message').html(window.zoneError);
                    }

                    var scene = viewer.scene;

                    if(newCoordinates.height < 20){

                        if (scene && (scene.tweens.length > 0)) {
                         scene.tweens.removeAll();
                        }
                        //stop execution of this function and end the flight
                        clearInterval(intervalTimer);
                        return false;

                    }

                }

            }, 1);

        }

    });

    viewer.camera.moveEnd.addEventListener(function() {

        if(window.intervalTimer){
            clearInterval(intervalTimer);
        }

        //console.log('End');

        $('.top-left').removeClass('visible');

        //setNoFlyZoneIcon();

        // if we just finished navigating to the user defined starting location for a user-defined flight,
        // ask for the ending location

        if(window.userDefinedFlight === true){
            window.userDefinedFlight = false;
            var endingAddress = prompt("You are at your starting location! Please enter your ending address in the following format, or zip code","100 My Street, My City, DC");

            if (endingAddress != null) {

                endingAddress = endingAddress.replace(' ', '+');

                var e_gmaps_url = "http://maps.google.com/maps/api/geocode/json?address=" + endingAddress + "&sensor=false";

                $.get(e_gmaps_url, function(data){

                    var e_longitude = data.results[0].geometry.location.lng;
                    var e_latitude = data.results[0].geometry.location.lat;
                    viewer.camera.flyTo({
                        destination : Cesium.Cartesian3.fromDegrees(e_longitude, e_latitude, 5000.0)
                    });

                });

            }
        }

        window.resetting = false;

    });

    $('.cesium-geocoder-searchButton').on('click', function(){

        $('#drone-land').addClass('load');

    });

    $('#cesiumContainer .cesium-viewer-geocoderContainer').find('input[type="Search"]').on('keydown', function(e){

        var keycode = e.keyCode;
        if (keycode == 13) {
            $('#drone-land').addClass('load');
        }

    });

    function setCity() {

        var address = prompt("Please enter your address in the following format, or zip code","100 My Street, My City, DC");

        if (address != null) {

            address = address.replace(' ', '+');

            var gmaps_url = "http://maps.google.com/maps/api/geocode/json?address=" + address + "&sensor=false";

            $.get(gmaps_url, function(data){

                var longitude = data.results[0].geometry.location.lng;
                var latitude = data.results[0].geometry.location.lat;
                viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(longitude, latitude, 5000.0)
                });

            });

        }

    }

    function userDefinedFlightTwoPoints() {

        window.userDefinedFlight = false;

        var startingAddress = prompt("Please enter your starting address in the following format, or zip code","100 My Street, My City, DC");

        if (startingAddress != null) {

            startingAddress = startingAddress.replace(' ', '+');

            var s_gmaps_url = "http://maps.google.com/maps/api/geocode/json?address=" + startingAddress + "&sensor=false";

            $.get(s_gmaps_url, function(data){

                var s_longitude = data.results[0].geometry.location.lng;
                var s_latitude = data.results[0].geometry.location.lat;
                viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(s_longitude, s_latitude, 5000.0)
                });

                window.userDefinedFlight = true;

            });

        }

    }

    function setCoordinates() {

        var longitude = prompt("Please enter your longitude", "");

        if (longitude != null) {

            var latitude = prompt("Please enter your latitude", "");

            if (latitude != null) {

                viewer.camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(longitude, latitude, 5000.0)
                });

            }

        }

    }

    function flyToPentagon() {

        viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(-77.0562669, 38.8718568, 5000.0)
        });
    }

    function flyToLocation() {
        // Create callback for browser's geolocation
        function fly(position) {
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 1000.0)
            });
        }

        // Ask browser for location, and fly there.
        navigator.geolocation.getCurrentPosition(fly);
    }

    window.Sandcastle.addToolbarMenu([{
        text : 'Camera Options'
    }, {
        text : 'Set City',
        onselect : function() {
            setCity();
            window.Sandcastle.highlight(setCity);
        }
    }, {
        text : 'Set Coordinates',
        onselect : function() {
            setCoordinates();
            window.Sandcastle.highlight(setCoordinates);
        }
    }, {
        text : 'Fly to Pentagon',
        onselect : function() {
            flyToPentagon();
            window.Sandcastle.highlight(flyToSanDiego);
        }
    }, {
        text : 'Fly to My Location',
        onselect : function() {
            flyToLocation();
            window.Sandcastle.highlight(flyToLocation);
        }
    }, {
        text : 'Define My Own Flight',
        onselect : function() {
            userDefinedFlightTwoPoints();
            window.Sandcastle.highlight(userDefinedFlightTwoPoints);
        }
    }, {
        text : 'Reset View',
        onselect : function() {
            resetCamera();
            window.Sandcastle.highlight(resetCamera);
        }
    }]);

    $('select.sandcastle-button').change(function(){

        var selected = $(this).find('option:selected').text();

        switch (selected) {
            case 'Set City' :
                setCity();
                window.Sandcastle.highlight(setCity);
                break;
            case 'Set Coordinates' :
                setCoordinates();
                window.Sandcastle.highlight(setCoordinates);
                break;
            case 'Fly in a city' :
                flyInACity();
                window.Sandcastle.highlight(flyInACity);
                break;
            case 'Fly to Pentagon' :
                flyToPentagon();
                window.Sandcastle.highlight(flyToPentagon);
                break;
            case 'Fly to My Location' :
                flyToLocation();
                window.Sandcastle.highlight(flyToLocation);
                break;
            case 'Define My Own Flight' :
                userDefinedFlightTwoPoints();
                window.Sandcastle.highlight(userDefinedFlightTwoPoints);
                break;
            case 'Reset View' :
                resetCamera();
                window.Sandcastle.highlight(resetCamera);
                break;
            default:
                cameraEvents();
                window.Sandcastle.highlight(cameraEvents);
        }

        $('#drone-land').addClass('load');

    });

    function resetCamera() {

        window.resetting = true;
        viewer.entities.removeAll();
        scene.primitives.removeAll();
        scene.tweens.removeAll();

        var original_height = 37516478.38948227;
        viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(-77.0562669, 38.8718568, original_height)
        });

    }

  });

}(jQuery));
