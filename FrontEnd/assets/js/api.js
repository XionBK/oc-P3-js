/**
 * Connexion Api avec fetch
 * @param {URL} url 
 * @param {Object} options 
 * @returns
 */
export async function fetchJSON (url, options = {}) {
    const headers = {Accept: 'application/json', ...options.headers}
    const r = await fetch(url, {...options, headers})
    if(r.ok === true) {
        if(options.method === 'DELETE')
            return r.status;
        else
            return r.json();
    }
    throw new Error('Erreur contact serveur', {cause: r})
}