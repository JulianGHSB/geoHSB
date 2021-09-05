# H.A.W.A

Hunting Area Warning App is a project providing functionality for hunters and non-hunters to warn them about any conflicts
between natural reserves and their planned hunting trips or for non-hunters, their field trips or day to day routes and 
active hunting areas.

## Installation and first start

First please go to the node.js server project and install it:
https://github.com/JulianGHSB/geoNode

__You need to be on the root folder level of the project.__

Now install all dependencies using:

### `npm install`

Afterwards you need to install a local osrm docker container.

First of all please create a folder named __'data'__ inside the __scripts__ folder of the project.

Use the scripts provided in the scripts folder by:

### `npm run osrm-install`

The docker container should be installed and automatically started.

If not you can start/control the docker container using 

### `npm run osrm-start`
### `npm run osrm-stop`

Now you can start the H.A.W.A app.

### `npm start`

Then you can open [http://localhost:3000](http://localhost:3000)
to view H.A.W.A in the browser in development mode.
