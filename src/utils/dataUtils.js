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
