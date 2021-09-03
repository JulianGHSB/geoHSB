const path = require('path');
const exec = require('child_process').exec;

const workingDir = path.join(__dirname, "/data").toString();
const fileNameOSRM = "tennessee-latest.osrm";

run();

async function run() {
    try {
        exec('docker stop osrm-geo', {
            stdio: 'inherit',
            shell: true,
            detached: true,
            maxBuffer: 1024 * 1024 * 2000
        });

    } catch (err) {
        console.error(err);
    }
}
