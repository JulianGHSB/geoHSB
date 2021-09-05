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
