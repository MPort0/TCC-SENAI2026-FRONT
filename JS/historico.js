document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    const listaContainer = document.querySelector(".interviews-list");

    if (!listaContainer) return;

    if (!userId) {
        listaContainer.innerHTML = "<p style='color: #cbd5e1;'>Faça login para visualizar seu histórico de entrevistas.</p>";
        return;
    }

    try {
        const resposta = await fetch(`${window.API_BASE}/ia/devolutivas/usuario/${userId}`);
        const entrevistas = await resposta.json();

        if (!resposta.ok || !Array.isArray(entrevistas)) {
            throw new Error(entrevistas.error || "Resposta inválida do servidor.");
        }

        listaContainer.innerHTML = "";

        if (entrevistas.length === 0) {
            listaContainer.innerHTML = "<p style='color: #cbd5e1;'>Você ainda não concluiu nenhuma simulação de entrevista.</p>";
            return;
        }

        entrevistas.forEach((item) => {
            const dataFormatada = new Date(item.criadoEm).toLocaleDateString("pt-BR");
            const titulo = item.tecnologia && item.tecnologia !== "Geral"
                ? `${item.cargo} - ${item.tecnologia}`
                : item.cargo;

            const card = document.createElement("div");
            card.className = "interview-card";
            card.innerHTML = `
                <div class="interview-info">
                    <h2>${titulo}</h2>
                    <p>${dataFormatada} • Nível: ${item.dificuldade}</p>
                </div>
                <div class="score">
                    ${Number(item.nota).toFixed(1)}
                </div>
                <button class="arrow" onclick="abrirDevolutiva(${item.id})" title="Ver devolutiva completa">
                    ›
                </button>
            `;
            listaContainer.appendChild(card);
        });
    } catch (erro) {
        console.error("Erro ao carregar histórico:", erro);
        listaContainer.innerHTML = "<p style='color: #f87171;'>Erro ao carregar histórico do servidor.</p>";
    }
});

function abrirDevolutiva(id) {
    window.location.href = `../HTML/devolutiva.html?id=${id}`;
}