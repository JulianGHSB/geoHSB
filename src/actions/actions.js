export function reqGetData() {
    return fetch(`http://localhost:4000/`, {
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json',
        },
        method: 'GET',
    })
}
