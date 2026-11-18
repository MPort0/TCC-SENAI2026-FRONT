
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleText = document.getElementById('theme-toggle-text');

    const path = window.location.pathname.toLowerCase();

    // Páginas que seguem automaticamente o horário
    const ehPaginaAutenticacao =
        path.includes('login') ||
        path.includes('cadastro') ||
        path.includes('esqueci-senha');

    function aplicarTema(tema, salvar = true) {
        document.documentElement.setAttribute('data-theme', tema);

        if (salvar && !ehPaginaAutenticacao) {
            localStorage.setItem('app-theme', tema);
        }

        if (themeToggleText) {
            themeToggleText.textContent =
                tema === 'dark' ? 'Modo Claro' : 'Modo Escuro';
        }
    }

    // Define o tema conforme o horário
    function obterTemaPorHorario() {
        const horaAtual = new Date().getHours();

        // Das 18h às 5h59: escuro
        // Das 6h às 17h59: claro
        return (horaAtual >= 18 || horaAtual < 6)
            ? 'dark'
            : 'light';
    }

    if (ehPaginaAutenticacao) {
        aplicarTema(obterTemaPorHorario(), false);
    } else {
        const savedTheme = localStorage.getItem('app-theme');

        if (savedTheme) {
            aplicarTema(savedTheme);
        } else {
            aplicarTema(obterTemaPorHorario());
        }
    }

    // Alternância manual nas demais páginas
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const temaAtual =
                document.documentElement.getAttribute('data-theme');

            aplicarTema(
                temaAtual === 'dark' ? 'light' : 'dark',
                true
            );
        });
    }
});
