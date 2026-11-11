document.addEventListener("DOMContentLoaded", function () {
    const opcoes = document.querySelectorAll(".option");
    const botaoIniciar = document.querySelector(".start-button");

    // Selecionar opções (Seu código original mantido)
    opcoes.forEach(function (opcao) {
        opcao.addEventListener("click", function () {
            const grupo = opcao.parentElement;

            grupo.querySelectorAll(".option").forEach(function (item) {
                item.classList.remove("selected");
            });

            opcao.classList.add("selected");
        });
    });

    // Botão iniciar entrevista (Código adicionado para capturar e salvar)
    botaoIniciar.addEventListener("click", function (event) {
        event.preventDefault(); // Evita comportamento padrão se o botão for link/form

        // Busca o botão que tem a classe 'selected' dentro de cada bloco
        const cargoSelecionado = document.querySelector('.selection-section:nth-of-type(1) .option.selected');
        const tecnologiaSelecionada = document.querySelector('.selection-section:nth-of-type(2) .option.selected');
        const dificuldadeSelecionada = document.querySelector('.selection-section.difficulty .option.selected');

        // Validação: garante que o usuário marcou os 3 itens
        if (!cargoSelecionado || !tecnologiaSelecionada || !dificuldadeSelecionada) {
            alert("Por favor, selecione um Cargo, uma Tecnologia e uma Dificuldade!");
            return;
        }

        // Criamos o objeto com os dados escolhidos
        const configuracao = {
            cargo: cargoSelecionado.textContent.trim(),
            tecnologia: tecnologiaSelecionada.textContent.trim(),
            dificuldade: dificuldadeSelecionada.textContent.trim()
        };

        // Salva na memória do navegador
        localStorage.setItem("entrevista_config", JSON.stringify(configuracao));

        // Redireciona para a tela de entrevista
        window.location.href = "../HTML/simulacao-corrida.html";
    });
});