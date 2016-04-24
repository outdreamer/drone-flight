<p align="center">
<a href="http://cesiumjs.org/">
<img src="https://github.com/AnalyticalGraphicsInc/cesium/wiki/logos/Cesium_Logo_Color.jpg" width="50%" />
</a>
</p>

Drone Flight is a prototyping tool built with Cesium that helps you prototype flight simulations based on a user-defined city or coordinate pair.

It's based on Cesium, which provides the map, along with a Cesium Starter App provided here:

https://github.com/pjcozzi/cesium-starter-app

I've defined two custom events: 

	- Set City, which takes input of a street address & city.
	- Set Coordinates, which takes input of latitude & longitude coordinates.

To define your own custom events:

	- index.html:
		Uncomment the #toolbar display property in index.html and position the toolbar according to your needs.

	- App.js:
		- define your custom function in App.js (see function example: setCity() )
		- add an entry in the call to window.Sandcastle.addToolbarMenu() to set your new menu item for the dropdown
		- add an entry in the $('select.sandcastle-button').change() event function
		- modify the airport_data parameter and object navigation to fetch different data than the airport data

	- For ideas on custom events, see the Camera workshop here:
		https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=Camera.html&label=Showcases

To use the existing prototype:
	- Click the search icon and enter an address, or if you've displayed the #toolbar div, select an action defined in App.js

Local server
------------

A local HTTP server is required to run the app.

* Install [node.js](http://nodejs.org/)
* From the `cesium-starter-app` root directory, run
   * `npm install` (This step is only necessary if node_modules is not included)
   * `node server.js`

Browse to `http://localhost:8000/`

What's here?
------------

* [index.html](index.html) - A simple HTML page based on Cesium's Hello World example.  Run a local web server, and browse to index.html to run your app, which will show a 3D globe.
* [Source](Source/) - Contains [App.js](Source/App.js) which is referenced from index.html.  This is where your app's code goes.
* [ThirdParty](ThirdParty/) - A directory for third-party libraries, which initially includes just Cesium.  See the **Updating Cesium** section for how to use the latest version from the Cesium repo.
* [server.js](server.js) - A simple node.js server for serving your Cesium app.  See the **Local server** section.
* [package.json](package.json) - Dependencies for the node.js server.
* [LICENSE.md](LICENSE.md) - A license file already referencing Cesium as a third-party.  This starter app is licensed with [Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0.html) (free for commercial and non-commercial use).  You can, of course, license your code however you want.
* [.project](.project) - An [Eclipse](http://www.eclipse.org/downloads/) project with [JSHint](http://www.jshint.com/) enabled.
* [.settings](.settings/) - Directory with settings for the Eclipse project.
* [.gitignore](.gitignore) - A small list of files not to include in the git repo.  Add to this as needed.
