document.addEventListener("DOMContentLoaded", function () {
    const dadosSalvos = localStorage.getItem("devolutiva_resultado");

    if (!dadosSalvos) {
        console.warn("Nenhum resultado de devolutiva encontrado no localStorage.");
        return;
    }

    const relatorio = JSON.parse(dadosSalvos);

    // 1. Resumo textual no topo
    const summaryText = document.getElementById('resumo-ia');
    if (summaryText && relatorio.resumo) {
        summaryText.textContent = relatorio.resumo;
    }

    // 2. Competências e barras de progresso
    if (relatorio.competencias) {
        if (relatorio.competencias.fundamentais) {
            const nivelFund = document.getElementById('nivel-fundamentais');
            const barFund = document.getElementById('bar-fundamentais');
            if (nivelFund) nivelFund.textContent = relatorio.competencias.fundamentais.nivel;
            if (barFund) barFund.style.width = `${relatorio.competencias.fundamentais.porcentagem}%`;
        }

        if (relatorio.competencias.pratica) {
            const nivelPrat = document.getElementById('nivel-pratica');
            const barPrat = document.getElementById('bar-pratica');
            if (nivelPrat) nivelPrat.textContent = relatorio.competencias.pratica.nivel;
            if (barPrat) barPrat.style.width = `${relatorio.competencias.pratica.porcentagem}%`;
        }
    }

    // 3. Listas dos cards
    const listaFortes = document.getElementById('lista-pontos-fortes');
    if (listaFortes && relatorio.pontosFortes) {
        listaFortes.innerHTML = relatorio.pontosFortes.map(item => `<li>${item}</li>`).join('');
    }

    const listaErros = document.getElementById('lista-principais-erros');
    if (listaErros && relatorio.principaisErros) {
        listaErros.innerHTML = relatorio.principaisErros.map(item => `<li>${item}</li>`).join('');
    }

    const listaSugestoes = document.getElementById('lista-sugestoes');
    if (listaSugestoes && relatorio.sugestoesEstudo) {
        listaSugestoes.innerHTML = relatorio.sugestoesEstudo.map(item => `<li>${item}</li>`).join('');
    }

    // 4. Botão Nova Entrevista
    const btnNova = document.getElementById('btn-nova-entrevista');
    if (btnNova) {
        btnNova.addEventListener('click', () => {
            window.location.href = "../HTML/simulação.html";
        });
    }
});