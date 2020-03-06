const BASE_URL = "http://localhost:3000/"


// All main pages
const splashMain = document.querySelector('.splash-main')
const loginMain = document.querySelector('.login-main')
const signupMain = document.querySelector('.signup-main')
const userMain = document.querySelector('.user-main')
const userView = document.querySelector('.user-view')

const flatironFinder = document.querySelector('header h1')

flatironFinder.addEventListener('click', function homelink() {
    if (!localStorage.getItem('token')) {
        splashMain.classList.remove('hidden')
        hide(signupMain)
        hide(loginMain)
    }
})

function hide(element) {
    element.classList.remove('hidden')
    element.classList.add('hidden')
}

// Log In
const $loginButton = document.querySelector('#log-in')

$loginButton.addEventListener('click', event => {
    loadUsers()
    loginMain.classList.remove('hidden')
    hide(signupMain)
    hide(splashMain)
})

const $loginSignup = document.querySelector('.login-signup')
const $greeting = document.querySelector('.greeting')

const $loginForm = document.querySelector('#login-form')

$loginForm.addEventListener('submit', event => {
    event.preventDefault()

    const formData = new FormData(event.target)

    const user = {
        username: formData.get('username'),
        password: formData.get('password')
    }

    fetch(`${BASE_URL}login`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    }).then(response => response.json())
    .then(response => localStorage.setItem('token', `bearer ${response.token}`))
    .then(response => {
        hide(loginMain)
        hide($loginSignup)
        userMain.classList.remove('hidden')
        $greeting.classList.remove('hidden')
        $greeting.textContent = `Hi, ${user.username}`
    })
})

// Sign Up
const $signupButton = document.querySelector('#sign-up')

$signupButton.addEventListener('click', event => {
    signupMain.classList.remove('hidden')
    hide(loginMain)
    hide(splashMain)
})

const $signupForm = document.querySelector('#signup-form')

// Generate Options for Technologies
const $datalistOptions = document.querySelector('#language-list')

fetch(`${BASE_URL}technologies`)
    .then(response => response.json())
    .then(response => addTechnologyOptions(response))

function addTechnologyOptions(technologies) {
    listTechnology(technologies['frameworks'], 'frameworks')
    listTechnology(technologies['languages'], 'languages')
}

function listTechnology(technologies, technology) {
    technologies.map( tech => {
        const option = document.createElement('option')

        option.setAttribute('tech_id', tech.id)
        option.setAttribute('tech', technology)
        if (technology==="frameworks") {
            option.setAttribute('lang-id', tech.language_id)
        }
        option.innerText = tech.name

        $datalistOptions.appendChild(option)
    })
}

// Sign Up Form Submission

$signupForm.addEventListener('submit', event => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const user = {}
    user['username'] = formData.get('username')
    user['password'] = formData.get('password')
    user['name'] = formData.get('name')
    user['email'] = formData.get('email')
    user['campus'] = formData.get('campus')
    if (formData.get('cohort')) user['cohort'] = formData.get('cohort')
    if (formData.get('github')) user['github'] = formData.get('github')
    if (formData.get('linkedin')) user['linkedin'] = formData.get('linkedin')
    if (formData.get('blog')) user['blog'] = formData.get('blog')
    const languages = getLanguages()
    const frameworks = getFrameworks()

    document.querySelector('#known-languages').innerHTML = ""
    fetch(`${BASE_URL}users`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user: user, languages: languages, frameworks: frameworks})
    }).then(response => response.json())
    .then(response => {
        hide(signupMain)
        loginMain.classList.remove('hidden')
        alert("Your registration was successful!")
        event.target.reset()
        return response
    })
    .catch(alert(response))
})

function getLanguages() {
    const langList = document.querySelectorAll('.language-block')
    const languageIDs = []
    langList.forEach(element => {
        if (element.getAttribute('tech') === 'languages') {
            languageIDs.push(element.getAttribute('tech_id'))
        }
    })
    return languageIDs
}

