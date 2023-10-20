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

function cretedUserHeader(userDetails) {

    console.log(userDetails)
    return `<p>${userDetails.name}</p>                     
            <h2> ${userDetails.blood_type}</h2>
            `
}


function getAccountList() {
    get("http://localhost:8080/account/list", function (error, data) {
        if (error) {
            console.error(error);
            return;
        }

        console.log('teste');
        let userDetails = JSON.parse(data);
        const userHeader = document.getElementById("userHeader");
        userHeader.innerHTML = cretedUserHeader(userDetails);

    });
}

getAccountList();