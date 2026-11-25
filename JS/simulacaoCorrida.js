let arquivosAnexados = [];

function toggleMenu() {
    const addMenu = document.getElementById("addMenu");
    if (addMenu) {
        addMenu.classList.toggle("show");
    }
}

document.addEventListener("click", function (event) {
    const addMenu = document.getElementById("addMenu");
    const addBtn = event.target.closest(".add-button");
    if (!addMenu) return;

    if (!addMenu.contains(event.target) && !addBtn) {
        addMenu.classList.remove("show");
    }
});

function atualizarPreview() {
    const previewContainer = document.getElementById("previewContainer");
    if (!previewContainer) return;

    previewContainer.innerHTML = "";

    if (arquivosAnexados.length === 0) {
        previewContainer.classList.remove("has-files");
        return;
    }

    previewContainer.classList.add("has-files");

    arquivosAnexados.forEach((arquivo, index) => {
        const item = document.createElement("div");
        item.classList.add("preview-item");

        if (arquivo.type.startsWith("image/")) {
            const img = document.createElement("img");
            const reader = new FileReader();
            reader.onload = (e) => {
                img.src = e.target.result;
            };
            reader.readAsDataURL(arquivo);
            img.alt = arquivo.name;
            item.appendChild(img);
        } else {
            const tag = document.createElement("span");
            tag.classList.add("preview-file-tag");
            tag.textContent = `📄 ${arquivo.name}`;
            item.appendChild(tag);
        }

        const btnRemoverReal = document.createElement("button");
        btnRemoverReal.type = "button";
        btnRemoverReal.classList.add("remove-preview-btn");
        btnRemoverReal.textContent = "×";
        btnRemoverReal.onclick = (e) => {
            e.stopPropagation();
            arquivosAnexados.splice(index, 1);
            atualizarPreview();
        };

        item.appendChild(btnRemoverReal);
        previewContainer.appendChild(item);
    });
}

document.addEventListener("DOMContentLoaded", async function () {
    const chatContainer = document.getElementById("chat-messages");
    const inputMsg = document.getElementById("messageInput");
    const sendBtn = document.querySelector(".send-button");
    const fileInput = document.getElementById("fileInput");
    const addMenu = document.getElementById("addMenu");

    let passoAtual = 1;

    const configSalva = localStorage.getItem("entrevista_config");
    if (!configSalva) {
        alert("Nenhuma configuração encontrada! Redirecionando...");
        window.location.href = "../HTML/simulacao.html";
        return;
    }

    const config = JSON.parse(configSalva);
    const totalPassos = config.totalPerguntas || 5;
    let historico = [];

    atualizarProgresso();

    if (fileInput) {
        fileInput.addEventListener("change", function (event) {
            if (addMenu) addMenu.classList.remove("show");

            const novos = Array.from(event.target.files);
            if (novos.length > 0) {
                arquivosAnexados.push(...novos);
                atualizarPreview();
            }
            fileInput.value = "";
        });
    }

    if (inputMsg) {
        inputMsg.addEventListener("keydown", function (e) {
            if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                processarEnvio();
            }
        });

        inputMsg.addEventListener("input", function () {
            this.style.height = "40px";
            this.style.height = this.scrollHeight + "px";
            this.style.overflowY = this.scrollHeight > 120 ? "auto" : "hidden";
        });
    }

    function atualizarProgresso() {
        const stepCount = document.querySelector(".step-count");
        const progressBarFill = document.querySelector(".progress-bar-fill");

        if (stepCount && progressBarFill) {
            stepCount.innerHTML = `<strong>${passoAtual}</strong> de ${totalPassos}`;
            const porcentagem = (passoAtual / totalPassos) * 100;
            progressBarFill.style.width = `${porcentagem}%`;
        }
    }

    async function enviarParaIA(mensagemTexto, arquivos = []) {
        try {
            const textoParaAPI = arquivos.length > 0
                ? `${mensagemTexto} [Arquivo anexado: ${arquivos.map(f => f.name).join(", ")}]`.trim()
                : mensagemTexto;

            const response = await fetch(`${window.API_BASE}/ia/simulacao`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mensagem: textoParaAPI,
                    historico: historico,
                    config: config,
                    passoAtual: passoAtual
                })
            });

            if (!response.ok) throw new Error("Erro na comunicação com o servidor.");

            const data = await response.json();
            if (data.historicoAtualizado) {
                historico = data.historicoAtualizado;
            }

            return data;
        } catch (error) {
            console.error(error);
            return {
                texto: "Erro na comunicação com a Lia. Verifique se o servidor backend está ligado!",
                respostaValida: false,
                concluida: false
            };
        }
    }

    function adicionarMensagemNoChat(tipo, texto, arquivos = []) {
        if (!chatContainer) return;

        const div = document.createElement("div");
        div.classList.add("message-bubble", tipo === "bot" ? "bubble-ia" : "bubble-user");

        arquivos.forEach((arquivo) => {
            if (arquivo.type.startsWith("image/")) {
                const img = document.createElement("img");
                img.classList.add("chat-image");
                const reader = new FileReader();
                reader.onload = (e) => {
                    img.src = e.target.result;
                    chatContainer.scrollTop = chatContainer.scrollHeight;
                };
                reader.readAsDataURL(arquivo);
                div.appendChild(img);
            } else {
                const docInfo = document.createElement("div");
                docInfo.textContent = `📎 ${arquivo.name}`;
                docInfo.style.marginBottom = "6px";
                div.appendChild(docInfo);
            }
        });

        if (texto) {
            const textoDiv = document.createElement("div");
            textoDiv.textContent = texto;
            div.appendChild(textoDiv);
        }

        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    window.processarEnvio = async function () {
        const texto = inputMsg.value.trim();
        if (!texto && arquivosAnexados.length === 0) return;

        const arquivosParaEnviar = [...arquivosAnexados];

        inputMsg.disabled = true;
        if (sendBtn) sendBtn.disabled = true;

        adicionarMensagemNoChat("user", texto, arquivosParaEnviar);
        inputMsg.value = "";
        inputMsg.style.height = "40px";
        arquivosAnexados = [];
        atualizarPreview();

        try {
            const resultado = await enviarParaIA(texto, arquivosParaEnviar);

            if (resultado.respostaValida && passoAtual < totalPassos) {
                passoAtual++;
                atualizarProgresso();
            }

            const respostaLia = resultado.texto || resultado.resposta || "Sem resposta da Lia.";
            adicionarMensagemNoChat("bot", respostaLia);

            if (resultado.concluida || resultado.relatorio) {
                if (resultado.relatorio) {
                    localStorage.setItem("devolutiva_resultado", JSON.stringify(resultado.relatorio));
                }
                setTimeout(() => {
                    window.location.href = "../HTML/devolutiva.html";
                }, 2500);
            }
        } catch (error) {
            console.error("Erro no processamento:", error);
        } finally {
            inputMsg.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            inputMsg.focus();
        }
    };

    if (sendBtn) {
        sendBtn.addEventListener("click", window.processarEnvio);
    }

    const inicio = await enviarParaIA("INICIAR_ENTREVISTA");
    const mensagemInicial = inicio.texto || inicio.resposta || "Olá! Vamos começar a sua entrevista.";
    adicionarMensagemNoChat("bot", mensagemInicial);
});