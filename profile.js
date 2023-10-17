function get(url, callback) {
    let request = new XMLHttpRequest();
    let token = localStorage.getItem("authToken");

    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                callback(null, request.responseText);
            } else {
                callback("Erro na solicitação: " + request.statusText, null);
            }
        }
    };

    request.open("GET", url, true);

    if (token) {
        request.setRequestHeader("Authorization", "Bearer " + token);
    }

    request.send();
}

function cretedAccountTable(userDetails) {

    console.log(userDetails)
    return `<div class="retangulo-dados">
                <p>Usuário: ${userDetails.name}</p>
            </div>
            <div class="retangulo-dados">
                <p>Sexo Biológico: ${userDetails.biological_sex}</p>
            </div>
            <div class="retangulo-dados">
                <p>Email: ${userDetails.email}</p>
            </div>
            <div class="retangulo-dados">
                <p>Tipo Sanguíneo e Fator Rh: ${userDetails.blood_type}</p>
            </div>
            <div class="retangulo-dados">
                <p>Data de nascimento: ${userDetails.birthday}</p>
            </div>
            <div class="retangulo-dados">
                <p>Peso: ${userDetails.weight}kg</p>
            </div>`
}


function getAccountList() {
    get("http://localhost:8080/account/list", function (error, data) {
        if (error) {
            console.error(error);
            return;
        }

        console.log(data);
        let userDetails = JSON.parse(data);
        const table = document.getElementById("accountTable");
        table.innerHTML += cretedAccountTable(userDetails);

    });
}

getAccountList();

function createQuantityButton(quantity) {
    return `<h1>${quantity}</h1>`
}

function getAccountQuantity() {
    get("http://localhost:8080/account/:userId/donationQuantity", function (error, data) {
        if (error) {
            console.error(error);
            return;
        }

        console.log(data);
        let quantity = JSON.parse(data);
        const table = document.getElementById("donationQuantity");
        table.innerHTML += createQuantityButton(quantity);
    });
}

getAccountQuantity();

function formatDate(dataString) {
    const data = new Date(dataString);
    
    const dia = data.getDate();
    const mes = obterNomeMes(data.getMonth());
    const ano = data.getFullYear();
    
    const dataFormatada = `${dia} de ${mes} de ${ano}`;
    
    return dataFormatada;
}

function obterNomeMes(numeroMes) {
    const meses = [
        "janeiro", "fevereiro", "março",
        "abril", "maio", "junho",
        "julho", "agosto", "setembro",
        "outubro", "novembro", "dezembro"
    ];
    
    return meses[numeroMes];
}

function createLastDonationDates(lastDonationDate) {
    return `<p>Ultima doação: <span>${formatDate(lastDonationDate)}.</span></p>`
}

function createNextDonationDates(nextDonationDate) {
    return `<p>Próxima doação: <span>${formatDate(nextDonationDate)}.</span></p>`
}

function getDonationDates() {
    const table = document.getElementById("donationDatesInfo");

    get("http://localhost:8080/account/:userId/lastDonationDate", function (error, data) {
        if (error) {
            console.error(error);
            return;
        }

        console.log(data);
        let lastDonationDate = JSON.parse(data);
        table.innerHTML += createLastDonationDates(lastDonationDate);
    });

    get("http://localhost:8080/account/:userId/nextDonationDate", function (error, data) {
        if (error) {
            console.error(error);
            return;
        }

        console.log(data);
        let nextDonationDate = JSON.parse(data);
        table.innerHTML += createNextDonationDates(nextDonationDate);
    });
}

getDonationDates();