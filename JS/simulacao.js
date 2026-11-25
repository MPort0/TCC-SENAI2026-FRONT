document.addEventListener("DOMContentLoaded", function () {
    const opcoes = document.querySelectorAll(".option");
    const botaoIniciar = document.querySelector(".start-button");

    opcoes.forEach(function (opcao) {
        opcao.addEventListener("click", function () {
            const grupo = opcao.parentElement;

            grupo.querySelectorAll(".option").forEach(function (item) {
                item.classList.remove("selected");
            });

            opcao.classList.add("selected");
        });
    });

    if (!botaoIniciar) return;

    botaoIniciar.addEventListener("click", function (event) {
        event.preventDefault();

        const cargoSelecionado = document.querySelector('.selection-section:nth-of-type(1) .option.selected');
        const tecnologiaSelecionada = document.querySelector('.selection-section:nth-of-type(2) .option.selected');
        const dificuldadeSelecionada = document.querySelector('.selection-section.difficulty .option.selected');

        if (!cargoSelecionado || !tecnologiaSelecionada || !dificuldadeSelecionada) {
            alert("Por favor, selecione um Cargo, uma Tecnologia e uma Dificuldade!");
            return;
        }

        const configuracao = {
            cargo: cargoSelecionado.textContent.trim(),
            tecnologia: tecnologiaSelecionada.textContent.trim(),
            dificuldade: dificuldadeSelecionada.textContent.trim()
        };

        localStorage.setItem("entrevista_config", JSON.stringify(configuracao));
        window.location.href = "../HTML/simulacao-corrida.html";
    });
});