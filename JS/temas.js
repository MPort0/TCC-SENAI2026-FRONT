
const temaSalvo = localStorage.getItem('app-theme');
const temaInicial = temaSalvo === 'light' ? 'light' : 'dark';

document.documentElement.setAttribute('data-theme', temaInicial);

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleText = document.getElementById('theme-toggle-text');

    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        localStorage.setItem('app-theme', tema);

        if (themeToggleText) {
            themeToggleText.textContent =
                tema === 'dark' ? 'Modo Claro' : 'Modo Escuro';
        }
    }

    aplicarTema(temaInicial);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const temaAtual =
                document.documentElement.getAttribute('data-theme');

            aplicarTema(temaAtual === 'dark' ? 'light' : 'dark');
        });
    }
});
