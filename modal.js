const closeModalButton = document.querySelector("#closeModal");
const modal = document.querySelector("#modal");
const fade = document.querySelector("#fade");

const togglemodal = (event) => {
    modal.classList.toggle("hide");
    fade.classList.toggle("hide");
}

document.addEventListener('DOMContentLoaded', () => {
    [closeModalButton, fade].forEach((el) => el.addEventListener("click", togglemodal));
})

