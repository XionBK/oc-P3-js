export let modal = null
let elementInModal = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'

export const openModal = (e) => {
    e.preventDefault()
    modal = document.querySelector('#modal')
    //affichage
    modal.style.display = null
    modal.setAttribute('aria-hidden', false)
    modal.setAttribute('aria-modal', true)
    //focus modal
    let focusableElement = modal.querySelectorAll(elementInModal);
    focusableElement[0].focus()
    //event
    modal.addEventListener("click", closeModal)
    modal.querySelector('.close-modal').addEventListener("click", closeModal)
    modal.querySelector('.modal-contain').addEventListener("click", stopPropagation)
}

export const closeModal = function (e) {
    if(modal === null) return

    e.preventDefault()
    //affichage
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', true)
    modal.setAttribute('aria-modal', false)
    //remove event
    modal.removeEventListener("click", closeModal)
    modal.querySelector('.close-modal').removeEventListener("click", closeModal)
    modal.querySelector('.modal-contain').removeEventListener("click", stopPropagation)
    modal = null
}

const stopPropagation = function (e) {
    e.stopPropagation()
}

export const focusModal = (e) => {
    let focusableElement = modal.querySelectorAll(elementInModal);
    let firstFocusableElement = focusableElement[0];
    let lastFocusableElement = focusableElement[focusableElement.length - 1];

    if (e.shiftKey) { //shift+tab retour arriere
        if (document.activeElement === firstFocusableElement) {
            lastFocusableElement.focus();
            e.preventDefault();
        }
    } else { //tab
        if (document.activeElement === lastFocusableElement) {
            firstFocusableElement.focus(); 
            e.preventDefault();
        }
    }
}