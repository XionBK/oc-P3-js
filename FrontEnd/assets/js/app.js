import { fetchJSON } from "./api.js";
import { appendCategories, appendWorks, createElement } from "./dom.js";

const token = window.localStorage.getItem("token");

if(token)
{
    //changement login en logout
    document.querySelector('#log').innerText = "logout"
    document.querySelector('#log').setAttribute('class', 'logout')
    //event deconnexion
    document.querySelector('.logout').addEventListener("click", function (e) { 
        e.preventDefault()
        window.localStorage.removeItem("token");
        window.location.href = "index.html";
    });

    document.querySelector('.edition-info').style.display = "block";
    document.querySelector('.btn-edit').style.display = "flex";
    document.querySelector('.gallery-filter').style.visibility = "hidden"
}

try {
    const works = await fetchJSON('http://localhost:5678/api/works')
    //console.log(works)
    
    // récupération des categories dans les projets (id & nom)
    const categoriesTwin  = works.map(work => {
        return {
            id: work.category.id,
            name: work.category.name
        };
    });

    const setArray = new Set();
    let categories = [];
    // ajout des categories dans un Array sans les doublons
    categoriesTwin.forEach(categorie => {
        if (!setArray.has(categorie.id)) {
            categories.push(categorie);
            setArray.add(categorie.id);
        }
    });
    // ajout une categorie pour tous les travaux
    let allCategorie = {id: 0, name: "Tous"};
    categories.unshift(allCategorie);

    // ajout dans le dom
    appendWorks(works)
    appendCategories(categories)

    // event filtre des travaux 
    const buttonElements = document.querySelectorAll(".btn-filter");
    buttonElements.forEach(element => {
        element.addEventListener("click", function () {
            //pour savoir quel filtre est selectionné
            buttonElements.forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            //on filtre les travaux avec la fonction filter par rapport à id categorie
            let categoryId = parseInt(this.dataset.filter)
            if(categoryId > 0) {
                const worksFilter = works.filter(work => {
                    return work.categoryId === categoryId;
                });
                appendWorks(worksFilter)
            }
            else
                appendWorks(works)
        });
    });

} catch (error) {  
    const errorDiv = createElement('div', {class : 'error'})
    errorDiv.innerText = "Erreur chargement des projets"
    document.querySelector(".gallery").before(errorDiv)
}


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


/*
2eme solution récupération des catégories avec API
try {
    const categories = await fetchJSON('http://localhost:5678/api/categories')
    console.log(categories)
    let allCategorie = {
        "id": 0,
        "name": "Tous"
    };
    categories.unshift(allCategorie);
    appendCategories(categories)

} catch (error) {
    const errorDiv = createElement('div', {class : 'error'})
    errorDiv.innerText = "Erreur chargement des catégories"
    document.querySelector(".gallery-filter").before(errorDiv)
}*/