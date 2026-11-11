document.addEventListener("DOMContentLoaded", function () {
    const chat = document.querySelector(".chat-panel");
    const input = document.getElementById("replyInput");
    const continueBtn = document.getElementById("continueBtn");
    const useBtn = document.getElementById("useBtn");
    const suggestionText = document.getElementById("suggestionText");
    const suggestionBox = document.querySelector(".suggestion");

    let passoAtual = 0;
    let sugestaoIA = "";

    const dadosCurriculo = {
        nome: "",
        cargo: "",
        contato: "",
        resumo: "",
        experiencia: "",
        formacao: "",
        habilidades: []
    };

    const perguntasIA = [
        { chave: "nome", pergunta: "Qual é o seu <strong>nome completo</strong>?" },
        { chave: "cargo", pergunta: "Qual <strong>cargo ou área</strong> você está buscando? (ex: Desenvolvedor Front-end)" },
        { chave: "contato", pergunta: "Informe seu <strong>e-mail e telefone/cidade</strong> para o cabeçalho:" },
        { chave: "experiencia", pergunta: "Me conte um pouco sobre sua <strong>última experiência profissional</strong> de forma livre (onde trabalhou e o que fazia):" },
        { chave: "formacao", pergunta: "Qual é a sua <strong>formação acadêmica</strong>? (Curso, Instituição e Ano)" },
        { chave: "habilidades", pergunta: "Quais são suas principais <strong>habilidades técnicas</strong>? (Separe por vírgulas, ex: HTML, CSS, JavaScript, Git)" }
    ];

    function adicionarMensagem(tipo, texto) {
        const hora = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

        if (tipo === "bot") {
            const chatTop = document.createElement("div");
            chatTop.classList.add("chat-top");
            chatTop.innerHTML = `<span class="ai-icon"><img src="../IMG/favicon.ico" width="20" height="20"></span><span>Ava.Lia <small>${hora}</small></span>`;
            if (suggestionBox) chat.insertBefore(chatTop, suggestionBox);
            else chat.appendChild(chatTop);
        }

        const msg = document.createElement("div");
        msg.classList.add("message");
        if (tipo === "user") msg.classList.add("user");
        msg.innerHTML = texto;

        const horario = document.createElement("span");
        horario.classList.add("time");
        horario.textContent = (tipo === "user" ? "Você " : "") + hora;

        if (suggestionBox) {
            chat.insertBefore(msg, suggestionBox);
            chat.insertBefore(horario, suggestionBox);
        } else {
            chat.appendChild(msg);
            chat.appendChild(horario);
        }

        chat.scrollTop = chat.scrollHeight;
    }

    function atualizarPrevia(chave, valor) {
        if (chave === "nome") {
            const el = document.getElementById("preview-nome");
            if (el) el.innerText = valor;
        } else if (chave === "cargo") {
            const el = document.getElementById("preview-cargo");
            if (el) el.innerText = valor;
        } else if (chave === "contato") {
            const el = document.getElementById("preview-contato");
            if (el) el.innerText = valor;
        } else if (chave === "resumo") {
            const el = document.getElementById("preview-resumo");
            if (el) el.innerText = valor;
        } else if (chave === "experiencia") {
            const el = document.getElementById("preview-exp-desc");
            if (el) el.innerText = valor;
        } else if (chave === "formacao") {
            const el = document.getElementById("preview-curso");
            if (el) el.innerText = valor;
        } else if (chave === "habilidades") {
            const container = document.getElementById("preview-habilidades");
            if (container) {
                container.innerHTML = "";
                const lista = valor.split(",");
                lista.forEach(item => {
                    if (item.trim()) {
                        const tag = document.createElement("span");
                        tag.classList.add("tag");
                        tag.innerText = item.trim();
                        container.appendChild(tag);
                    }
                });
            }
        }
    }

    async function enviarMensagem() {
        const texto = input.value.trim();
        if (!texto) {
            input.focus();
            return;
        }

        adicionarMensagem("user", texto);
        input.value = "";
        if (suggestionBox) suggestionBox.style.display = "none";

        const passoAtualInfo = perguntasIA[passoAtual];

        // Usa a window.API_BASE que veio do ipback.js
        if (passoAtualInfo && passoAtualInfo.chave === "experiencia") {
            adicionarMensagem("bot", "<i>Aguarde um momento, a Lia está otimizando a sua experiência...</i>");

            try {
                const response = await fetch(`${window.API_BASE}/ia/curriculo`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        cargo: dadosCurriculo.cargo || "Geral",
                        texto: texto
                    })
                });

                const data = await response.json();

                if (data.resumoOtimizado) {
                    sugestaoIA = data.resumoOtimizado;
                    dadosCurriculo.resumo = data.resumoOtimizado;
                    atualizarPrevia("resumo", data.resumoOtimizado);

                    if (suggestionText && suggestionBox) {
                        suggestionText.innerText = data.resumoOtimizado;
                        suggestionBox.style.display = "block";
                    }
                }

                if (data.topicosExperiencia && data.topicosExperiencia.length > 0) {
                    const textoFormatado = "• " + data.topicosExperiencia.join("\n• ");
                    dadosCurriculo.experiencia = textoFormatado;
                    atualizarPrevia("experiencia", textoFormatado);
                }

            } catch (error) {
                console.error("Erro ao comunicar com a IA do currículo:", error);
                dadosCurriculo.resumo = texto;
                dadosCurriculo.experiencia = texto;
                atualizarPrevia("resumo", texto);
                atualizarPrevia("experiencia", texto);
            }

        } else if (passoAtualInfo) {
            dadosCurriculo[passoAtualInfo.chave] = texto;
            atualizarPrevia(passoAtualInfo.chave, texto);
        }

        passoAtual++;

        if (passoAtual < perguntasIA.length) {
            setTimeout(() => {
                const proxima = perguntasIA[passoAtual];
                adicionarMensagem("bot", proxima.pergunta);
            }, 500);
        } else {
            setTimeout(() => {
                adicionarMensagem("bot", "🎉 <strong>Pronto!</strong> O seu currículo foi montado. Pode rever os dados na prévia ao lado!");
            }, 500);
        }

        input.focus();
    }

    if (useBtn && suggestionText && input) {
        useBtn.addEventListener("click", () => {
            if (sugestaoIA) {
                input.value = sugestaoIA;
                input.focus();
            }
        });
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