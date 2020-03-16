const BASE_URL = "https://flatiron-finder-backend.herokuapp.com/"

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
    .then(response => {
        if (response.token) {
            localStorage.setItem('token', `bearer ${response.token}`)
            return response.user
        } else if (response.message) {
            // Make these pop-ups around the specific field
            alert(response.message)
        }
    })
    .then(response => {
        if (localStorage.getItem('token')) {
            hide(loginMain)
            hide($loginSignup)
            userMain.classList.remove('hidden')
            $greeting.classList.remove('hidden')
            localStorage.setItem('name', response.name)
            localStorage.setItem('id', response.id)
            $greeting.innerHTML = `
            <h3 dataset_id="${response.id}">Hi, ${response.name}</h3>
            <button onclick="logOut()">Log Out</button>
            `
            loadUsers()
        }
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
const $editDatalistOptions = document.querySelector('#edit-languages-list')

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
        $editDatalistOptions.appendChild(option)
    })
}

// Upload Profile Picture

const $uploadFile = document.querySelector('#prof-image')
const $preview = document.querySelector('#prof-pic-preview')

$uploadFile.addEventListener('change', function() {
    addImage(this)
})

function addImage(input) {

    let image = new FileReader()

    image.onload = function(e) {
        // base64 encoded
        file = e.target.result

        fetch("https://api.cloudinary.com/v1_1/oneflatboi/image/upload", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'file': file,
                'upload_preset': 'flatironfinder'
            })
        }).then(response => response.json())
        .then(result => {
            $preview.setAttribute('src', result.url)
        })
        .catch(console.log)
    }

    image.readAsDataURL(input.files[0])
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
    if ($preview.src !== "https://www.pngitem.com/pimgs/m/111-1114658_person-png-outline-outline-of-person-face-transparent.png") {
        user['profile_pic'] = $preview.src
    }
    const languages = getLanguages()
    const frameworks = getFrameworks()

    document.querySelector('#signup-known-languages').innerHTML = ""
    fetch(`${BASE_URL}users`, {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({user: user, languages: languages, frameworks: frameworks})
    }).then(response => response.json())
    .then(response => {
        if (response.error) {
            let alertMessage = ""
            Object.keys(response.error).forEach( key => {
                Object.values(response.error[key]).forEach( value => {
                    alertMessage += `${key} ${value} \n`
                })
            })
            alert(alertMessage)
        } else {
            hide(signupMain)
            loginMain.classList.remove('hidden')
            alert("Your registration was successful! You can now log in!")
            event.target.reset()
        }
    })
})

function getLanguages() {
    const langList = document.querySelectorAll(`.language-block`)
    const languageIDs = []
    langList.forEach(element => {
        if (element.getAttribute('tech') === 'languages') {
            languageIDs.push(element.getAttribute('tech_id'))
        }
    })
    return languageIDs
}

