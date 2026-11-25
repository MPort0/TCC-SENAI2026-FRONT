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

function aplicarFotoNaSidebar(fotoBase64) {
    if (!fotoBase64) return;

    const avatarContainer = document.querySelector(".sidebar .user-avatar");
    if (avatarContainer) {
        avatarContainer.style.overflow = "hidden";
        avatarContainer.innerHTML = `<img src="${fotoBase64}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block;">`;
    }
}

async function preencherSidebarUsuario() {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    if (userName) {
        const primeiroNome = userName.trim().split(" ")[0];

        const sidebarNome = document.querySelector(".user-nome");
        const sidebarEmail = document.querySelector(".user-email");

        if (sidebarNome) sidebarNome.textContent = `Olá, ${primeiroNome}!`;
        if (sidebarEmail && userEmail) sidebarEmail.textContent = userEmail;

        const homeTitulo = document.querySelector(".header h1");
        if (homeTitulo && homeTitulo.textContent.includes("Olá")) {
            homeTitulo.textContent = `Olá, ${primeiroNome}!`;
        }
    }

    if (userId && window.API_BASE) {
        try {
            const resp = await fetch(`${window.API_BASE}/users/${userId}`);
            if (resp.ok) {
                const usuario = await resp.json();
                if (usuario.foto) {
                    aplicarFotoNaSidebar(usuario.foto);
                }
            }
        } catch (erro) {
            console.error("Erro ao carregar foto na sidebar:", erro);
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    atualizarSidebarAtiva();
    preencherSidebarUsuario();
});

if (document.readyState === "interactive" || document.readyState === "complete") {
    preencherSidebarUsuario();
}