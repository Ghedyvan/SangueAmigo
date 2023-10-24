function formatDate(nextDonationDate) {
    const data = new Date(nextDonationDate);
    console.log("Data:", data)
    let nextDonationMonth = data.getMonth() + 1;
    let currentMonth = new Date().getMonth() + 1;

    if (nextDonationMonth == 1) {
        nextDonationMonth = nextDonationMonth + 12
    }
    if (nextDonationMonth == 2) {
        nextDonationMonth = nextDonationMonth + 11
    }
    if (nextDonationMonth == 3) {
        nextDonationMonth = nextDonationMonth + 10
    }
    console.log("1:", nextDonationMonth)
    console.log("2:", currentMonth)

    return `${nextDonationMonth - currentMonth}`;
}

function createNextDonationDates(nextDonationDate) {
    return `<p>${formatDate(nextDonationDate)} meses</p>`
}

function getMonthsLeft() {
    const table = document.getElementById("monthsLeft");

    get("http://localhost:8080/account/:userId/nextDonationDate", function (error, data) {
        if (error) {
            console.error(error);
            return;
        }

        let nextDonationDate = JSON.parse(data);
        table.innerHTML += createNextDonationDates(nextDonationDate);
    });
}

getMonthsLeft();

function createMostNeedingBloodCenter(mostNeedingBloodCenter) {
    return `<p>${mostNeedingBloodCenter}</p>`
}

function getBloodCenterInMostNeed() {
    const table = document.getElementById("mostNeedingBloodCenter");

    get("http://localhost:8080/bloodCenters/mostNeeding", function (error, data) {
        if (error) {
            console.error(error);
            return;
        }

        let mostNeedingBloodCenter = data;
        table.innerHTML = createMostNeedingBloodCenter(mostNeedingBloodCenter);
    });
}

getBloodCenterInMostNeed();

function createMostNeedingBloodType(mostNeedingBloodType) {
    return `<p>${mostNeedingBloodType}</p>`
}

function getBloodTypeInMostNeed() {
    const table = document.getElementById("mostNeedingBloodType");

    get("http://localhost:8080/bloodStock/bloodTypeMostInNeed", function (error, data) {
        if (error) {
            console.error(error);
            return;
        }

        let mostNeedingBloodType = data;
        table.innerHTML = createMostNeedingBloodType(mostNeedingBloodType);
    });
}

getBloodTypeInMostNeed();