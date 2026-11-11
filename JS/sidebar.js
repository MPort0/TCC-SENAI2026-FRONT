// document.addEventListener('DOMContentLoaded', () => {
//   const btnSidebar = document.getElementById('btn-sidebar');
//   const sidebar = document.querySelector('.sidebar');

//   if (btnSidebar && sidebar) {
//     btnSidebar.addEventListener('click', () => {
//       sidebar.classList.toggle('collapsed');
//     });
//   }
// });


document.addEventListener("DOMContentLoaded", () => {
    const paginaAtual = decodeURIComponent(
        window.location.pathname.split("/").pop()
    );

    const itensSidebar = document.querySelectorAll(
        ".sidebar .nav-section .nav-item"
    );

    itensSidebar.forEach(item => {
        const paginaLink = decodeURIComponent(
            new URL(item.href, window.location.href).pathname.split("/").pop()
        );

        item.classList.toggle("active", paginaAtual === paginaLink);
    });
});
