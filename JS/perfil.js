document.addEventListener("DOMContentLoaded", async () => {
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
    const avatarPerfil = document.getElementById("avatar-perfil") || document.querySelector(".avatar");
    const inputFoto = document.getElementById("input-foto-perfil");
    const btnEditarFoto = document.getElementById("btn-editar-foto");

    const sidebarNome = document.querySelector(".user-nome");
    const sidebarEmail = document.querySelector(".user-email");

    function renderizarAvatar(container, fotoBase64, nome) {
        if (!container) return;
        if (fotoBase64) {
            container.innerHTML = `<img src="${fotoBase64}" alt="Foto de perfil" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;">`;
        } else {
            container.textContent = nome ? nome.charAt(0).toUpperCase() : "U";
        }
    }

    function atualizarTela(nome, email, foto = null) {
        if (inputName) inputName.value = nome || "";
        if (inputEmail) inputEmail.value = email || "";

        const primeiroNome = nome ? nome.split(" ")[0] : "usuário";

        if (headerUserName && headerUserName.firstChild) {
            headerUserName.firstChild.textContent = `${nome} `;
        }

        renderizarAvatar(avatarPerfil, foto, nome);

        if (sidebarNome) sidebarNome.textContent = `Olá, ${primeiroNome}!`;
        if (sidebarEmail) sidebarEmail.textContent = email || "";

        if (foto && typeof aplicarFotoNaSidebar === "function") {
            aplicarFotoNaSidebar(foto);
        }
    }

    // Abre o seletor de arquivos do dispositivo ao clicar na foto ou no ícone
    if (avatarPerfil && inputFoto) {
        avatarPerfil.addEventListener("click", () => inputFoto.click());
    }
    if (btnEditarFoto && inputFoto) {
        btnEditarFoto.addEventListener("click", () => inputFoto.click());
    }

    // Quando o usuário escolhe uma imagem do dispositivo
    if (inputFoto) {
        inputFoto.addEventListener("change", (event) => {
            const arquivo = event.target.files[0];
            if (!arquivo) return;

            if (!arquivo.type.startsWith("image/")) {
                alert("Selecione um arquivo de imagem válido (JPG, PNG, etc.).");
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = async () => {
                    // Redimensiona para 250x250px (recorte quadrado centralizado) para ficar leve no banco
                    const canvas = document.createElement("canvas");
                    const tamanho = 250;
                    canvas.width = tamanho;
                    canvas.height = tamanho;

                    const menorLado = Math.min(img.width, img.height);
                    const sx = (img.width - menorLado) / 2;
                    const sy = (img.height - menorLado) / 2;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, sx, sy, menorLado, menorLado, 0, 0, tamanho, tamanho);

                    const fotoBase64 = canvas.toDataURL("image/jpeg", 0.85);

                    try {
                        const resp = await fetch(`${window.API_BASE}/users/${userId}/foto`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ foto: fotoBase64 })
                        });

                        if (!resp.ok) {
                            throw new Error("Erro ao salvar foto no banco.");
                        }

                        renderizarAvatar(avatarPerfil, fotoBase64, inputName?.value || userName);
                        if (typeof aplicarFotoNaSidebar === "function") {
                            aplicarFotoNaSidebar(fotoBase64);
                        }
                    } catch (erro) {
                        console.error(erro);
                        alert("Não foi possível salvar a foto no servidor.");
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(arquivo);
            inputFoto.value = "";
        });
    }

    function baixarCurriculoPDF(cv) {
        const habilidadesArray = Array.isArray(cv.habilidades)
            ? cv.habilidades
            : (cv.habilidades ? cv.habilidades.split(",").map(h => h.trim()) : []);

        const habilidadesHTML = habilidadesArray
            .filter(Boolean)
            .map(h => `<span style="display:inline-block; background:#eef2ff; color:#3b5998; padding:4px 10px; border-radius:12px; font-size:12px; margin:3px 5px 3px 0;">${h}</span>`)
            .join("");

        const wrapper = document.createElement("div");
        wrapper.style.position = "fixed";
        wrapper.style.left = "0";
        wrapper.style.top = "0";
        wrapper.style.width = "794px";
        wrapper.style.background = "#ffffff";
        wrapper.style.zIndex = "-1";
        wrapper.style.pointerEvents = "none";

        wrapper.innerHTML = `
            <div id="pdf-curriculo-render" style="font-family: 'Poppins', Arial, sans-serif; color: #1e293b; padding: 40px 44px; line-height: 1.55; background: #ffffff; width: 794px; box-sizing: border-box;">
                <header style="border-bottom: 2px solid #5F7FBF; padding-bottom: 14px; margin-bottom: 22px;">
                    <h1 style="margin: 0; font-size: 26px; color: #0f172a;">${cv.nome || "Sem Nome"}</h1>
                    <p style="margin: 4px 0; font-size: 16px; font-weight: 600; color: #5F7FBF;">${cv.cargo || ""}</p>
                    <p style="margin: 0; font-size: 12.5px; color: #64748b;">${cv.contato || ""}</p>
                </header>

                <section style="margin-bottom: 20px;">
                    <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.6px; color: #5F7FBF; margin: 0 0 6px 0;">Resumo Profissional</h2>
                    <p style="margin: 0; font-size: 13px; color: #334155;">${cv.resumo || ""}</p>
                </section>

                <section style="margin-bottom: 20px;">
                    <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.6px; color: #5F7FBF; margin: 0 0 6px 0;">Experiência Profissional</h2>
                    <p style="margin: 0; font-size: 13px; color: #334155; white-space: pre-line;">${cv.experiencia || ""}</p>
                </section>

                <section style="margin-bottom: 20px;">
                    <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.6px; color: #5F7FBF; margin: 0 0 6px 0;">Formação Acadêmica</h2>
                    <p style="margin: 0; font-size: 13px; color: #334155; white-space: pre-line;">${cv.formacao || ""}</p>
                </section>

                <section>
                    <h2 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.6px; color: #5F7FBF; margin: 0 0 8px 0;">Habilidades</h2>
                    <div>${habilidadesHTML}</div>
                </section>
            </div>
        `;

        document.body.appendChild(wrapper);

        const elemento = wrapper.querySelector("#pdf-curriculo-render");
        const nomeArquivo = `Curriculo_${(cv.nome || "Candidato").replace(/\s+/g, "_")}.pdf`;

        const opcoes = {
            margin: 0,
            filename: nomeArquivo,
            image: { type: "jpeg", quality: 0.98 },
            html2canvas: {
                scale: 2,
                useCORS: true,
                scrollX: 0,
                scrollY: 0,
                x: 0,
                y: 0,
                windowWidth: 794
            },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
        };

        html2pdf()
            .set(opcoes)
            .from(elemento)
            .save()
            .then(() => document.body.removeChild(wrapper))
            .catch(() => {
                if (document.body.contains(wrapper)) document.body.removeChild(wrapper);
            });
    }

    async function carregarCurriculosNoPerfil() {
        const grid = document.querySelector(".resume-grid");
        if (!grid) return;

        const modeloEmpty = grid.querySelector(".resume-card.empty");
        const templateCardHTML = modeloEmpty ? modeloEmpty.innerHTML : "";
        grid.innerHTML = "";

        try {
            const response = await fetch(`${window.API_BASE}/curriculos/${userId}`);
            if (!response.ok) {
                throw new Error(`Erro HTTP ${response.status} ao buscar currículos.`);
            }
            const curriculos = await response.json();

            curriculos.forEach((cv) => {
                const habilidadesTexto = Array.isArray(cv.habilidades)
                    ? cv.habilidades.join(" • ")
                    : (cv.habilidades || "");

                const article = document.createElement("article");
                article.className = "resume-card preenchido";
                article.innerHTML = `
                    <div class="card-actions">
                        <button type="button" class="card-pdf" aria-label="Baixar currículo em PDF" title="Baixar PDF">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#98AACA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="7 10 12 15 17 10" />
                                <line x1="12" y1="15" x2="12" y2="3" />
                            </svg>
                        </button>

                        <button class="card-edit" aria-label="Editar currículo" title="Editar currículo">
                            <a href="../HTML/editar-curriculo.html?id=${cv.id}">
                                <svg width="20" height="20" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M25.3989 8.33731L28.6626 11.601M27.4971 5.4621L18.668 14.2912C18.2104 14.7458 17.899 15.3266 17.7738 15.9593L16.9583 20.0416L21.0406 19.2246C21.6727 19.0981 22.2523 18.7883 22.7087 18.3319L31.5378 9.50281C31.8031 9.23749 32.0136 8.92252 32.1572 8.57586C32.3007 8.22921 32.3747 7.85767 32.3747 7.48246C32.3747 7.10724 32.3007 6.7357 32.1572 6.38905C32.0136 6.0424 31.8031 5.72742 31.5378 5.4621C31.2725 5.19679 30.9575 4.98632 30.6108 4.84274C30.2642 4.69915 29.8927 4.62524 29.5174 4.62524C29.1422 4.62524 28.7707 4.69915 28.424 4.84274C28.0774 4.98632 27.7624 5.19679 27.4971 5.4621Z" stroke="#98AACA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M29.2916 23.1249V27.7499C29.2916 28.5677 28.9668 29.3519 28.3885 29.9302C27.8103 30.5084 27.026 30.8333 26.2083 30.8333H9.24996C8.43221 30.8333 7.64795 30.5084 7.06971 29.9302C6.49148 29.3519 6.16663 28.5677 6.16663 27.7499V10.7916C6.16663 9.97383 6.49148 9.18958 7.06971 8.61134C7.64795 8.0331 8.43221 7.70825 9.24996 7.70825H13.875" stroke="#98AACA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </a>
                        </button>

                        <button type="button" class="card-delete" aria-label="Excluir currículo" title="Excluir currículo">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                <line x1="10" y1="11" x2="10" y2="17" />
                                <line x1="14" y1="11" x2="14" y2="17" />
                            </svg>
                        </button>
                    </div>

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

                const btnPdf = article.querySelector(".card-pdf");
                if (btnPdf) {
                    btnPdf.addEventListener("click", (e) => {
                        e.stopPropagation();
                        baixarCurriculoPDF(cv);
                    });
                }

                const btnDelete = article.querySelector(".card-delete");
                if (btnDelete) {
                    btnDelete.addEventListener("click", async (e) => {
                        e.stopPropagation();
                        const confirmar = confirm(`Deseja realmente excluir o currículo de "${cv.nome || "Sem Nome"}"?`);
                        if (!confirmar) return;

                        try {
                            const delResp = await fetch(`${window.API_BASE}/curriculos/${cv.id}`, {
                                method: "DELETE"
                            });
                            if (!delResp.ok) throw new Error("Erro ao excluir currículo.");
                            carregarCurriculosNoPerfil();
                        } catch (err) {
                            console.error(err);
                            alert("Não foi possível excluir o currículo.");
                        }
                    });
                }

                grid.appendChild(article);
            });
        } catch (erro) {
            console.error("Falha ao carregar currículos do banco:", erro);
        }

        const cardVazioUnico = document.createElement("article");
        cardVazioUnico.className = "resume-card empty";
        cardVazioUnico.innerHTML = templateCardHTML;
        cardVazioUnico.style.cursor = "pointer";
        cardVazioUnico.addEventListener("click", () => {
            window.location.href = "../HTML/novo-curriculo.html";
        });
        grid.appendChild(cardVazioUnico);
    }

    // Carrega dados iniciais e busca a foto salva no banco de dados
    atualizarTela(userName, userEmail, null);
    try {
        const respUser = await fetch(`${window.API_BASE}/users/${userId}`);
        if (respUser.ok) {
            const usuarioBanco = await respUser.json();
            atualizarTela(usuarioBanco.name || userName, usuarioBanco.email || userEmail, usuarioBanco.foto);
        }
    } catch (e) {
        console.error("Erro ao buscar foto do usuário:", e);
    }

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

                atualizarTela(novoNome, novoEmail, dados.foto || null);
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