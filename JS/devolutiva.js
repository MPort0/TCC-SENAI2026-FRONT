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

    // 2. Lógica para gerar o PDF ao clicar no botão
    const btnPdf = document.getElementById('btn-baixar-pdf');

    if (btnPdf) {
        btnPdf.addEventListener('click', function () {
            // Seleciona apenas a área do relatório (deixa a sidebar de fora)
            const elemento = document.querySelector('.content');

            // Esconde os botões temporariamente para não saírem na foto do PDF
            const acoes = document.querySelector('.actions');
            if (acoes) acoes.style.display = 'none';

            // Configurações de impressão do PDF
            const opcoes = {
                margin: [10, 10, 10, 10],
                filename: 'Devolutiva_AvaLia.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: { scale: 2, useCORS: true, logging: false },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            // Gera o documento e faz o download automático
            html2pdf().set(opcoes).from(elemento).save().then(() => {
                // Voltar a exibir os botões na tela após o download
                if (acoes) acoes.style.display = 'flex';
            });
        });
    }

    const btnChatLia = document.getElementById('lia');

    if (btnChatLia) {
        btnChatLia.addEventListener('click', function () {
            // Altera o caminho para a página desejada
            window.location.href = "../HTML/chat-lia.html";
        });
    }

    document.addEventListener("DOMContentLoaded", function () {
        // 1. Busca os dados da avaliação salvos no localStorage
        const relatorioSalvo = localStorage.getItem("devolutiva_resultado");

        if (!relatorioSalvo) {
            alert("Nenhum resultado de entrevista encontrado!");
            window.location.href = "../HTML/simulação.html";
            return;
        }

        const relatorio = JSON.parse(relatorioSalvo);

        // 2. Preenche o Resumo da IA
        const resumoEl = document.getElementById("resumo-ia");
        if (resumoEl && relatorio.resumo) {
            resumoEl.innerText = relatorio.resumo;
        }

        // 3. PREENCHIMENTO DINÂMICO DAS BARRAS DE DESEMPENHO
        if (relatorio.competencias) {
            // --- Competências Fundamentais ---
            const fundamentais = relatorio.competencias.fundamentais;
            if (fundamentais) {
                const barFund = document.getElementById("bar-fundamentais");
                const nivelFund = document.getElementById("nivel-fundamentais");

                if (barFund) barFund.style.width = `${fundamentais.porcentagem || 0}%`;
                if (nivelFund) nivelFund.innerText = fundamentais.nivel || "Avaliando...";
            }

            // --- Aplicação Prática ---
            const pratica = relatorio.competencias.pratica;
            if (pratica) {
                const barPratica = document.getElementById("bar-pratica");
                const nivelPratica = document.getElementById("nivel-pratica");

                if (barPratica) barPratica.style.width = `${pratica.porcentagem || 0}%`;
                if (nivelPratica) nivelPratica.innerText = pratica.nivel || "Avaliando...";
            }
        }

        // 4. Preenche as Listas (Pontos Fortes, Erros e Sugestões)
        preencherLista("lista-pontos-fortes", relatorio.pontosFortes);
        preencherLista("lista-principais-erros", relatorio.principaisErros);
        preencherLista("lista-sugestoes", relatorio.sugestoesEstudo);

        function preencherLista(elementId, itens) {
            const ul = document.getElementById(elementId);
            if (!ul || !itens || !Array.isArray(itens)) return;

            ul.innerHTML = ""; // Limpa os itens de carregamento
            itens.forEach(item => {
                const li = document.createElement("li");
                li.innerText = item;
                ul.appendChild(li);
            });
        }

        // 5. Botão de Exportar PDF
        const btnPdf = document.getElementById('btn-baixar-pdf');
        if (btnPdf) {
            btnPdf.addEventListener('click', async function () {
                const elemento = document.querySelector('.content');
                const acoes = document.querySelector('.actions');

                if (acoes) acoes.style.display = 'none';

                const opcoes = {
                    margin: [10, 10, 10, 10],
                    filename: 'Devolutiva_AvaLia.pdf',
                    image: { type: 'jpeg', quality: 0.98 },
                    html2canvas: { scale: 2, useCORS: true, logging: false },
                    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };

                try {
                    await html2pdf().set(opcoes).from(elemento).save();
                } catch (erro) {
                    console.error("Erro ao gerar PDF:", erro);
                } finally {
                    if (acoes) acoes.style.display = 'flex';
                }
            });
        }

        // 6. Botão de Nova Entrevista
        const btnNovaEntrevista = document.getElementById('btn-nova-entrevista');
        if (btnNovaEntrevista) {
            btnNovaEntrevista.addEventListener('click', function () {
                window.location.href = "../HTML/simulação.html";
            });
        }
    });
});