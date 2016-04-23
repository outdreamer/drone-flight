(function($) {

$(document).on('ready', function(){

var viewer = new Cesium.Viewer('cesiumContainer');
var scene = viewer.scene;
var clock = viewer.clock;

function setCoordinates() {

    var longitude = prompt("Please enter your longitude", "");

    if (longitude != null) {

        var latitude = prompt("Please enter your latitude", "");

        if (latitude != null) {

            window.Sandcastle.declare(setCoordinates);
            viewer.camera.flyTo({
                destination : Cesium.Cartesian3.fromDegrees(longitude, latitude, 15000.0)
            });

        }

    }

}

function flyToPentagon() {

    window.Sandcastle.declare(flyToPentagon);
    viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(-77.0562669, 38.8718568, 15000.0)
    });
}

function flyToHeadingPitchRoll() {
    window.Sandcastle.declare(flyToHeadingPitchRoll);
    viewer.camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(-122.22, 46.12, 5000.0),
        orientation : {
            heading : Cesium.Math.toRadians(20.0),
            pitch : Cesium.Math.toRadians(-35.0),
            roll : 0.0
        }
    });
}

function flyToLocation() {
    window.Sandcastle.declare(flyToLocation);

    // Create callback for browser's geolocation
    function fly(position) {
        viewer.camera.flyTo({
            destination : Cesium.Cartesian3.fromDegrees(position.coords.longitude, position.coords.latitude, 1000.0)
        });
    }

    // Ask browser for location, and fly there.
    navigator.geolocation.getCurrentPosition(fly);
}

function viewRectangle() {
    window.Sandcastle.declare(viewRectangle);

    var west = -77.0;
    var south = 38.0;
    var east = -72.0;
    var north = 42.0;

    var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);
    viewer.camera.setView({
        destination: rectangle
    });

    // Show the rectangle.  Not required; just for show.
    viewer.entities.add({
        rectangle : {
            coordinates : rectangle,
            fill : false,
            outline : true,
            outlineColor : Cesium.Color.WHITE
        }
    });
}

function flyToRectangle() {
    window.Sandcastle.declare(flyToRectangle);

    var west = -90.0;
    var south = 38.0;
    var east = -87.0;
    var north = 40.0;
    var rectangle = Cesium.Rectangle.fromDegrees(west, south, east, north);

    viewer.camera.flyTo({
        destination : rectangle
    });

    // Show the rectangle.  Not required; just for show.
    viewer.entities.add({
        rectangle : {
            coordinates : rectangle,
            fill : false,
            outline : true,
            outlineColor : Cesium.Color.WHITE
        }
    });
}

function setReferenceFrame() {
    window.Sandcastle.declare(setReferenceFrame);

    var center = Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883);
    var transform = Cesium.Transforms.eastNorthUpToFixedFrame(center);

    // View in east-north-up frame
    var camera = viewer.camera;
    camera.constrainedAxis = Cesium.Cartesian3.UNIT_Z;
    camera.lookAtTransform(transform, new Cesium.Cartesian3(-120000.0, -120000.0, 120000.0));

    // Show reference frame.  Not required.
    scene.primitives.add(new Cesium.DebugModelMatrixPrimitive({
        modelMatrix : transform,
        length : 100000.0
    }));
}

function setHeadingPitchRoll() {
    window.Sandcastle.declare(setHeadingPitchRoll);
    
    var camera = viewer.camera;
    camera.setView({
        destination : Cesium.Cartesian3.fromDegrees(-75.5847, 40.0397, 1000.0),
        orientation: {
            heading : -Cesium.Math.PI_OVER_TWO,
            pitch : -Cesium.Math.PI_OVER_FOUR,
            roll : 0.0
        }
    });
}

function icrf(scene, time) {
    if (scene.mode !== Cesium.SceneMode.SCENE3D) {
        return;
    }

    var icrfToFixed = Cesium.Transforms.computeIcrfToFixedMatrix(time);
    if (Cesium.defined(icrfToFixed)) {
        var camera = viewer.camera;
        var offset = Cesium.Cartesian3.clone(camera.position);
        var transform = Cesium.Matrix4.fromRotationTranslation(icrfToFixed);
        camera.lookAtTransform(transform, offset);
    }
}

function viewInICRF() {
    window.Sandcastle.declare(viewInICRF);

    viewer.camera.flyHome(0);
    
    clock.multiplier = 3 * 60 * 60;
    scene.preRender.addEventListener(icrf);
    scene.globe.enableLighting = true;
}

var viewChanged = document.getElementById('viewChanged');

var removeStart;
var removeEnd;

