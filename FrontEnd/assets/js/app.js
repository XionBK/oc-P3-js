import { fetchJSON } from "./api.js";
import { createElement } from "./dom.js";

try {
    const works = await fetchJSON('http://localhost:5678/api/works')
    console.log(works)
} catch (error) {
    
    const errorDiv = createElement('div', {
        class : 'error'
    })
    errorDiv.innerText = "Erreur chargement des projets"
    document.querySelector(".gallery").before(errorDiv)
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