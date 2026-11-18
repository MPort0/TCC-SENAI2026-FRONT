document.addEventListener("DOMContentLoaded", function () {
    const chat = document.querySelector(".chat-panel");
    const input = document.getElementById("replyInput");
    const continueBtn = document.getElementById("continueBtn");

    const params = new URLSearchParams(window.location.search);
    const editId = params.get("id");
    const isPaginaEditar = window.location.pathname.includes("editar-curriculo.html");

    // Proteção: só permite acessar editar-curriculo.html com um ?id= vindo do Perfil
    if (isPaginaEditar && !editId) {
        window.location.href = "../HTML/perfil.html";
        return;
    }

    const modoEdicao = Boolean(editId);
    let curriculoSalvo = false;
    let processando = false;

    const dadosCurriculo = {
        nome: "",
        cargo: "",
        contato: "",
        resumo: "",
        experiencia: "",
        formacao: "",
        habilidades: []
    };

    const historicoConversa = [];

    function atualizarTodaPrevia(dados) {
        if (dados.nome) {
            dadosCurriculo.nome = dados.nome;
            const el = document.getElementById("preview-nome");
            if (el) el.innerText = dados.nome;
        }
        if (dados.cargo) {
            dadosCurriculo.cargo = dados.cargo;
            const el = document.getElementById("preview-cargo");
            if (el) el.innerText = dados.cargo;
        }
        if (dados.contato) {
            dadosCurriculo.contato = dados.contato;
            const el = document.getElementById("preview-contato");
            if (el) el.innerText = dados.contato;
        }
        if (dados.resumo) {
            dadosCurriculo.resumo = dados.resumo;
            const el = document.getElementById("preview-resumo");
            if (el) el.innerText = dados.resumo;
        }
        if (dados.experiencia) {
            dadosCurriculo.experiencia = dados.experiencia;
            const el = document.getElementById("preview-exp-desc");
            if (el) el.innerText = dados.experiencia;
        }
        if (dados.formacao) {
            dadosCurriculo.formacao = dados.formacao;
            const el = document.getElementById("preview-curso");
            if (el) el.innerText = dados.formacao;
        }
        if (Array.isArray(dados.habilidades) && dados.habilidades.length > 0) {
            dadosCurriculo.habilidades = dados.habilidades;
            const container = document.getElementById("preview-habilidades");
            if (container) {
                container.innerHTML = "";
                dados.habilidades.forEach(item => {
                    if (item && item.trim()) {
                        const tag = document.createElement("span");
                        tag.classList.add("tag");
                        tag.innerText = item.trim();
                        container.appendChild(tag);
                    }
                });
            }
        }
    }

    // Inicializa em Modo Edição ou Modo Criação
    if (modoEdicao) {
        const userId = localStorage.getItem("userId") || "default";
        const chaveStorage = `curriculos_${userId}`;
        const lista = JSON.parse(localStorage.getItem(chaveStorage)) || [];
        const curriculoEncontrado = lista.find(c => String(c.id) === String(editId));

        if (!curriculoEncontrado) {
            window.location.href = "../HTML/perfil.html";
            return;
        }

        atualizarTodaPrevia(curriculoEncontrado);

        const msgInicialHTML = `Olá! Carreguei o currículo de <strong>${dadosCurriculo.nome || "candidato"}</strong> aqui ao lado.<br><strong>Quais informações você deseja editar?</strong>`;
        const primeiraMsgDiv = chat.querySelector(".message");
        if (primeiraMsgDiv) primeiraMsgDiv.innerHTML = msgInicialHTML;

        historicoConversa.push({
            role: "assistant",
            content: "Olá! Carreguei o seu currículo aqui ao lado. Quais informações você deseja editar?"
        });
    } else {
        historicoConversa.push({
            role: "assistant",
            content: "Olá! Vou te ajudar a criar um currículo profissional. Qual é o seu nome completo?"
        });
    }

    function adicionarMensagem(tipo, texto) {
        const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
        const replyBox = chat.querySelector(".reply");

        if (tipo === "bot") {
            const chatTop = document.createElement("div");
            chatTop.classList.add("chat-top");
            chatTop.innerHTML = `<span class="ai-icon"><img src="../IMG/favicon.ico" width="20" height="20"></span><span>Ava.Lia <small>${hora}</small></span>`;
            chat.insertBefore(chatTop, replyBox);
        }

        const msg = document.createElement("div");
        msg.classList.add("message");
        if (tipo === "user") msg.classList.add("user");
        msg.innerHTML = texto;

        const horario = document.createElement("span");
        horario.classList.add("time");
        horario.textContent = (tipo === "user" ? "Você " : "") + hora;

        chat.insertBefore(msg, replyBox);
        chat.insertBefore(horario, replyBox);

        chat.scrollTop = chat.scrollHeight;
        return msg;
    }

    function salvarOuAtualizarNoPerfil() {
        const userId = localStorage.getItem("userId") || "default";
        const chaveStorage = `curriculos_${userId}`;
        const listaCurriculos = JSON.parse(localStorage.getItem(chaveStorage)) || [];

        if (modoEdicao) {
            const index = listaCurriculos.findIndex(c => String(c.id) === String(editId));
            if (index !== -1) {
                listaCurriculos[index] = {
                    ...listaCurriculos[index],
                    ...dadosCurriculo,
                    atualizadoEm: new Date().toLocaleDateString("pt-BR")
                };
                localStorage.setItem(chaveStorage, JSON.stringify(listaCurriculos));
            }
            curriculoSalvo = true;
            return;
        }

        if (curriculoSalvo) {
            const ultimoIndex = listaCurriculos.length - 1;
            if (ultimoIndex >= 0) {
                listaCurriculos[ultimoIndex] = { ...listaCurriculos[ultimoIndex], ...dadosCurriculo };
                localStorage.setItem(chaveStorage, JSON.stringify(listaCurriculos));
            }
            return;
        }

        curriculoSalvo = true;
        listaCurriculos.push({
            id: Date.now(),
            criadoEm: new Date().toLocaleDateString("pt-BR"),
            ...dadosCurriculo
        });
        localStorage.setItem(chaveStorage, JSON.stringify(listaCurriculos));
    }

    async function enviarMensagem() {
        const texto = input.value.trim();
        if (!texto || processando) {
            input.focus();
            return;
        }

        processando = true;
        input.disabled = true;
        continueBtn.disabled = true;

        adicionarMensagem("user", texto);
        historicoConversa.push({ role: "user", content: texto });
        input.value = "";

        const msgDigitando = adicionarMensagem("bot", "<i>Ava.Lia está escrevendo...</i>");

        try {
            const response = await fetch(`${window.API_BASE}/ia/curriculo-conversa`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mensagem: texto,
                    dadosAtuais: dadosCurriculo,
                    historico: historicoConversa,
                    modoEdicao: modoEdicao
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.erro || data.error || "Falha na resposta da IA");
            }

            if (data.dadosAtualizados) {
                atualizarTodaPrevia(data.dadosAtualizados);
            }

            msgDigitando.innerHTML = data.respostaBot;
            historicoConversa.push({ role: "assistant", content: data.respostaBot });

            if (data.concluido || modoEdicao) {
                salvarOuAtualizarNoPerfil();
            }

        } catch (error) {
            console.error("Erro ao conversar com a IA:", error);
            msgDigitando.innerHTML = "Ops, tive uma instabilidade de conexão. Pode repetir?";
        } finally {
            processando = false;
            input.disabled = false;
            continueBtn.disabled = false;
            input.focus();
        }
    }

    if (continueBtn) {
        continueBtn.addEventListener("click", enviarMensagem);
    }

    if (input) {
        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                enviarMensagem();
            }
        });
    }
});