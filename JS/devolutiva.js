document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const devolutivaId = params.get("id");

    let relatorio = null;

    // 1A. Se veio clicando na seta lá do Histórico (?id=...)
    if (devolutivaId) {
        try {
            const resp = await fetch(`${window.API_BASE}/ia/devolutivas/${devolutivaId}`);
            if (!resp.ok) throw new Error("Falha ao buscar devolutiva.");
            relatorio = await resp.json();
        } catch (err) {
            console.error("Erro ao carregar devolutiva do histórico:", err);
            alert("Não foi possível carregar esta devolutiva.");
            return;
        }
    }
    // 1B. Se acabou de terminar uma simulação
    else {
        const dadosSalvos = localStorage.getItem("devolutiva_resultado");

        if (!dadosSalvos) {
            console.warn("Nenhum resultado de devolutiva encontrado no localStorage.");
            return;
        }

        relatorio = JSON.parse(dadosSalvos);

        // Salva no banco apenas uma vez (evita duplicar se apertar F5)
        const jaSalva = localStorage.getItem("devolutiva_salva_banco");
        const userId = localStorage.getItem("userId");
        const config = JSON.parse(localStorage.getItem("entrevista_config") || "{}");

        if (userId && !jaSalva) {
            try {
                const respSave = await fetch(`${window.API_BASE}/ia/devolutivas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, config, relatorio })
                });

                if (respSave.ok) {
                    localStorage.setItem("devolutiva_salva_banco", "true");
                }
            } catch (err) {
                console.error("Erro ao salvar devolutiva no banco:", err);
            }
        }
    }

    // 2. Preenche o Resumo da IA
    const summaryText = document.getElementById('resumo-ia');
    if (summaryText && relatorio.resumo) {
        summaryText.textContent = relatorio.resumo;
    }

    // 3. Preenche as Competências e barras de progresso
    if (relatorio.competencias) {
        if (relatorio.competencias.fundamentais) {
            const nivelFund = document.getElementById('nivel-fundamentais');
            const barFund = document.getElementById('bar-fundamentais');
            if (nivelFund) nivelFund.textContent = relatorio.competencias.fundamentais.nivel || "Avaliando...";
            if (barFund) barFund.style.width = `${relatorio.competencias.fundamentais.porcentagem || 0}%`;
        }

        if (relatorio.competencias.pratica) {
            const nivelPrat = document.getElementById('nivel-pratica');
            const barPrat = document.getElementById('bar-pratica');
            if (nivelPrat) nivelPrat.textContent = relatorio.competencias.pratica.nivel || "Avaliando...";
            if (barPrat) barPrat.style.width = `${relatorio.competencias.pratica.porcentagem || 0}%`;
        }
    }

    // 4. Preenche as Listas (Pontos Fortes, Erros e Sugestões)
    preencherLista('lista-pontos-fortes', relatorio.pontosFortes);
    preencherLista('lista-principais-erros', relatorio.principaisErros);
    preencherLista('lista-sugestoes', relatorio.sugestoesEstudo);

    function preencherLista(elementId, itens) {
        const ul = document.getElementById(elementId);
        if (!ul || !itens || !Array.isArray(itens)) return;

        ul.innerHTML = ""; // Limpa itens estáticos/anteriores
        itens.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
        });
    }

    // 5. Botão Nova Entrevista
    const btnNova = document.getElementById('btn-nova-entrevista');
    if (btnNova) {
        btnNova.addEventListener('click', () => {
            localStorage.removeItem("devolutiva_salva_banco");
            window.location.href = "../HTML/simulacao.html";
        });
    }

    // 6. Botão Chat com a Lia
    const btnChatLia = document.getElementById('lia');
    if (btnChatLia) {
        btnChatLia.addEventListener('click', () => {
            window.location.href = "../HTML/chat-lia.html";
        });
    }

    // 7. Botão de Gerar/Baixar PDF
    const btnPdf = document.getElementById('btn-baixar-pdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', async function () {
            const elemento = document.querySelector('.content');

            // Ativa o layout limpo de impressão
            elemento.classList.add('modo-pdf');

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
                // Volta exatamente ao estado original da tela
                elemento.classList.remove('modo-pdf');
            }
        });
    }
});