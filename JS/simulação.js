document.addEventListener("DOMContentLoaded", function () {

    const opcoes = document.querySelectorAll(".option");
    const botaoIniciar = document.querySelector(".start-button");

    // Selecionar opções
    opcoes.forEach(function (opcao) {
        opcao.addEventListener("click", function () {

            const grupo = opcao.parentElement;

            grupo.querySelectorAll(".option").forEach(function (item) {
                item.classList.remove("selected");
            });

            opcao.classList.add("selected");
        });
    });

    // Botão iniciar entrevista
    botaoIniciar.addEventListener("click", function () {
        alert("Entrevista iniciada!");
    });
});

    function openSupport() {
    alert("Área de suporte do Avalia.");
}