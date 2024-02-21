/**
 * on simplifie le create element 
 * avec en option un attribut
 * @param {string} tagName 
 * @param {object} attributes 
 * @returns {HTMLElement}
 */

export function createElement(tagName, attributes = {}) {
    const element = document.createElement(tagName)
    for (const [attribute, value] of Object.entries(attributes)) {
        element.setAttribute(attribute, value)
    }
    return element
}

/**
 * Création du dom des projets
 * @param {JSON} works 
 */

export function appendWorks(works) {
    document.querySelector(".gallery").innerHTML = ''
    for (let i = 0; i < works.length; i++) {
        const figureElement = createElement('figure')
        const figcaptionElement = createElement('figcaption')
        const imgElement = createElement('img', {
            src : works[i].imageUrl,
            alt : works[i].title
        }) 
        figcaptionElement.innerText = works[i].title
        figureElement.append(imgElement,figcaptionElement)
        document.querySelector(".gallery").appendChild(figureElement)
    }
}

/**
 * Création des boutons filtres catégories
 * @param {JSON} categories 
 */

export function appendCategories(categories) {
    for (let i = 0; i < categories.length; i++) {
        let classElement = (categories[i].id) ? "btn-filter" : "btn-filter active";
        const buttonElement = createElement('button', {
            class : classElement,
            'data-filter' : categories[i].id
        })
        buttonElement.innerText = categories[i].name
        document.querySelector(".gallery-filter").appendChild(buttonElement)
    }
}