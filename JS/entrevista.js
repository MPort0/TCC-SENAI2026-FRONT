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

function attachImage() {

    const input = document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.onchange = function () {

        const arquivo = input.files[0];

        if (!arquivo) {
            return;
        }

        const chat = document.getElementById("chat");

        const messageElement = document.createElement("div");
        messageElement.classList.add("image-message");

        const imagem = document.createElement("img");

        imagem.src = URL.createObjectURL(arquivo);
        imagem.classList.add("chat-image");

        messageElement.appendChild(imagem);
        chat.appendChild(messageElement);

        chat.scrollTop = chat.scrollHeight;
    };

    input.click();
}

const fileInput = document.getElementById("fileInput");

fileInput.addEventListener("change", function () {

    const arquivos = this.files;
    const chat = document.getElementById("chat");

    for (const arquivo of arquivos) {

        if (arquivo.type.startsWith("image/")) {

            const messageElement = document.createElement("div");
            messageElement.classList.add("image-message");

            const imagem = document.createElement("img");

            imagem.src = URL.createObjectURL(arquivo);
            imagem.classList.add("chat-image");

            messageElement.appendChild(imagem);
            chat.appendChild(messageElement);

        } else {

            const mensagem = document.createElement("div");

            mensagem.classList.add("user-message");
            mensagem.textContent = "📎 " + arquivo.name;

            chat.appendChild(mensagem);
        }
    }

    this.value = "";

    chat.scrollTop = chat.scrollHeight;
});