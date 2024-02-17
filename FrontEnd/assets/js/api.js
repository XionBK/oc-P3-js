
export async function fetchJSON (url, options = {}) {
    const headers = {Accept: 'application/json', ...options.headers}
    const r = await fetch(url, {...options, headers})
    if(r.ok === true) {
        return r.json();
    }
    throw new Error('Erreur contact serveur', {cause: r})
}