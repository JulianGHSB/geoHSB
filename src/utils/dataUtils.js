import _ from 'lodash';

export const getDataFromFileReq = async (rawFile) => {
    let data;
    await fetch(rawFile)
        .then(r => r.text())
        .then(text => {
            const result =  text.split('\n').filter(e =>  e);
            data = result
        });
    return data;
}

export const transformLatLongToLongLatPoint = (geo) => {
        const coords = _.cloneDeep(geo);
       return coords.map((pair) => {
            return [pair.lng, pair.lat]
        })
}

export const isEmpty = (obj) => {
    if (obj === undefined || obj === null) return true;
    if (!Array.isArray(obj) && Object.keys(obj)?.length === 0 ) return true;
    return obj?.length === 0;
}

export const getCenterOfCoordinates = (coords) => {
    if (isEmpty(coords)) return null;

    const length = coords.length;

    let X = 0.0;
    let Y = 0.0;
    let Z = 0.0;

    for ( let i = 0; i < length; i++) {
        let lat = coords[i][0] * Math.PI / 180;
        let lon = coords[i][1] * Math.PI / 180;

        let a = Math.cos(lat) * Math.cos(lon);
        let b = Math.cos(lat) * Math.sin(lon);
        let c = Math.sin(lat);

        X += a;
        Y += b;
        Z += c;
    }

    X /= length;
    Y /= length;
    Z /= length;

    let lon = Math.atan2(Y, X);
    let hyp = Math.sqrt(X * X + Y *Y);
    let lat = Math.atan2(Z, hyp);

    let centerX = (lat * 180 / Math.PI);
    let centerY = (lon * 180 / Math.PI)

    return [centerY, centerX];
}
