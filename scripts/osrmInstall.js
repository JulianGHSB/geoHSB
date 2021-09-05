const path = require('path');
const fs = require("fs");
const execSync = require('child_process').execSync;
const exec = require('child_process').exec;

const fileName = "tennessee-latest.osm.pbf";
const fileNameOSRM = "tennessee-latest.osrm";
const workingDir = path.join(__dirname, "/data").toString();

runBuild();

async function runBuild() {
    try {
        await execSync('docker run -t -v' + workingDir + ':/data osrm/osrm-backend osrm-extract -p /opt/car.lua /data/'+fileName, {
            stdio: 'inherit',
            shell: true,
            maxBuffer: 1024 * 1024 * 2000
        });

        await execSync('docker run -t -v' + workingDir + ':/data osrm/osrm-backend osrm-partition /data/'+fileNameOSRM, {
            stdio: 'inherit',
            shell: true,
            maxBuffer: 1024 * 1024 * 2000
        });

        await execSync('docker run -t -v' + workingDir + ':/data osrm/osrm-backend osrm-customize /data/'+fileNameOSRM, {
            stdio: 'inherit',
            shell: true,
            maxBuffer: 1024 * 1024 * 2000
        });

        await exec('docker run -d --name osrm-geo -i -p 5000:5000 -v ' + workingDir + ':/data osrm/osrm-backend osrm-routed --algorithm mld /data/'+fileNameOSRM, {
            stdio: 'inherit',
            shell: true,
            detached: true,
            maxBuffer: 1024 * 1024 * 2000
        });

    } catch (err) {
        console.error(err);
    }
}
