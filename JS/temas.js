// Função para aplicar o tema no HTML
// function aplicarTema(tema) {
//     document.documentElement.setAttribute('data-theme', tema);
// }

// function verificarTemaPorHorario() {
//     const horaAtual = new Date().getHours();
    
//     // Se a hora do computador for 9 ou mais (ex: 09:00, 13:00, 20:00), entra no escuro
//     // Se colocar um horario como 9:30, nn vai dar certo, tem q dar uma pesquisada pra ver como funciona
//     if (horaAtual >= 6) {
//         return 'dark';
//     } else {
//         return 'light';
//     }
// }

// // Executa automaticamente assim que a página carrega
// document.addEventListener('DOMContentLoaded', () => {
//     const temaDefinido = verificarTemaPorHorario();
//     aplicarTema(temaDefinido);
// });

document.addEventListener('DOMContentLoaded', () => {
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeToggleText = document.getElementById('theme-toggle-text');

  // 1. Aplica o tema na tag <html>, salva no localStorage e atualiza o botão
  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('app-theme', tema);

    if (themeToggleText) {
      themeToggleText.textContent = tema === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    }
  }

  // 2. Verifica tema salvo ou usa horário como fallback (escuro das 20h às 06h)
  const savedTheme = localStorage.getItem('app-theme');

  if (savedTheme) {
    aplicarTema(savedTheme);
  } else {
    const horaAtual = new Date().getHours();
    const temaPorHorario = (horaAtual >= 20 || horaAtual < 6) ? 'dark' : 'light';
    aplicarTema(temaPorHorario);
  }

  // 3. Listener de clique para alternar o tema
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const temaAtual = document.documentElement.getAttribute('data-theme');
      const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
      aplicarTema(novoTema);
    });
  }
});