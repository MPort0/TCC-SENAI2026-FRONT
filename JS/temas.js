
const temaSalvo = localStorage.getItem('app-theme');

// Modo escuro como padrão
const temaInicial = temaSalvo === 'light' ? 'light' : 'dark';

// Aplica o tema antes de carregar a página
document.documentElement.setAttribute('data-theme', temaInicial);

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleText = document.getElementById('theme-toggle-text');

    // Função responsável por alterar e salvar o tema
    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);

        // Salva a preferência do usuário
        localStorage.setItem('app-theme', tema);

        // Atualiza o texto do botão
        if (themeToggleText) {
            themeToggleText.textContent =
                tema === 'dark' ? 'Modo Claro' : 'Modo Escuro';
        }
    }

    // Define o texto inicial do botão
    if (themeToggleText) {
        themeToggleText.textContent =
            temaInicial === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    }

    // Alterna entre modo claro e escuro ao clicar
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const temaAtual =
                document.documentElement.getAttribute('data-theme');

            const novoTema =
                temaAtual === 'dark' ? 'light' : 'dark';

            aplicarTema(novoTema);
        });
    }
});