function cameraEvents() {
    window.Sandcastle.declare(cameraEvents);
    
    var camera = viewer.camera;
    removeStart = camera.moveStart.addEventListener(function() {
        viewChanged.style.display = 'block';
    });
    removeEnd = camera.moveEnd.addEventListener(function() {
        viewChanged.style.display = 'none';
    });
}

function flyInACity() {
    window.Sandcastle.declare(flyInACity);
    
    var camera = scene.camera;
    camera.flyTo({
        destination : Cesium.Cartesian3.fromDegrees(-73.98580932617188, 40.74843406689482, 363.34038727246224),
        complete : function() {
            setTimeout(function() {
                camera.flyTo({
                    destination : Cesium.Cartesian3.fromDegrees(-73.98585975679403, 40.75759944127251, 186.50838555841779),
                    orientation : {
                        heading : Cesium.Math.toRadians(200.0),
                        pitch : Cesium.Math.toRadians(-50.0)
                    },
                    easingFunction : Cesium.EasingFunction.LINEAR_NONE
                });
            }, 1000);
        }
    });
}

window.Sandcastle.addToolbarMenu([{
    text : 'Camera Options'
}, {
    text : 'Set Coordinates',
    onselect : function() {
        setCoordinates();
        window.Sandcastle.highlight(setCoordinates);
    }
}, {
    text : 'Fly in a city',
    onselect : function() {
        flyInACity();
        window.Sandcastle.highlight(flyInACity);
    }
}, {
    text : 'Fly to Pentagon',
    onselect : function() {
        flyToPentagon();
        window.Sandcastle.highlight(flyToSanDiego);
    }
}, {
    text : 'Fly to Location with heading, pitch and roll',
    onselect : function() {
        flyToHeadingPitchRoll();
        window.Sandcastle.highlight(flyToHeadingPitchRoll);
    }
}, {
    text : 'Fly to My Location',
    onselect : function() {
        flyToLocation();
        window.Sandcastle.highlight(flyToLocation);
    }
}, {
    text : 'Fly to Rectangle',
    onselect : function() {
        flyToRectangle();
        window.Sandcastle.highlight(flyToRectangle);
    }
}, {
    text : 'View a Rectangle',
    onselect : function() {
        viewRectangle();
        window.Sandcastle.highlight(viewRectangle);
    }
}, {
    text : 'Set camera reference frame',
    onselect : function() {
        setReferenceFrame();
        window.Sandcastle.highlight(setReferenceFrame);
    }
}, {
    text : 'Set camera with heading, pitch, and roll',
    onselect : function() {
        setHeadingPitchRoll();
        window.Sandcastle.highlight(setHeadingPitchRoll);
    }
},{
    text : 'View in ICRF',
    onselect : function() {
        viewInICRF();
        window.Sandcastle.highlight(viewInICRF);
    }
}, {
    text : 'Move events',
    onselect : function() {
        cameraEvents();
        window.Sandcastle.highlight(cameraEvents);
    }
}]);

$('select.sandcastle-button').change(function(){

    var selected = $(this).find('option:selected').text();

    switch (selected) { 

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
        case 'Fly to Location with heading, pitch and roll' :
            flyToHeadingPitchRoll();
            window.Sandcastle.highlight(flyToHeadingPitchRoll);
            break;
        case 'Fly to My Location' :
            flyToLocation();
            window.Sandcastle.highlight(flyToLocation);
            break;
        case 'Fly to Rectangle' :
            flyToRectangle();
            window.Sandcastle.highlight(flyToRectangle);
            break;
        case 'View a Rectangle' :
            viewRectangle();
            window.Sandcastle.highlight(viewRectangle);
            break;
        case 'Set camera reference frame' :
            setReferenceFrame();
            window.Sandcastle.highlight(setReferenceFrame);
            break;
        case 'Set camera with heading, pitch, and roll' :
            setHeadingPitchRoll();
            window.Sandcastle.highlight(setHeadingPitchRoll);
            break;
        case 'View in ICRF' :
            viewInICRF();
            window.Sandcastle.highlight(viewInICRF);
            break;
        case 'Move events' :
            cameraEvents();
            window.Sandcastle.highlight(cameraEvents);
            break;
        default: 
            console.log('no option');
    }

});

window.Sandcastle.reset = function() {
    viewer.entities.removeAll();
    scene.primitives.removeAll();
    scene.tweens.removeAll();

    if (Cesium.defined(removeStart)) {
        removeStart();
        removeEnd();

        viewChanged.style.display = 'none';
        
        removeStart = undefined;
        removeEnd = undefined;
    }
    
    viewer.camera.lookAtTransform(Cesium.Matrix4.IDENTITY);

    clock.multiplier = 1.0;
    scene.preRender.removeEventListener(icrf);
    scene.globe.enableLighting = false;
};

scene.morphComplete.addEventListener(function() {
    window.Sandcastle.reset();
});

});

}(jQuery));
