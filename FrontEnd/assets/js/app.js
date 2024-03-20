import { fetchJSON } from "./api.js";
import { appendCategories, appendWorks, createElement, listCategories } from "./dom.js";
import { closeModal, focusModal, modal, openModal } from "./modal.js";

const token = window.localStorage.getItem("token")
const URL_API_WORKS = 'http://localhost:5678/api/works/'
const URL_API_CATEGORIES = 'http://localhost:5678/api/categories'

function validFileType(file) {
    let fileTypes = ["image/jpeg", "image/pjpeg", "image/png"]
    for (let i = 0; i < fileTypes.length; i++) {
        if (file.type === fileTypes[i]) {
            return true
        }
    }
    return false
}

const updateImageDisplay = function () {
    let preview = document.querySelector(".label-file")
    let curFiles = this.files
    let maxSizeInBytes = 4 * 1024 * 1024 //4mo
    document.querySelector(".file-preview")?.remove()
    document.querySelector(".error")?.remove()

    if (curFiles.length === 0) { //pas de fichier ajouté
        document.querySelector(".file-before-preview").style.display = null
    } else {
        if (validFileType(curFiles[0])) { //si fichier jpg ou png
            if(curFiles[0].size > maxSizeInBytes) { //limite poids fichier dépassé
                this.value = ''
                document.querySelector(".file-before-preview").style.display = null
                const errorDiv = createElement('div', {class : 'error'})
                errorDiv.innerText = "Fichier trop lourd : 4 mo max"
                document.querySelector(".label-file").before(errorDiv)
            } else {
                document.querySelector(".file-before-preview").style.display = 'none'
                let image = createElement('img', {
                    src : window.URL.createObjectURL(curFiles[0]),
                    alt : 'fichier à charger',
                    class : 'file-preview'
                })
                preview.appendChild(image)
            }
        } else {
            this.value = ''     
            document.querySelector(".file-before-preview").style.display = null
            const errorDiv = createElement('div', {class : 'error'})
            errorDiv.innerText = "Format du fichier non valide"
            document.querySelector(".label-file").before(errorDiv)
        }
    }
}

const logout = (e) => {
    e.preventDefault()
    window.localStorage.removeItem("token")
    window.location.href = "index.html"
}

const deleteWork = async function (e) {
    e.preventDefault()
    let confirmation = confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")
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
            })

            document.querySelectorAll(".work-"+idElement).forEach(el => el.remove())

        } catch (error) {
            const errorDiv = createElement('div', {class : 'error'})

            if(error.cause.status === 401)
                errorDiv.innerText = "Vous n'êtes pas autorisé à supprimer"
            
            document.querySelector(".error")?.remove()
            document.querySelector(".modal-title").before(errorDiv)
        }
    }
}

const addWork = async function (e) {
    e.preventDefault()
    document.querySelector(".label-file").style.border = null
    document.querySelector("#work-title").style.border = null
    try {
        const form = document.querySelector('#form-add-work')
        //on récupére les valeurs du formulaire
        const formData = new FormData(form)
        document.querySelector(".success")?.remove()
        document.querySelectorAll(".errorForm").forEach(e => e.remove())
        //gestion des erreurs
        formData.forEach((value, key) => {    
            if(key === 'image' && value.name === '') {
                const errorDiv = createElement('div', {class : 'errorForm'})
                errorDiv.innerText = "Photo obligatoire"
                document.querySelector(".label-file").before(errorDiv)
                document.querySelector(".label-file").style.border = "solid 1px #ff0000"
            }

            if(key === 'title' && value.toString().trim() === '')
            {
                const errorDiv = createElement('div', {class : 'errorForm'})
                errorDiv.innerText = "Titre obligatoire"
                document.querySelector(".label-file").before(errorDiv)
                document.querySelector("input[name='"+key+"']").style.border = "solid 1px #ff0000"
            }
        })

        const addConfirm = await fetchJSON(URL_API_WORKS, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + token 
            },
            body: formData
        })

        let workAdd = [addConfirm]
        appendWorks(workAdd)

        document.querySelector(".success")?.remove()
        const successDiv = createElement('div', {class : 'success'})
        successDiv.innerText = "Nouveau Projet ajouté"
        document.querySelector(".label-file").before(successDiv) 
        form.reset()
        document.querySelector(".file-preview")?.remove()
        document.querySelector(".file-before-preview").style.display = null
        document.querySelectorAll(".delete").forEach(btnDelete => {
            btnDelete.addEventListener("click", deleteWork)
        })

    } catch (error) {
        console.log(error)
    }
}

