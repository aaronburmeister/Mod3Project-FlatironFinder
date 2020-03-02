const BASE_URL = "http://localhost:3000/"

const loginForm = document.querySelector('#login form')

loginForm.addEventListener('submit', event => {
    event.preventDefault()

    const formData = new FormData(event.target)
    const username = formData.get('username')
    const password = formData.get('password')

    console.log(username, password)

    // fetch(BASE_URL + "users", {
    //     method: "POST",
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: { username, password }
    // }).then(response => response.json())
    // .then(console.log)
    // event.target.reset()
})

/*
<aside id="filters">

</aside>
<section id="user-cards">

</section>
*/