const form = document.getElementById("donationForm");
const fileInput = document.getElementById("file-input");
form.addEventListener('submit', handleSubmit);
fileInput.addEventListener("change", handleFiles, false);
let file;

function handleSubmit(event) {
    event.preventDefault();
    uploadFiles();
}

function handleFiles() {
    if (this.files.length > 1) {
        this.file = [this.files[0]];
        return;
    }
    const nameDocument = document.getElementById("filename");
    nameDocument.innerHTML = this.files[0].name;
    file = this.files[0];
}

function uploadFiles() {
    const url = 'http://localhost:8080/account/donation';

    const bloodCenter = document.getElementById("bloodCenter").value;
    const date = document.getElementById("date").value;

    const jsonData = {
        bloodCenter: bloodCenter,
        date: date
    };

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(jsonData)], { type: "application/json" }));
    formData.append("file", file);
    logFormDataDetails(formData);

    let token = localStorage.getItem("authToken");

    fetch(url, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + token
        },
        body: formData,
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.statusText}`);
        }
        console.log("doação enviada");
    })
    .catch(error => {
        console.error("Erro na solicitação:", error);
    });
}

function logFormDataDetails(formData) {
    const formDataObject = {};
    for (const pair of formData.entries()) {
        formDataObject[pair[0]] = pair[1];
    }
    console.log("Detalhes do FormData:", formDataObject);
}