function getFrameworks() {
    const frameList = document.querySelectorAll('.language-block')
    const frameworkIDs = []
    frameList.forEach(element => {
        if (element.getAttribute('tech') === 'frameworks') {
            frameworkIDs.push(element.getAttribute('tech_id'))
        }
    })
    return frameworkIDs
}

// ADD LANGUAGE TO SIGNUP PAGE 
const $addLanguageBtn = document.querySelector('#add-language')

$addLanguageBtn.addEventListener('click', event => {
    event.preventDefault()

    addToKnownLanguages(document.querySelector('#language').value)

    document.querySelector('#language').value = ""
})

function addToKnownLanguages(technology) {
    const $options = document.querySelectorAll('datalist option')
    
    let $option
    $options.forEach(option => {
        if (option.innerText === technology){
            $option = option
        }
    })
    document.getElementById('pop-up').classList.remove('hidden')
    document.getElementById('pop-up').classList.add('hidden')
    language_ids = getLanguages()

    const $signupList = document.querySelector('#known-languages')
    const $span = document.createElement('span')

    switch ($option.getAttribute('tech')) {
        case 'languages':
            appendSpanWithMetaData($span, $option, $signupList)
            break
        case 'frameworks':
            if (language_ids.includes($option.getAttribute('lang-id'))) {
                $span.setAttribute('lang-id', $option.getAttribute('lang-id'))
                appendSpanWithMetaData($span, $option, $signupList)
            } else {
                fetch(`${BASE_URL}languages/${$option.getAttribute('lang-id')}`)
                    .then(response => response.json())
                    .then(response => {
                    document.getElementById('pop-up').innerText = `You need to add ${response.name} first!`
                    document.getElementById('pop-up').classList.remove('hidden')
                    })
            } break
    }

}

function appendSpanWithMetaData(span, option, signupList) {
    span.className = "language-block"
    span.setAttribute('tech_id', option.getAttribute('tech_id'))
    span.setAttribute('tech', option.getAttribute('tech'))
    span.innerHTML = `
    ${option.innerText.trim()} <ion-icon name="close-circle-outline"></ion-icon>
    `
    span.querySelector('ion-icon').addEventListener("click", event =>{
        event.target.parentNode.remove()
    })
    signupList.appendChild(span)
}

/* USER MAIN *****/

function loadUsers() {
    fetch(`${BASE_URL}users`)
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                const $card = document.createElement('div')
                $card.classList.add('card')

                $card.innerHTML = `
                    <div class="profile-image">
                        <img class="profile-picture" src="https://www.pngitem.com/pimgs/m/111-1114658_person-png-outline-outline-of-person-face-transparent.png">
                    </div>
                    <div class="profile-info">
                        <h4>${user.name}</h4>
                        <h5>${user.campus}</h5>
                    </div>
                    <div class="icon-links">
                        <a href="mailto:${user.email}"><ion-icon name="mail"></ion-icon></a>
                    </div>
                `
                const $iconLinks = $card.querySelector('.icon-links')

                if (user.blog) {
                    const blogLink = document.createElement('a')
                    blogLink.href = user.blog
                    blogLink.innerHTML = `
                    <ion-icon name="create"></ion-icon>
                    `
                    $iconLinks.prepend(blogLink)
                }
                if (user.linkedin) {
                    const linkedinLink = document.createElement('a')
                    linkedinLink.href = user.linkedin
                    linkedinLink.innerHTML = `
                    <ion-icon name="logo-linkedin"></ion-icon>
                    `
                    $iconLinks.prepend(linkedinLink)
                }
                if (user.github) {
                    const githubLink = document.createElement('a')
                    githubLink.href = user.github
                    githubLink.innerHTML = `
                    <ion-icon name="logo-github"></ion-icon>
                    `
                    $iconLinks.prepend(githubLink)
                } 

                document.querySelector('#cards-container').appendChild($card)
            })
        })
}