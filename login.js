const formEl = document.getElementById('loginForm')

formEl.addEventListener('submit', event => {
    event.preventDefault();

    const formData = new FormData(formEl);

    formData.set('email', formData.get('login'));
    formData.delete('login');

    const data = Object.fromEntries(formData);

    console.log(data);
    console.log(JSON.stringify(data));
    loginUser(data);
})

function loginUser(data) {

    fetch('http://localhost:8080/auth/login', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    })
        .then((response) => response.json())
        .then((data) => {
            console.log("Resposta do servidor:", data);

            const authToken = data.token;
            console.log(authToken);

            localStorage.setItem("authToken", authToken);

            console.log("Login Sucessfull");
            window.location.href = "./home.html";
        })
        .catch((error) => {
            console.error("Erro na solicitação:", error);
            alert("Erro ao autenticar. Por favor, tente novamente.");
        });
}