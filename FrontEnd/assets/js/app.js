import { fetchJSON } from "./api.js";
import { createElement } from "./dom.js";

const divGallery = document.querySelector(".gallery")

try {
    const works = await fetchJSON('http://localhost:5678/api/works')
    console.log(works)
    for (let i = 0; i < works.length; i++) {
        const figureElement = createElement('figure')
        const figcaptionElement = createElement('figcaption')
        const imgElement = createElement('img', {
            src : works[i].imageUrl,
            alt : works[i].title
        })
        
        figcaptionElement.innerText = works[i].title
        figureElement.append(imgElement,figcaptionElement)
        divGallery.appendChild(figureElement)
    }

} catch (error) {  
    const errorDiv = createElement('div', {
        class : 'error'
    })
    errorDiv.innerText = "Erreur chargement des projets"
    divGallery.before(errorDiv)
}

//const noms = works.map(work => work.title);

/*{
    "id": 2,
    "title": "Appartement Paris V",
    "imageUrl": "http://localhost:5678/images/appartement-paris-v1651287270508.png",
    "categoryId": 2,
    "userId": 1,
    "category": {
      "id": 2,
      "name": "Appartements"
    }
  },*/