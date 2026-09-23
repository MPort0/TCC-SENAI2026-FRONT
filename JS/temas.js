// // Função para aplicar o tema no HTML
// function aplicarTema(tema) {
//     document.documentElement.setAttribute('data-theme', tema);
// }

// function verificarTemaPorHorario() {
//     const horaAtual = new Date().getHours();
    
//     // Se a hora do computador for 9 ou mais (ex: 09:00, 13:00, 20:00), entra no escuro
//     // Se colocar um horario como 9:30, nn vai dar certo, tem q dar uma pesquisada pra ver como funciona
//     if (horaAtual >= 20) {
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

  // 1. Função para verificar o tema por horário (caso o usuário nunca tenha clicado no botão)
  function verificarTemaPorHorario() {
    const horaAtual = new Date().getHours();
    return horaAtual >= 20 ? 'dark' : 'light'; /* Fica escuro a partir das 20h */
  }

  // 2. Aplica o tema na tag HTML e atualiza o texto do botão
  function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('app-theme', tema);
    
    // Atualiza o texto do botão se ele existir na tela atual
    if (themeToggleText) {
      themeToggleText.textContent = tema === 'dark' ? 'Modo Claro' : 'Modo Escuro';
    }
  }

  // 3. Recupera o tema salvo ou decide pelo horário do relógio
  const savedTheme = localStorage.getItem('app-theme');
  const temaFinal = savedTheme ? savedTheme : verificarTemaPorHorario();
  
  aplicarTema(temaFinal);

  // 4. Listener do clique no botão (funciona apenas nas telas que tiverem o botão criado)
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const temaAtual = document.documentElement.getAttribute('data-theme');
      const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
      
      aplicarTema(novoTema);
    });
  }
});
