document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleText = document.getElementById('theme-toggle-text');

  // Identifica se estamos na página de login ou cadastro
  const path = window.location.pathname;
  const ehLoginOuCadastro = path.includes('login') || path.includes('cadastro');

  // 1. Aplica o tema na tag <html> (e só salva no localStorage se NÃO for login/cadastro)
  function aplicarTema(tema, salvar = true) {
    document.documentElement.setAttribute('data-theme', tema);
    
    if (salvar && !ehLoginOuCadastro) {
      localStorage.setItem('app-theme', tema);
    }

    if (themeToggleText) {
      themeToggleText.textContent = tema === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    }
  }

  // 2. Lógica de definição inicial
  if (ehLoginOuCadastro) {
    // Login e Cadastro seguem SEMPRE o horário (ex: escuro das 20h às 06h)
    // const horaAtual = new Date().getHours();
    const horaAtual = 22;
    const temaPorHorario = (horaAtual >= 18 || horaAtual < 6) ? 'dark' : 'light';
    aplicarTema(temaPorHorario, false); // false para não salvar no localStorage
  } else {
    // Demais páginas (como perfil) verificam o salvo ou usam horário como fallback
    const savedTheme = localStorage.getItem('app-theme');
    if (savedTheme) {
      aplicarTema(savedTheme);
    } else {
      const horaAtual = new Date().getHours();
      const temaPorHorario = (horaAtual >= 18 || horaAtual < 6) ? 'dark' : 'light';
      aplicarTema(temaPorHorario);
    }
  }

  // 3. Listener de clique para alternar o tema (nas páginas que possuem o botão)
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const temaAtual = document.documentElement.getAttribute('data-theme');
      const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
      aplicarTema(novoTema, true);
    });
  }
});