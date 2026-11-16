document.addEventListener("DOMContentLoaded", () => {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (!userName) return;

    // Pega apenas o primeiro nome (ex: "Arthur Silva" -> "Arthur")
    // Se quiser o nome completo, basta usar 'userName' direto no lugar de 'primeiroNome'
    const primeiroNome = userName.split(" ")[0];

    // 1. Atualiza o card da sidebar (em todas as páginas)
    const sidebarNome = document.querySelector(".user-nome");
    const sidebarEmail = document.querySelector(".user-email");
    if (sidebarNome) sidebarNome.textContent = `Olá, ${primeiroNome}!`;
    if (sidebarEmail && userEmail) sidebarEmail.textContent = userEmail;

    const homeTitulo = document.querySelector(".header h1");
    if (homeTitulo && homeTitulo.textContent.includes("Olá")) {
        homeTitulo.textContent = `Olá, ${primeiroNome}!`;
    }
});