const BASE_URL = "http://localhost:3000/"


// All main pages
const splashMain = document.querySelector('.splash-main')
const loginMain = document.querySelector('.login-main')
const signupMain = document.querySelector('.signup-main')
const userMain = document.querySelector('.user-main')
const userView = document.querySelector('.user-view')

const flatironFinder = document.querySelector('header h1')

flatironFinder.addEventListener('click', event => {
    splashMain.classList.remove('hidden')

    signupMain.classList.remove('hidden')
    signupMain.classList.add('hidden')
    loginMain.classList.remove('hidden')
    loginMain.classList.add('hidden')
})

// Log In
const $loginButton = document.querySelector('#log-in')

$loginButton.addEventListener('click', event => {
    loginMain.classList.remove('hidden')
    signupMain.classList.remove('hidden')
    signupMain.classList.add('hidden')
    splashMain.classList.remove('hidden')
    splashMain.classList.add('hidden')
})

// Sign Up
const $signupButton = document.querySelector('#sign-up')

$signupButton.addEventListener('click', event => {
    signupMain.classList.remove('hidden')
    loginMain.classList.remove('hidden')
    loginMain.classList.add('hidden')
    splashMain.classList.remove('hidden')
    splashMain.classList.add('hidden')
})



// ADD LANGUAGE TO SIGNUP PAGE 
const $addLanguageBtn = document.querySelector('#add-language')

$addLanguageBtn.addEventListener('click', event => {
    event.preventDefault()

    addToKnownLanguages(document.querySelector('#language').value)

    document.querySelector('#language').value = ""
})

function addToKnownLanguages(language) {
    const $signupList = document.querySelector('#known-languages')
    const $span = document.createElement('span')

    $span.className = "language-block"
    $span.innerHTML = `
        ${language} <ion-icon name="close-circle-outline"></ion-icon>
    `
    $span.querySelector('ion-icon').addEventListener("click", event =>{
        event.target.parentNode.remove()
    })

    $signupList.appendChild($span)
}