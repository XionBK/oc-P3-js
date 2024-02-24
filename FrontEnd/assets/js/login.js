import { fetchJSON } from "./api.js"
import { createElement } from "./dom.js";

const infoLogin = {}
const form = document.querySelector('#form-login')

form.addEventListener("submit", async function (e) {
    try {
        e.preventDefault()
        //on récupére les valeurs du formulaire
        const formData = new FormData(form)
        formData.forEach((value, key) => {
            infoLogin[key] = value.toString().trim();
        });
        //envoi des login
        const logVal = await fetchJSON("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(infoLogin)
        });
        //connexion réussi sauvegarde du token
        window.localStorage.setItem("token", logVal.token);
        window.location.href = "index.html";  
    } catch (error) {
        const errorDiv = createElement('div', {class : 'error'})

        if(error.cause.status === 404)
            errorDiv.innerText = "Erreur dans l'identifiant ou le mot de passe"

        if(error.cause.status === 401)
            errorDiv.innerText = "Erreur mot de passe"
        
        document.querySelector(".error")?.remove()
        document.querySelector("#form-login").before(errorDiv)
    }
});