function getFrameworks() {
    const frameList = document.querySelectorAll(`.language-block`)
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
const $editAddLanguageBtn = document.querySelector('#edit-add-language')

$addLanguageBtn.addEventListener('click', event => {
    event.preventDefault()

    addToKnownLanguages(document.querySelector('#language').value, "signup")

    document.querySelector('#language').value = ""
})

$editAddLanguageBtn.addEventListener('click', event => {
    event.preventDefault()

    addToKnownLanguages(document.querySelector('#edit-language').value, "edit")

    document.querySelector('#edit-language').value = ""
})

function addToKnownLanguages(technology, form) {
    const $options = document.querySelectorAll('datalist option')
    
    let $option
    $options.forEach(option => {
        if (option.innerText === technology){
            $option = option
        }
    })
    document.getElementById(`${form}-pop-up`).classList.remove('hidden')
    document.getElementById(`${form}-pop-up`).classList.add('hidden')
    language_ids = getLanguages(form)

    const $list = document.querySelector(`#${form}-known-languages`)
    const $span = document.createElement('span')

    switch ($option.getAttribute('tech')) {
        case 'languages':
            appendSpanWithMetaData($span, $option, $list)
            break
        case 'frameworks':
            if (language_ids.includes($option.getAttribute('lang-id'))) {
                $span.setAttribute('lang-id', $option.getAttribute('lang-id'))
                appendSpanWithMetaData($span, $option, $list)
            } else {
                fetch(`${BASE_URL}languages/${$option.getAttribute('lang-id')}`)
                    .then(response => response.json())
                    .then(response => {
                    document.getElementById(`${form}-pop-up`).innerText = `You need to add ${response.name} first!`
                    document.getElementById(`${form}-pop-up`).classList.remove('hidden')
                    })
            } break
    }

}

function appendSpanWithMetaData(span, option, list) {
    span.className = "language-block"
    span.setAttribute('tech_id', option.getAttribute('tech_id'))
    span.setAttribute('tech', option.getAttribute('tech'))
    span.innerHTML = `
    ${option.innerText.trim()} <ion-icon name="close-circle-outline"></ion-icon>
    `
    span.querySelector('ion-icon').addEventListener("click", event =>{
        event.target.parentNode.remove()
    })
    list.appendChild(span)
}

/* USER MAIN *****/

function loadUsers() {
    fetch(`${BASE_URL}users`)
        .then(response => response.json())
        .then(renderCards)
}

function renderCards(users) {
    users.forEach(user => {
        // generate links
        if (user.id == $greeting.querySelector('h3').getAttribute('dataset_id')) {
            generateViewLink(user)
            generateEditLink(user)
            generateDelete(user)
        }

        // generate cards
        const $card = document.createElement('div')
        $card.classList.add('card')

        let src;

        user.profile_pic ? src = user.profile_pic : src = "https://www.pngitem.com/pimgs/m/111-1114658_person-png-outline-outline-of-person-face-transparent.png"

        $card.innerHTML = `
            <div class="profile-image">
                <img class="profile-picture" dataset_id="${user.id}" src="${src}">
            </div>
            <div class="profile-info">
                <h4>${user.name}</h4>
                <h5>${user.campus}</h5>
            </div>
            <div class="icon-links">
                <a href="mailto:${user.email}"><ion-icon name="mail"></ion-icon></a>
            </div>
        `

        const $img = $card.querySelector('.profile-picture')

        $img.addEventListener('click', event => {
            hide(userMain)
            userView.classList.remove('hidden')
            createUserView(user)
        })

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
}
/* Generate Links ******/

function generateViewLink(user) {
    const viewButton = document.createElement('button')
    
    viewButton.id = "view-button"
    viewButton.innerText = "View Profile"
    viewButton.onclick = () => {
        hide(userMain)
        userView.classList.remove('hidden')
        createUserView(user)
    }

    document.querySelector('#my-profile').append(viewButton)
}

function generateEditLink(user) {
    const editButton = document.createElement('button')

    editButton.id = "edit-button"
    editButton.innerText = "Edit Profile"
    editButton.onclick = () => {
        hide(userMain)
        signupMain.classList.remove('hidden')
        document.querySelector('#signup-form').classList.toggle('hidden')
        document.querySelector('#signup-title').classList.toggle('hidden')
        document.querySelector('#edit-form').classList.toggle('hidden')
        document.querySelector('#edit-title').classList.toggle('hidden')

        fetch(`${BASE_URL}users/${localStorage.getItem('id')}`)
            .then(response => response.json())
            .then(populateEditForm)
    }

    document.querySelector('#my-profile').append(editButton)
}

function populateEditForm(user) {
    document.querySelector('input#edit-username').value = user.username
    document.querySelector('input#edit-name').value = user.name
    document.querySelector('input#edit-email').value = user.email
    document.querySelector('select#edit-campus').value = user.campus
    user.cohort ? document.querySelector('input#edit-cohort').value = user.cohort : null;
    user.github ? document.querySelector('input#edit-github').value = user.github : null;
    user.linkedin ? document.querySelector('input#edit-linkedin').value = user.linkedin : null;
    user.blog ? document.querySelector('input#edit-blog').value = user.blog : null;
    user.profile_pic ? document.querySelector('img#edit-prof-pic-preview').src = user.profile_pic : null
    user.languages.length > 0 ? addUserLanguages(user.languages) : null;
    user.frameworks.length > 0 ? addUserFrameworks(user.frameworks) : null;
}

function addUserLanguages(languages) {
    languages.forEach( language => {
        addToKnownLanguages(language.name, "edit")
    })
}

function addUserFrameworks(frameworks) {
    frameworks.forEach( framework => {
        addToKnownLanguages(framework.name, "edit")
    })
}

const $editForm = document.querySelector('#edit-form')

$editForm.addEventListener('submit', event => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const user = {}
    user['username'] = formData.get('username')
    if (formData.get('password')) user['password'] = formData.get('password')
    user['name'] = formData.get('name')
    user['email'] = formData.get('email')
    user['campus'] = formData.get('campus')
    if (formData.get('cohort')) user['cohort'] = formData.get('cohort')
    if (formData.get('github')) user['github'] = formData.get('github')
    if (formData.get('linkedin')) user['linkedin'] = formData.get('linkedin')
    if (formData.get('edit-blog')) user['blog'] = formData.get('blog')
    if (document.querySelector('#edit-prof-pic-preview').src !== "https://www.pngitem.com/pimgs/m/111-1114658_person-png-outline-outline-of-person-face-transparent.png") {
        user['profile_pic'] = document.querySelector('edit-prof-pic-preview').src
    }
    const languages = getLanguages()
    const frameworks = getFrameworks()

    document.querySelector('#edit-known-languages').innerHTML = ""

    fetch(`${BASE_URL}users/${localStorage.getItem('id')}`, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        },
        body: JSON.stringify({user: user, languages: languages, frameworks: frameworks})
    }).then(response => response.json())
    .then(response => {
        if (response.error) {
            let alertMessage = ""
            Object.keys(response.error).forEach( key => {
                Object.values(response.error[key]).forEach( value => {
                    alertMessage += `${key} ${value} \n`
                })
            })
            alert(alertMessage)
        } else {
            alert("Your changes were successfully saved!")
            document.querySelector('#signup-form').classList.toggle('hidden')
            document.querySelector('#signup-title').classList.toggle('hidden')
            document.querySelector('#edit-form').classList.toggle('hidden')
            document.querySelector('#edit-title').classList.toggle('hidden')
            hide(signupMain)
            userMain.classList.remove('hidden')
            event.target.reset()
        }
    })
})

