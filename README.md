<p align="center">
<a href="http://cesiumjs.org/">
<img src="https://github.com/AnalyticalGraphicsInc/cesium/wiki/logos/Cesium_Logo_Color.jpg" width="50%" />
</a>
</p>

Drone Flight lets you simulate flights based on a user-defined city or coordinate pair.

It's based on Cesium, which provides the map, along with a Cesium Starter App provided here:

https://github.com/pjcozzi/cesium-starter-app

I've defined two custom events so far: Set City and Set Coordinates.

Local server
------------

A local HTTP server is required to run the app.

* Install [node.js](http://nodejs.org/)
* From the `cesium-starter-app` root directory, run
   * `npm install`
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
