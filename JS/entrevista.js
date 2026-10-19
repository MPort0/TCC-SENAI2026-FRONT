function sendMessage() {

    const input = document.getElementById("messageInput");
    const chat = document.getElementById("chat");

    const message = input.value.trim();

    if (message === "") {
        return;
    }

    const messageElement = document.createElement("div");

    messageElement.classList.add("user-message");

    messageElement.textContent = message;

    chat.appendChild(messageElement);

    input.value = "";

    chat.scrollTop = chat.scrollHeight;
}

function toggleMenu() {
    const menu = document.getElementById("addMenu");

    menu.classList.toggle("show");
}

function attachFile() {
    const input = document.createElement("input");
    input.type = "file";

    input.accept = "image/*,.pdf,.doc,.docx,.txt"; // Tipos de arquivos permitidos

    input.click();
}

const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", function () {

    const arquivos = this.files;

    if (arquivos.length === 0) {
        return;
    }

    for (const arquivo of arquivos) {
        console.log("Arquivo selecionado:", arquivo.name);
    }
});

fileInput.addEventListener("change", function () {

    const arquivos = this.files;
    const chat = document.getElementById("chat");

    for (const arquivo of arquivos) {

        // Verifica se é uma imagem
        if (arquivo.type.startsWith("image/")) {

            const imagem = document.createElement("img");

            imagem.src = URL.createObjectURL(arquivo);
            imagem.classList.add("chat-image");

            chat.appendChild(imagem);

        } else {

            // Para outros arquivos, mostra apenas o nome
            const mensagem = document.createElement("div");

            mensagem.classList.add("file-message");
            mensagem.textContent = "📎 " + arquivo.name;

            chat.appendChild(mensagem);
        }
    }

    // Permite selecionar o mesmo arquivo novamente depois
    this.value = "";
});