if(token) //affichage login
{
    //changement login en logout
    document.querySelector('#log').innerText = "logout"
    document.querySelector('#log').setAttribute('class', 'logout')
    document.querySelector('.edition-info').style.display = "block"
    document.querySelector('.btn-edit').style.display = "flex"
    document.querySelector('.gallery-filter').style.visibility = "hidden"
}

//récupération des projets
try {
    const works = await fetchJSON(URL_API_WORKS)

    // récupération des categories dans les projets (id & nom)
    const categoriesTwin  = works.map(work => {
        return {
            id: work.category.id,
            name: work.category.name
        }
    })
    //suppressions des doublons
    let categories = [...new Set(categoriesTwin.map(JSON.stringify))].map(JSON.parse)
    // ajout categorie pour toutes categories
    categories = [...categories, {id: 0, name: "Tous"}]
    //tri par id ordre croissant
    categories.sort((a, b) => a.id - b.id)

    // ajout dans le dom
    appendWorks(works)
    appendCategories(categories)

    // event filtre des travaux 
    const buttonElements = document.querySelectorAll(".btn-filter")
    buttonElements.forEach(element => {
        element.addEventListener("click", function () {
            //pour savoir quel filtre est selectionné
            buttonElements.forEach(btn => { btn.classList.remove('active')})
            this.classList.add('active')
            //on filtre les travaux avec la fonction filter par rapport à id categorie
            let categoryId = parseInt(this.dataset.filter)
            document.querySelector(".gallery").innerHTML = ''
            if(categoryId > 0) {
                const worksFilter = works.filter(work => {
                    return work.categoryId === categoryId
                })
                appendWorks(worksFilter)
            }
            else
                appendWorks(works)
        })
    })

} catch (error) {  
    const errorDiv = createElement('div', {class : 'error'})
    errorDiv.innerText = "Erreur chargement des projets"
    document.querySelector(".gallery").before(errorDiv)
}

// récupération des categories
try {
    const categories = await fetchJSON(URL_API_CATEGORIES)
    listCategories(categories)
} catch (error) {
    const errorDiv = createElement('div', {class : 'error'})
    errorDiv.innerText = "Erreur chargement des catégories"
    document.querySelector("#work-categorie").before(errorDiv)
}

if(token) //event when login
{
    let inputFile = document.querySelector("#input-file")
    let btnDeletes = document.querySelectorAll(".delete")

    //event logout / edit modal / access modal
    document.querySelector('.logout').addEventListener("click", logout)
    document.querySelector('.modal-edit').addEventListener("click", openModal)
    inputFile.addEventListener("change", updateImageDisplay)
    //accessibilite modal
    window.addEventListener('keydown', e => {
        if(e.key === "Escape" || e.key === "Esc") { closeModal(e)}
        if(e.key === "Tab" && modal !== null ) {focusModal(e)}
    })

    //modal page ajout projet
    document.querySelector(".btn-add").addEventListener("click", function () {
        document.querySelector('.gallery-picture').style.display = "none"
        document.querySelector('.gallery-add').style.display = "block"
        document.querySelector('.back-modal').style.visibility = "visible"
    })

    //back modal
    document.querySelector(".back-modal").addEventListener("click", function (e) {
        e.preventDefault()
        document.querySelector('.gallery-picture').style.display = "block"
        document.querySelector('.gallery-add').style.display = "none" 
        document.querySelector('.back-modal').style.visibility = "hidden"
        document.querySelector(".close-modal").focus()
    })

    //event suppression projet
    btnDeletes.forEach(btnDelete => {
        btnDelete.addEventListener("click", deleteWork)
    })

    //event création projet
    document.querySelector('#form-add-work').addEventListener("submit", addWork)

    //access input file
    document.querySelector(".label-file").addEventListener("keydown", function(e){
        if(e.key == "Enter"){
            document.getElementById("input-file").click()
        }
    })
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