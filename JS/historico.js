function openInterview(number) {
    const modal = document.getElementById("modal");
    const interviewNumber = document.getElementById("interviewNumber");

    interviewNumber.textContent =
        `Entrevista ${number}`;

    modal.classList.add("show");
}


function closeInterview() {
    const modal = document.getElementById("modal");

    modal.classList.remove("show");
}


function openSupport() {
    alert("Área de suporte do Avalia.");
}


/* Fecha o modal clicando fora dele */

window.addEventListener("click", function(event) {

    const modal = document.getElementById("modal");

    if (event.target === modal) {
        closeInterview();
    }
});