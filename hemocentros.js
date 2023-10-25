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
    return `<div class="other-box" id="blood-center-${bloodcenter.id}">
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

        let bloodCenters = JSON.parse(data);

        const table = document.getElementById("tabela");

        bloodCenters.forEach(element => {
            table.innerHTML += criaLinha(element);
        });

        bindBloodCenterClick(bloodCenters);
    });
}

function bindBloodCenterClick(bloodCenters) {
    try {
        bloodCenters.forEach((bloodCenter) => {
            const bloodCenterRow = document.getElementById(`blood-center-${bloodCenter.id}`);
            bloodCenterRow.addEventListener('click', () => toggleBloodCenterModalInfo(bloodCenter));
        });
    } catch (error) {
        console.log(error);
    }
}

function fillBloodCenterInfo(bloodCenter, bloodCenterDetails) {
    try {
        const street = bloodCenter?.street;
        const city = bloodCenter?.city;
        const number = bloodCenter?.number;
        const state = bloodCenter?.state;
        const cep = bloodCenter?.cep;
        const address = `${street} ${number}, ${city}, ${state}, ${cep}`;
        document.getElementById('bloodCenterInfoAddress').innerText = address;
        document.getElementById('blooCenterInfoOperatingTime').innerText = bloodCenterDetails.operating_time;
        document.getElementById('blooCenterInfoPhone').innerText = bloodCenterDetails.phone_number;
        document.getElementById('bloodCenterInfoWebsite').href = bloodCenterDetails.website;
        document.getElementById('bloodCenterLastUpdatedAt').innerText = new Date().toLocaleDateString();
    } catch (error) {
        console.log(error);
    }
}

function getBloodPercentageStyle(percentage) {
    const percentagesStyles = {
        critical: {
            label: 'Crítico',
            class: 'bloodStockValueNotFull bloodStockCritical',
        },
        alert: {
            label: 'Alerta',
            class: 'bloodStockValueNotFull bloodStockAlert',
        },
        stable: {
            label: 'Estável',
            class: percentage < 100 ? 'bloodStockValueNotFull bloodStockStable' : 'bloodStockStable',
        }
    }

    if (percentage >= 60) return percentagesStyles.stable;

    return percentage >= 30 ? percentagesStyles.alert : percentagesStyles.critical;
}

function fillBloodCenterStockInfo(bloodCenterStock) {
    try {
        const MAX_BLOOD_QUANTITY = 400;
        const bloodTypes = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-'];

        bloodTypes.forEach((bloodType, index) => {
            const quantity = Math.min(MAX_BLOOD_QUANTITY, bloodCenterStock[bloodType]);
            const percentage = Math.floor((quantity/MAX_BLOOD_QUANTITY)*100);
            const bloodTypeElement = document.getElementById(`bloodStock-${index}`);
            if (bloodTypeElement) {
                const labelElement = bloodTypeElement.getElementsByClassName('bloodStockLabel')[0];
                const valueElement = bloodTypeElement.getElementsByClassName('bloodStockValue')[0];
                const percentageElement = bloodTypeElement.getElementsByClassName('bloodStockPercentage')[0];
                const percentageStyle = getBloodPercentageStyle(percentage);
                labelElement.innerHTML = percentageStyle.label;
                percentageElement.style.width = `${percentage}%`;
                valueElement.classList = `${percentageStyle.class} bloodStockValue`;
            }
        });
    } catch (error) {
        console.log(error);
    }
}

async function getBloodCenterStock(bloodCenterId) {
    const response = await new Promise((resolve, reject) => {
        try {
            get(`http://localhost:8080/bloodCenters/${bloodCenterId}/bloodstock`, (err, response) => {
                if (err) reject(err);
                else resolve(JSON.parse(response));
            })
        } catch (error) {
            resolve(error)
        }
    });
    return response;
}

async function getBloodCenterDetails(bloodCenterId) {
    const bloodCenters = await new Promise((resolve, reject) => {
        try {
            get(`http://localhost:8080/bloodCenters/detailedList`, (err, response) => {
                if (err) reject(err);
                else resolve(JSON.parse(response));
            })
        } catch (error) {
            resolve(error)
        }
    });
    return bloodCenters.find((bloodCenter) => bloodCenter.id === bloodCenterId);
}

async function toggleBloodCenterModalInfo(bloodcenter) {
    togglemodal();
    const bloodCenterStock = await getBloodCenterStock(bloodcenter.id);
    const bloodCenterDetails = await getBloodCenterDetails(bloodcenter.id);
    fillBloodCenterInfo(bloodcenter, bloodCenterDetails);
    fillBloodCenterStockInfo(bloodCenterStock);
}

getBloodCenterList();
