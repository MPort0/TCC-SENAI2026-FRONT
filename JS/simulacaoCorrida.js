document.addEventListener("DOMContentLoaded", async function () {
    const chatContainer = document.getElementById('chat-messages');
    const inputMsg = document.getElementById('messageInput');
    const sendBtn = document.getElementById('btnEnviarMsg');

    let passoAtual = 1;
    const totalPassos = 10;

    // Resgata a configuração salva
    const configSalva = localStorage.getItem("entrevista_config");
    if (!configSalva) {
        alert("Nenhuma configuração encontrada! Redirecionando...");
        window.location.href = "simulação.html";
        return;
    }

    const config = JSON.parse(configSalva);
    let historico = [];

    // Atualiza a barra visualmente
    function atualizarProgresso() {
        const stepCount = document.querySelector('.step-count');
        const progressBarFill = document.querySelector('.progress-bar-fill');

        if (stepCount && progressBarFill) {
            stepCount.innerHTML = `<strong>${passoAtual}</strong> de ${totalPassos}`;
            const porcentagem = (passoAtual / totalPassos) * 100;
            progressBarFill.style.width = `${porcentagem}%`;
        }
    }

    // Comunicação com o servidor backend
    async function enviarParaIA(mensagemTexto) {
        try {
            const response = await fetch('http://localhost:3000/ia/simulacao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mensagem: mensagemTexto, historico: historico, config: config })
            });

            if (!response.ok) throw new Error("Erro na comunicação com o servidor.");

            const data = await response.json();
            historico = data.historicoAtualizado;

            return data; // Retorna { texto, respostaValida, modelo, historicoAtualizado }
        } catch (error) {
            console.error(error);
            return { texto: "Erro na comunicação com a Lia. Verifique se o servidor backend está ligado!", respostaValida: false };
        }
    }

    // Desenha as bolhas no chat
    function adicionarMensagemNoChat(tipo, texto) {
        const div = document.createElement('div');
        div.classList.add('message-bubble');
        div.classList.add(tipo === 'bot' ? 'bubble-ia' : 'bubble-user');
        div.innerText = texto;
        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Processa o envio da mensagem
    async function processarEnvio() {
        const texto = inputMsg.value.trim();
        if (!texto) return;

        adicionarMensagemNoChat('user', texto);
        inputMsg.value = '';

        const resultado = await enviarParaIA(texto);

        // Só avança a barra de progresso se a IA confirmar que o candidato tentou responder à pergunta!
        if (resultado.respostaValida && passoAtual < totalPassos) {
            passoAtual++;
            atualizarProgresso();
        }

        adicionarMensagemNoChat('bot', resultado.texto);
    }

    if (sendBtn) sendBtn.addEventListener('click', processarEnvio);
    if (inputMsg) {
        inputMsg.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                processarEnvio();
            }
        });
    }

    // Inicia a entrevista automaticamente
    const inicio = await enviarParaIA("INICIAR_ENTREVISTA");
    adicionarMensagemNoChat('bot', inicio.texto);
});