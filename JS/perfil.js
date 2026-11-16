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

    atualizarTela(userName, userEmail);

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