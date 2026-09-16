// Função para aplicar o tema no HTML e salvar no navegador
function aplicarTema(tema) {
    document.documentElement.setAttribute('data-theme', tema);
    localStorage.setItem('temaPreferido', tema);
}

// Executa assim que a página carrega
document.addEventListener('DOMContentLoaded', () => {
    // 1. Verifica se o usuário já escolheu um tema antes. Se não, o padrão é o escuro ('dark')
    const temaSalvo = localStorage.getItem('temaPreferido') || 'dark';
    aplicarTema(temaSalvo);

    // 2. Escuta o clique do botão de alternar tema
    const botaoTema = document.getElementById('toggle-theme');
    
    if (botaoTema) {
        botaoTema.addEventListener('click', () => {
            // Verifica o tema atual do HTML
            const temaAtual = document.documentElement.getAttribute('data-theme');
            
            // Se for escuro vira claro, se for claro vira escuro
            const novoTema = temaAtual === 'dark' ? 'light' : 'dark';
            
            aplicarTema(novoTema);
        });
    }
});
