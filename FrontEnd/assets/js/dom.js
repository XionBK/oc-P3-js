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
 * en général et édition
 * @param {Array} works 
 */

export function appendWorks(works) {

    for (let i = 0; i < works.length; i++) {
        const figureElement = createElement('figure', { 
            class : 'work-'+works[i].id
        })
        const imgElement = createElement('img', {
            src : works[i].imageUrl,
            alt : works[i].title
        }) 
        figureElement.append(imgElement)
        const worksDom = figureElement.cloneNode(true);
        const worksEditDom = figureElement.cloneNode(true);

        const figcaptionElement = createElement('figcaption')
        figcaptionElement.innerText = works[i].title

        const hrefDelete = createElement('a', { 
            href : '#', 
            class : 'delete', 
            'data-id' : works[i].id
        })
        const imgDelete = createElement('img', { 
            src : './assets/icons/delete.png', 
            alt : 'delete'
        })
            
        hrefDelete.append(imgDelete)
        worksEditDom.append(hrefDelete)
        worksDom.append(figcaptionElement)

        document.querySelector(".gallery").appendChild(worksDom)
        document.querySelector(".gallery-edit").appendChild(worksEditDom)
    }

}

/**
 * Création des boutons filtres catégories
 * @param {Array} categories 
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

/**
 * Récupération des categories
 * et ajout dans <select>
 * @param {Array} categories 
 */
export function listCategories(categories) {
    for (let i = 0; i < categories.length; i++) {
        const option = createElement('option', {
            value : categories[i].id
        })
        option.innerText = categories[i].name
        document.querySelector("#work-categorie").appendChild(option)
    }
}