function generateDelete(user) {
    const deleteButton = document.createElement('button')

    deleteButton.id = "delete-button"
    deleteButton.innerText = "Delete Profile"
    deleteButton.onclick = () => {
        if (confirm("Are you sure you want to delete your account?")) {
            fetch(`${BASE_URL}users/${user.id}`, {
                method: "DELETE",
                headers: {
                    Authorization: localStorage.getItem('token')
                }
            }).then(response => response.json())
            .then(response => {
                if (response.user) {
                    logOut()
                } else {
                    alert(response.message)
                }
            })
        }
    }

    document.querySelector('#my-profile').append(deleteButton)
}

/* FILTER *****/

const $filterForm = document.querySelector('#filter-form')

$filterForm.addEventListener('submit', event => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const search = formData.get('search')
    const filter = formData.get('filter')

    fetch(`${BASE_URL}users?search=${search}&filter=${filter}`)
        .then(response => response.json())
        .then(response => {
            document.querySelector('#cards-container').innerHTML = ""
            return response
        })
        .then(renderCards)
})

/* GENERATE USER VIEW ******/

function createUserView(user) {
    let src;
    user.profile_pic ? src = user.profile_pic : src = "https://www.pngitem.com/pimgs/m/111-1114658_person-png-outline-outline-of-person-face-transparent.png" 

    userView.innerHTML = `
        <div class="user-header">
                <img class="profile-view-image" src="${src}">
                <div class="user-info">
                    <h2>${user.name}</h2>
                    <h3>${user.campus}</h3>
                    <h3>${user.cohort ? user.cohort : ""}</h3>
                    <div class="profile-icon-links">
                        <a href="mailto:${user.email}"><ion-icon name="mail"></ion-icon></a>
                    </div>
                </div>
            </div>
            <h4>Languages and Frameworks:</h4>
            <ul class="language-list">
            </ul>
        </div>
        <button class="back-button" onclick="backToMain()">Go Back</button>
    `
    const $profileLinks = userView.querySelector('.profile-icon-links')
    if (user.blog) {
        const blogLink = document.createElement('a')
        blogLink.href = user.blog
        blogLink.innerHTML = `
        <ion-icon name="create"></ion-icon>
        `
        $profileLinks.prepend(blogLink)
    }
    if (user.linkedin) {
        const linkedinLink = document.createElement('a')
        linkedinLink.href = user.linkedin
        linkedinLink.innerHTML = `
        <ion-icon name="logo-linkedin"></ion-icon>
        `
        $profileLinks.prepend(linkedinLink)
    }
    if (user.github) {
        const githubLink = document.createElement('a')
        githubLink.href = user.github
        githubLink.innerHTML = `
        <ion-icon name="logo-github"></ion-icon>
        `
        $profileLinks.prepend(githubLink)
    }
    console.log(user)
    user.languages.forEach( language => {
        const div = document.createElement('div')
        div.innerText = language.name
        user.frameworks.forEach( framework => {
            if (framework.language_id === language.id) {
                const li = document.createElement('li')
                li.innerText = framework.name
                div.appendChild(li)
            }
        })
        document.querySelector('.language-list').appendChild(div)
    })
}

if (localStorage.token) {
    hide(splashMain)
    hide(loginMain)
    hide($loginSignup)
    userMain.classList.remove('hidden')
    $greeting.classList.remove('hidden')
    $greeting.innerHTML = `
        <h3 dataset_id="${localStorage.getItem('id')}">Hi, ${localStorage.getItem('name')}</h3>
        <button onclick="logOut()">Log Out</button>
        `
    loadUsers()
}

function backToMain() {
    hide(userView)
    userMain.classList.remove('hidden')
}

function logOut() {
    hide(userView)
    hide(userMain)
    splashMain.classList.remove('hidden')
    hide($greeting)
    $loginSignup.classList.remove('hidden')
    $greeting.innerHTML = ""
    document.querySelector('#cards-container').innerHTML = ""
    document.querySelector('#my-profile').innerHTML = ""
    localStorage.removeItem('token')
    localStorage.removeItem('name')
    localStorage.removeItem('id')
}