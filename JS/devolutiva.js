document.addEventListener("DOMContentLoaded", async function () {
    const params = new URLSearchParams(window.location.search);
    const devolutivaId = params.get("id");

    let relatorio = null;

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
    } else {
        const dadosSalvos = localStorage.getItem("devolutiva_resultado");

        if (!dadosSalvos) {
            console.warn("Nenhum resultado de devolutiva encontrado.");
            return;
        }

        relatorio = JSON.parse(dadosSalvos);

        // Compara com o último relatório salvo (evita duplicar no F5, mas salva todas as novas simulações!)
        const ultimaSalva = localStorage.getItem("ultima_devolutiva_salva");
        const userId = localStorage.getItem("userId");
        const config = JSON.parse(localStorage.getItem("entrevista_config") || "{}");

        if (userId && ultimaSalva !== dadosSalvos) {
            try {
                const respSave = await fetch(`${window.API_BASE}/ia/devolutivas`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId, config, relatorio })
                });

                if (respSave.ok) {
                    localStorage.setItem("ultima_devolutiva_salva", dadosSalvos);
                }
            } catch (err) {
                console.error("Erro ao salvar devolutiva no banco:", err);
            }
        }
    }

    const summaryText = document.getElementById('resumo-ia');
    if (summaryText && relatorio.resumo) {
        summaryText.textContent = relatorio.resumo;
    }

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

    preencherLista('lista-pontos-fortes', relatorio.pontosFortes);
    preencherLista('lista-principais-erros', relatorio.principaisErros);
    preencherLista('lista-sugestoes', relatorio.sugestoesEstudo);

    function preencherLista(elementId, itens) {
        const ul = document.getElementById(elementId);
        if (!ul || !itens || !Array.isArray(itens)) return;

        ul.innerHTML = "";
        itens.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            ul.appendChild(li);
        });
    }

    const btnNova = document.getElementById('btn-nova-entrevista');
    if (btnNova) {
        btnNova.addEventListener('click', () => {
            window.location.href = "../HTML/simulacao.html";
        });
    }

    const btnChatLia = document.getElementById('lia');
    if (btnChatLia) {
        btnChatLia.addEventListener('click', () => {
            window.location.href = "../HTML/chat-lia.html";
        });
    }

    const btnPdf = document.getElementById('btn-baixar-pdf');
    if (btnPdf) {
        btnPdf.addEventListener('click', async function () {
            const elemento = document.querySelector('.content');

            window.scrollTo(0, 0);
            elemento.classList.add('modo-pdf');

            const opcoes = {
                margin: [8, 8, 8, 8],
                filename: 'Devolutiva_AvaLia.pdf',
                image: { type: 'jpeg', quality: 0.98 },
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    scrollY: 0,
                    backgroundColor: '#ffffff'
                },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };

            try {
                await html2pdf().set(opcoes).from(elemento).save();
            } catch (erro) {
                console.error("Erro ao gerar PDF:", erro);
            } finally {
                elemento.classList.remove('modo-pdf');
            }
        });
    }
});