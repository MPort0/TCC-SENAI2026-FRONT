// chat-back.js
const API_URL = 'http://localhost:3000/ia';
let historicoIA = [];

/**
 * Bloqueia ou desbloqueia o input e os botões para evitar mensagens duplicadas
 */
function alternarBloqueioChat(bloquear) {
    const input = document.getElementById("messageInput");
    const botaoEnviar = document.querySelector(".send-button");
    const botaoAdd = document.querySelector(".add-button");

    if (input) {
        input.disabled = bloquear;
        if (bloquear) {
            input.placeholder = "Aguarde a resposta da Lia...";
        } else {
            input.placeholder = "Pergunte qualquer coisa";
            input.focus(); // Devolve o foco para o usuário digitar
        }
    }
    
    if (botaoEnviar) botaoEnviar.disabled = bloquear;
    if (botaoAdd) botaoAdd.disabled = bloquear;
}

/**
 * Cria o balão do usuário na tela com o estilo correto do seu CSS
 */
function renderizarMensagemUsuario(texto) {
    const chat = document.getElementById("chat-messages");
    if (!chat) return;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message-bubble", "bubble-user"); 
    messageElement.textContent = texto;

    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight;
}

/**
 * Injeta a resposta da Lia garantindo a estrutura e as classes exatas do seu CSS
 */
function renderizarRespostaLia(texto) {
    const chat = document.getElementById("chat-messages");
    if (!chat) return;

    const messageElement = document.createElement("div");
    messageElement.classList.add("message-bubble", "bubble-ia"); 
    messageElement.textContent = texto;

    chat.appendChild(messageElement);
    chat.scrollTop = chat.scrollHeight; // Auto-scroll para baixo
}

/**
 * Envia os dados para a API do seu Back-end Node.js
 */
async function enviarParaIA(mensagemTexto) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensagem: mensagemTexto, historico: historicoIA })
        });

        if (!response.ok) throw new Error(`Erro: ${response.status}`);

        const dados = await response.json();
        
        // Renderiza o balão correto da Lia e atualiza o histórico compartilhado
        renderizarRespostaLia(dados.resposta);
        historicoIA = dados.historico;

    } catch (error) {
        console.error("Erro na API da IA:", error);
        renderizarRespostaLia('A Lia está temporariamente instável, mas nossos servidores de contingência já foram acionados. Tente enviar novamente!');
    } finally {
        // DESBLOQUEIO: Libera o chat assim que a requisição terminar (com sucesso ou erro)
        alternarBloqueioChat(false);
    }
}

/**
 * Configuração dos gatilhos de escuta assim que a página carrega
 */
document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById("messageInput");
    const botaoEnviar = document.querySelector(".send-button");

    // 1. Controle do Enter
    if (input) {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault(); 
                
                if (input.disabled) return;

                const mensagem = input.value.trim();
                if (!mensagem) return;

                alternarBloqueioChat(true);
                renderizarMensagemUsuario(mensagem);
                
                // Reseta a altura da barra para 40px após enviar a mensagem
                input.value = "";
                input.style.height = '40px';

                enviarParaIA(mensagem);
            }
        });
    }

    // 2. Controle do clique no botão Enviar
    if (botaoEnviar && input) {
        botaoEnviar.addEventListener('click', () => {
            if (input.disabled) return;

            const mensagem = input.value.trim();
            if (!mensagem) return;

            alternarBloqueioChat(true);
            
            // Reseta a altura da barra para 40px após o clique do botão
            setTimeout(() => {
                input.style.height = '40px';
            }, 10);

            enviarParaIA(mensagem);
        });
    }

    // 3. Código de expansão automática da barra de mensagens (Movido para fora do bloco do botão e ajustado para 40px)
    if (input) {
        input.addEventListener('input', function () {
            // Reseta a altura para a base de 40px centralizada do CSS antes de recalcular
            this.style.height = '40px'; 
            
            // Define a nova altura baseada no conteúdo interno
            this.style.height = this.scrollHeight + 'px';
            
            // Se o texto passar da altura máxima (5 linhas / 120px), ativa a rolagem interna
            if (this.scrollHeight > 120) {
                this.style.overflowY = 'auto';
            } else {
                this.style.overflowY = 'hidden';
            }
        });
    }

    // 4. MENSAGEM INICIAL AUTOMÁTICA
    setTimeout(() => {
        renderizarRespostaLia("Olá! Eu sou a Lia, sua assistente virtual do Avalia!");
    }, 500);
});
