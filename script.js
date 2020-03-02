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

/* LOGIN FORM - put the following inside the #login element
<form>
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" placeholder="Username">
    <label for="password">Password:</label>
    <input type="password" id="password" name="password" placeholder="Password">
    <input type="submit" id="login-button" value="Login">
</form>
*/


/* LOGGED IN - MAIN
<aside id="filters">

</aside>
<section id="user-cards">

</section>
*/