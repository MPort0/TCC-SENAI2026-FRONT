
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleText = document.getElementById('theme-toggle-text');

  // Identifica as páginas de autenticação
  const path = window.location.pathname;
  const ehPaginaAutenticacao =
    path.includes('login') ||
    path.includes('cadastro') ||
    path.includes('esqueci-senha');

  // 1. Aplica o tema na tag <html>
  function aplicarTema(tema, salvar = true) {
    document.documentElement.setAttribute('data-theme', tema);

    // Só salva a preferência fora das páginas de autenticação
    if (salvar && !ehPaginaAutenticacao) {
      localStorage.setItem('app-theme', tema);
    }

    if (themeToggleText) {
      themeToggleText.textContent =
        tema === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    }
  }

  // 2. Define o tema inicial
  if (ehPaginaAutenticacao) {
    // Login, Cadastro e Esqueci minha senha seguem o horário
    const horaAtual = new Date().getHours();
    const temaPorHorario =
      (horaAtual >= 18 || horaAtual < 6) ? 'dark' : 'light';

    aplicarTema(temaPorHorario, false);

  } else {
    // Outras páginas usam o tema salvo
    const savedTheme = localStorage.getItem('app-theme');

    if (savedTheme) {
      aplicarTema(savedTheme);
    } else {
      const horaAtual = new Date().getHours();
      const temaPorHorario =
        (horaAtual >= 18 || horaAtual < 6) ? 'dark' : 'light';

      aplicarTema(temaPorHorario);
    }
  }

  // 3. Botão para alternar o tema manualmente
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const temaAtual =
        document.documentElement.getAttribute('data-theme');

      const novoTema =
        temaAtual === 'dark' ? 'light' : 'dark';

      aplicarTema(novoTema, true);
    });
  }
});
