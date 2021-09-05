const http = require('http');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;

const fileName = "tennessee-latest.osm.pbf";
const fileNameOSRM = "tennessee-latest.osrm";
const url = "http://download.geofabrik.de/north-america/us/tennessee-latest.osm.pbf";
const workingDir = path.join(__dirname, "/data").toString();

if (!fs.existsSync(workingDir)) {
    fs.mkdirSync("./data");
}

if (!fs.existsSync(path.join(workingDir, fileName))) {
    const file = fs.createWriteStream(path.join(workingDir, fileName));
    console.log("Downloading: "+url);
    const request =  http.get(url, async function (response) {
        await response.pipe(file);
        console.log("Download successful");
    });
}
