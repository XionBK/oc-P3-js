import { fetchJSON } from "./api.js";
import { appendCategories, appendWorks, createElement } from "./dom.js";
import { closeModal, focusModal, modal, openModal } from "./modal.js";

const token = window.localStorage.getItem("token");
const URL_API_WORKS = 'http://localhost:5678/api/works/'

const logout = (e) => {
    e.preventDefault()
    window.localStorage.removeItem("token");
    window.location.href = "index.html";
}

const deleteWork = async function (e) {
    e.preventDefault()
    let confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?");
    if(confirmation)
    {
        try {   
            let idElement = parseInt(this.dataset.id)
            const deleteConfirm = await fetchJSON(URL_API_WORKS + idElement, {
                method: 'DELETE',
                headers: { 
                    "Content-Type": "application/json",
                    'Authorization': 'Bearer ' + token
                }
            });
            console.log(deleteConfirm)
            document.querySelectorAll(".work-"+idElement).forEach(el => el.remove());

        } catch (error) {
            const errorDiv = createElement('div', {class : 'error'})

            if(error.cause.status === 401)
                errorDiv.innerText = "Vous n'êtes pas autorisé à supprimer"
            
            document.querySelector(".error")?.remove()
            document.querySelector(".modal-title").before(errorDiv)
        }
    }
}

if(token)
{
    //changement login en logout
    document.querySelector('#log').innerText = "logout"
    document.querySelector('#log').setAttribute('class', 'logout')
    document.querySelector('.edition-info').style.display = "block";
    document.querySelector('.btn-edit').style.display = "flex";
    document.querySelector('.gallery-filter').style.visibility = "hidden"

    //event logout / edit modal / access modal
    document.querySelector('.logout').addEventListener("click", logout);
    document.querySelector('.modal-edit').addEventListener("click", openModal);
    window.addEventListener('keydown', e => {
        if(e.key === "Escape" || e.key === "Esc") {
            closeModal(e)
        }
    
        if(e.key === "Tab" && modal !== null ) {
            focusModal(e)
        }
    })
}

try {
    const works = await fetchJSON(URL_API_WORKS)
    //console.log(works)
    
    // récupération des categories dans les projets (id & nom)
    const categoriesTwin  = works.map(work => {
        return {
            id: work.category.id,
            name: work.category.name
        };
    });
    //suppressions des doublons
    let categories = [...new Set(categoriesTwin.map(JSON.stringify))].map(JSON.parse);
    categories.sort((a, b) => a.id - b.id);

    // ajout une categorie pour tous les travaux
    let allCategorie = {id: 0, name: "Tous"};
    categories.unshift(allCategorie);

    // ajout dans le dom
    appendWorks(works)
    appendCategories(categories)

    //event delete
    const btnDeletes = document.querySelectorAll(".delete");
    btnDeletes.forEach(btnDelete => {
        btnDelete.addEventListener("click", deleteWork);
    });

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