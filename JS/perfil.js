document.addEventListener("DOMContentLoaded", () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (!userId) {
        alert("Usuário não identificado. Faça login novamente.");
        window.location.href = "../HTML/login.html";
        return;
    }

    const inputName = document.getElementById("name");
    const inputEmail = document.getElementById("email");
    const btnSalvar = document.querySelector(".salvar-alteracoes");

    const headerUserName = document.querySelector(".user-name");
    const avatarLetra = document.querySelector(".avatar");
    const sidebarNome = document.querySelector(".user-nome");
    const sidebarEmail = document.querySelector(".user-email");

    function atualizarTela(nome, email) {
        if (inputName) inputName.value = nome || "";
        if (inputEmail) inputEmail.value = email || "";

        const primeiroNome = nome ? nome.split(" ")[0] : "usuário";

        if (headerUserName && headerUserName.firstChild) {
            headerUserName.firstChild.textContent = `${nome} `;
        }
        if (avatarLetra && nome) {
            avatarLetra.textContent = nome.charAt(0).toUpperCase();
        }
        if (sidebarNome) sidebarNome.textContent = `Olá, ${primeiroNome}!`;
        if (sidebarEmail) sidebarEmail.textContent = email || "";
    }

    function carregarCurriculosNoPerfil() {
        const chaveStorage = `curriculos_${userId}`;
        const rawCurriculos = JSON.parse(localStorage.getItem(chaveStorage)) || [];

        // Remove possíveis duplicatas idênticas
        const curriculos = rawCurriculos.filter((cv, index, self) =>
            index === self.findIndex((t) => t.id === cv.id)
        );

        const grid = document.querySelector(".resume-grid");
        if (!grid) return;

        // Salva o ícone SVG do card vazio original antes de limpar o grid
        const modeloEmpty = grid.querySelector(".resume-card.empty");
        const templateCardHTML = modeloEmpty ? modeloEmpty.innerHTML : "";

        // Limpa TODOS os cards fixos do HTML (os 2 originais) para não duplicar nada
        grid.innerHTML = "";

        // 1. Cria 1 card preenchido para cada currículo salvo
        curriculos.forEach((cv) => {
            const habilidadesTexto = Array.isArray(cv.habilidades)
                ? cv.habilidades.join(" • ")
                : (cv.habilidades || "");

            const article = document.createElement("article");
            article.className = "resume-card preenchido";
            article.innerHTML = `
                <button class="card-edit" aria-label="Editar currículo">
                    <a href="../HTML/editar-curriculo.html?id=${cv.id}">
                        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M25.3989 8.33731L28.6626 11.601M27.4971 5.4621L18.668 14.2912C18.2104 14.7458 17.899 15.3266 17.7738 15.9593L16.9583 20.0416L21.0406 19.2246C21.6727 19.0981 22.2523 18.7883 22.7087 18.3319L31.5378 9.50281C31.8031 9.23749 32.0136 8.92252 32.1572 8.57586C32.3007 8.22921 32.3747 7.85767 32.3747 7.48246C32.3747 7.10724 32.3007 6.7357 32.1572 6.38905C32.0136 6.0424 31.8031 5.72742 31.5378 5.4621C31.2725 5.19679 30.9575 4.98632 30.6108 4.84274C30.2642 4.69915 29.8927 4.62524 29.5174 4.62524C29.1422 4.62524 28.7707 4.69915 28.424 4.84274C28.0774 4.98632 27.7624 5.19679 27.4971 5.4621Z" stroke="#98AACA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M29.2916 23.1249V27.7499C29.2916 28.5677 28.9668 29.3519 28.3885 29.9302C27.8103 30.5084 27.026 30.8333 26.2083 30.8333H9.24996C8.43221 30.8333 7.64795 30.5084 7.06971 29.9302C6.49148 29.3519 6.16663 28.5677 6.16663 27.7499V10.7916C6.16663 9.97383 6.49148 9.18958 7.06971 8.61134C7.64795 8.0331 8.43221 7.70825 9.24996 7.70825H13.875" stroke="#98AACA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </a>
                </button>

                <div class="mini-resume-sheet">
                    <div class="mini-cv-header">
                        <h4>${cv.nome || "Sem Nome"}</h4>
                        <span class="mini-cv-cargo">${cv.cargo || "Cargo Alvo"}</span>
                        <small class="mini-cv-contato">${cv.contato || ""}</small>
                    </div>

                    <div class="mini-cv-section">
                        <strong>Resumo</strong>
                        <p>${cv.resumo || ""}</p>
                    </div>

                    <div class="mini-cv-section">
                        <strong>Experiência</strong>
                        <p>${cv.experiencia || ""}</p>
                    </div>

                    <div class="mini-cv-section">
                        <strong>Formação</strong>
                        <p>${cv.formacao || ""}</p>
                    </div>

                    <div class="mini-cv-section">
                        <strong>Habilidades</strong>
                        <p>${habilidadesTexto}</p>
                    </div>
                </div>
            `;

            grid.appendChild(article);
        });

        // 2. Adiciona APENAS UM card vazio ao final para criar novo currículo
        const cardVazioUnico = document.createElement("article");
        cardVazioUnico.className = "resume-card empty";
        cardVazioUnico.innerHTML = templateCardHTML;
        cardVazioUnico.style.cursor = "pointer";
        cardVazioUnico.addEventListener("click", () => {
            window.location.href = "../HTML/novo-curriculo.html";
        });
        grid.appendChild(cardVazioUnico);
    }

    atualizarTela(userName, userEmail);
    carregarCurriculosNoPerfil();

    if (btnSalvar) {
        btnSalvar.addEventListener("click", async () => {
            const novoNome = inputName.value.trim();
            const novoEmail = inputEmail.value.trim();

            if (!novoNome || !novoEmail) {
                alert("Preencha o nome e o e-mail.");
                return;
            }

            btnSalvar.disabled = true;
            btnSalvar.textContent = "Salvando...";

            try {
                const response = await fetch(`${window.API_BASE}/perfil/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: novoNome, email: novoEmail })
                });

                const dados = await response.json();

                if (!response.ok) {
                    throw new Error(dados.error || "Erro ao atualizar perfil");
                }

                localStorage.setItem("userName", novoNome);
                localStorage.setItem("userEmail", novoEmail);

                atualizarTela(novoNome, novoEmail);
                alert("Perfil atualizado com sucesso!");
            } catch (erro) {
                console.error(erro);
                alert(erro.message || "Falha ao atualizar o perfil.");
            } finally {
                btnSalvar.disabled = false;
                btnSalvar.textContent = "Salvar alterações";
            }
        });
    }
});