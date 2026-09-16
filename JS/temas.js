// Função para aplicar o tema no HTML
function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
}

function verificarTemaPorHorario() {
    const horaAtual = new Date().getHours();
    
    // Se a hora do computador for 9 ou mais (ex: 09:00, 13:00, 20:00), entra no escuro
    // Se colocar um horario como 9:30, nn vai dar certo, tem q dar uma pesquisada pra ver como funciona
    if (horaAtual >= 18) {
        return 'dark';
    } else {
        return 'light';
    }
}

// Executa automaticamente assim que a página carrega
document.addEventListener('DOMContentLoaded', () => {
    const temaDefinido = verificarTemaPorHorario();
    aplicarTema(temaDefinido);
});
