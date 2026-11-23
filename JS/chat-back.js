const API_URL = `${window.API_BASE}/ia`;
let historicoIA = [];
let arquivosAnexados = []; // Guarda os arquivos selecionados antes do envio

function alternarBloqueioChat(bloquear) {
    const input = document.getElementById("messageInput");
    const botaoEnviar = document.querySelector(".send-button");
    const botaoAdd = document.querySelector(".add-button");

    if (input) {
        input.disabled = bloquear;
        if (bloquear) {
            input.placeholder = "Aguarde a resposta da Lia...";
        } else {
            input.placeholder = "Pergunte qualquer coisa";
            input.focus();
        }
    }

    if (botaoEnviar) botaoEnviar.disabled = bloquear;
    if (botaoAdd) botaoAdd.disabled = bloquear;
}

/**
 * Renderiza a pré-visualização das fotos/arquivos dentro da barra de mensagem
 */
function atualizarPreviewAnexos() {
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
            img.src = URL.createObjectURL(arquivo);
            img.alt = arquivo.name;
            item.appendChild(img);
        } else {
            const tag = document.createElement("span");
            tag.classList.add("preview-file-tag");
            tag.textContent = `📄 ${arquivo.name}`;
            item.appendChild(tag);
        }

        const btnRemover = document.createElement("button");
        btnRemover.type = "button";
        btnRemover.classList.add("remove-preview-btn");
        btnRemover.textContent = "×";
        btnRemover.onclick = () => {
            arquivosAnexados.splice(index, 1);
            atualizarPreviewAnexos();
        };

        item.appendChild(btnRemover);
        previewContainer.appendChild(item);
    });
}

/**
 * Cria o balão do usuário na tela (com texto e/ou imagens)
 */
function renderizarMensagemUsuario(texto, arquivos = []) {
    const chat = document.getElementById("chat-messages");
    if (!chat) return;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message-bubble", "bubble-user");

    arquivos.forEach((arquivo) => {
        if (arquivo.type.startsWith("image/")) {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(arquivo);
            img.classList.add("chat-image");
            messageElement.appendChild(img);
        } else {
            const docInfo = document.createElement("div");
            docInfo.textContent = `📎 ${arquivo.name}`;
            docInfo.style.marginBottom = "6px";
            messageElement.appendChild(docInfo);
        }
    });

    if (texto) {
        const textoDiv = document.createElement("div");
        textoDiv.textContent = texto;
        messageElement.appendChild(textoDiv);
    }

    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
}

function renderizarRespostaLia(texto) {
    const chat = document.getElementById("chat-messages");
    if (!chat) return;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message-bubble", "bubble-ia");
    messageElement.textContent = texto;

    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
}

async function enviarParaIA(mensagemTexto, arquivos = []) {
    try {
        // Se o seu back-end esperar FormData para arquivos, você pode adaptar aqui.
        // Mantendo compatível com seu JSON atual:
        const textoCompleto = arquivos.length > 0
            ? `${mensagemTexto} [Arquivo anexado: ${arquivos.map(f => f.name).join(", ")}]`.trim()
            : mensagemTexto;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensagem: textoCompleto, historico: historicoIA })
        });

        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        const dados = await response.json();
        renderizarRespostaLia(dados.resposta);
        historicoIA = dados.historico;

    } catch (error) {
        console.error("Erro na API da IA:", error);
        renderizarRespostaLia('A Lia está temporariamente offline!');
    } finally {
        alternarBloqueioChat(false);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("messageInput");
    const botaoEnviar = document.querySelector(".send-button");
    const fileInput = document.getElementById("fileInput");
    const addMenu = document.getElementById("addMenu");

    // 0. Captura quando o usuário seleciona fotos/arquivos no explorador
    if (fileInput) {
        fileInput.addEventListener('change', (event) => {
            const novosArquivos = Array.from(event.target.files);
            if (novosArquivos.length > 0) {
                arquivosAnexados.push(...novosArquivos);
                atualizarPreviewAnexos();
            }
            // Fecha o menu "+ Anexar arquivo" e limpa o input para permitir selecionar o mesmo arquivo de novo
            if (addMenu) addMenu.classList.remove("show");
            fileInput.value = "";
        });
    }

    function processarEnvio() {
        if (!input || input.disabled) return;

        const mensagem = input.value.trim();
        if (!mensagem && arquivosAnexados.length === 0) return;

        const arquivosParaEnviar = [...arquivosAnexados];

        alternarBloqueioChat(true);
        renderizarMensagemUsuario(mensagem, arquivosParaEnviar);

        // Limpa texto e pré-visualização da barra
        input.value = "";
        input.style.height = '40px';
        arquivosAnexados = [];
        atualizarPreviewAnexos();

        enviarParaIA(mensagem, arquivosParaEnviar);
    }

    // 1. Controle do Enter
    if (input) {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                processarEnvio();
            }
        });

        // Expansão automática da barra
        input.addEventListener('input', function () {
            this.style.height = '40px';
            this.style.height = this.scrollHeight + 'px';
            this.style.overflowY = this.scrollHeight > 120 ? 'auto' : 'hidden';
        });
    }

    // 2. Controle do clique no botão Enviar
    if (botaoEnviar) {
        botaoEnviar.addEventListener('click', processarEnvio);
    }

    // 3. Mensagem inicial automática
    setTimeout(() => {
        renderizarRespostaLia("Olá! Eu sou a Lia, sua assistente virtual do Avalia!");
    }, 500);
});