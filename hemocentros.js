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

function criaLinha(bloodcenter) {

    console.log(bloodcenter)
    return `<div class="other-box">
                <p>${bloodcenter.name}</p>
                <p>${bloodcenter.street}, ${bloodcenter.number}<br>${bloodcenter.city} / ${bloodcenter.state} - CEP ${bloodcenter.cep}</p>
                <p>${bloodcenter.distance}km</p>
            </div>`
}

function getBloodCenterList() {

    get("http://localhost:8080/bloodCenters/list", function (error, data) {
        if (error) {
            console.error(error);
            return;
        }

        console.log(data);

        let bloodCenters = JSON.parse(data);

        const table = document.getElementById("tabela");

        bloodCenters.forEach(element => {
            table.innerHTML += criaLinha(element);
        });
    });
}

getBloodCenterList();
