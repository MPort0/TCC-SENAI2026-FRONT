const temaSalvo = localStorage.getItem('app-theme') || 'dark';

document.documentElement.setAttribute('data-theme', temaSalvo);
document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleText = document.getElementById('theme-toggle-text');

  function obterTemaPorHorario() {
    const horaAtual = new Date().getHours();
    return (horaAtual >= 18 || horaAtual < 6) ? 'dark' : 'light';
  }

  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);

    if (themeToggleText) {
      themeToggleText.textContent =
        tema === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    }
  }

  // 1. Verifica se o usuário já escolheu um tema manualmente neste turno
  const temaAutomatico = obterTemaPorHorario();
  const temaSalvo = localStorage.getItem('app-theme');
  const turnoQuandoSalvou = localStorage.getItem('app-theme-period');

  if (temaSalvo && turnoQuandoSalvou === temaAutomatico) {
    aplicarTema(temaSalvo);
  } else {
    localStorage.removeItem('app-theme');
    localStorage.removeItem('app-theme-period');
    aplicarTema(temaAutomatico);
  }

  // 2. Salva a escolha ao clicar no botão
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const temaAtual = document.documentElement.getAttribute('data-theme');
      const novoTema = temaAtual === 'dark' ? 'light' : 'dark';

      localStorage.setItem('app-theme', novoTema);
      localStorage.setItem('app-theme-period', obterTemaPorHorario());

      aplicarTema(novoTema);
    });
  }
});