// document.addEventListener('DOMContentLoaded', () => {
//   const btnSidebar = document.getElementById('btn-sidebar');
//   const sidebar = document.querySelector('.sidebar');

//   if (btnSidebar && sidebar) {
//     btnSidebar.addEventListener('click', () => {
//       sidebar.classList.toggle('collapsed');
//     });
//   }
// });


function atualizarSidebarAtiva() {
    const paginaAtual = decodeURIComponent(
        window.location.pathname.split("/").pop()
    ).toLowerCase();

    const itensSidebar = document.querySelectorAll(
        ".sidebar .nav-section .nav-item"
    );

    itensSidebar.forEach(item => {
        const paginaLink = decodeURIComponent(
            new URL(item.href, window.location.href).pathname.split("/").pop()
        ).toLowerCase();

        item.classList.toggle("active", paginaAtual === paginaLink);
    });
}

//Nome e email na side bar
document.addEventListener("DOMContentLoaded", atualizarSidebarAtiva);

function preencherSidebarUsuario() {
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (!userName) return;

    const primeiroNome = userName.trim().split(" ")[0];

    // Preenche o card da sidebar (funciona em todas as páginas)
    const sidebarNome = document.querySelector(".user-nome");
    const sidebarEmail = document.querySelector(".user-email");

    if (sidebarNome) sidebarNome.textContent = `Olá, ${primeiroNome}!`;
    if (sidebarEmail && userEmail) sidebarEmail.textContent = userEmail;

    // Preenche o <h1> principal caso esteja na Home
    const homeTitulo = document.querySelector(".header h1");
    if (homeTitulo && homeTitulo.textContent.includes("Olá")) {
        homeTitulo.textContent = `Olá, ${primeiroNome}!`;
    }
}

document.addEventListener("DOMContentLoaded", preencherSidebarUsuario);

// Garante a execução mesmo se o DOM já estiver pronto quando o script carregar
if (document.readyState === "interactive" || document.readyState === "complete") {
    preencherSidebarUsuario();
}