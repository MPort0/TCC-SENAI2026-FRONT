document.addEventListener("DOMContentLoaded", async function () {
    const chatContainer = document.getElementById('chat-messages');
    const inputMsg = document.getElementById('messageInput');
    const sendBtn = document.getElementById('btnEnviarMsg');

    let passoAtual = 1;

    // 1. Resgata a configuração salva no LocalStorage
    const configSalva = localStorage.getItem("entrevista_config");
    if (!configSalva) {
        alert("Nenhuma configuração encontrada! Redirecionando...");
        window.location.href = "simulação.html";
        return;
    }

    // 2. Transforma em objeto
    const config = JSON.parse(configSalva);

    // 3. Pega o total de perguntas da config (ou 10 por padrão)
    const totalPassos = config.totalPerguntas || 10;

    let historico = [];

    // Atualiza a barra imediatamente ao carregar a página
    atualizarProgresso();

    // Vincula os eventos de clique no botão e tecla Enter no input
    if (sendBtn) {
        sendBtn.addEventListener('click', processarEnvio);
    }

    if (inputMsg) {
        inputMsg.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                processarEnvio();
            }
        });
    }

    // Atualiza a barra de progresso visualmente no canto superior direito
    function atualizarProgresso() {
        const stepCount = document.querySelector('.step-count');
        const progressBarFill = document.querySelector('.progress-bar-fill');

        if (stepCount && progressBarFill) {
            stepCount.innerHTML = `<strong>${passoAtual}</strong> de ${totalPassos}`;
            const porcentagem = (passoAtual / totalPassos) * 100;
            progressBarFill.style.width = `${porcentagem}%`;
        }
    }

    // Comunicação com o servidor backend Node.js
    async function enviarParaIA(mensagemTexto) {
        try {
            const response = await fetch(`${window.API_BASE}/simulacao`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mensagem: mensagemTexto,
                    historico: historico,
                    config: config,
                    passoAtual: passoAtual
                })
            });

            if (!response.ok) throw new Error("Erro na comunicação com o servidor.");

            const data = await response.json();
            historico = data.historicoAtualizado;

            return data;
        } catch (error) {
            console.error(error);
            return {
                texto: "Erro na comunicação com a Lia. Verifique se o servidor backend está ligado!",
                respostaValida: false,
                concluida: false
            };
        }
    }

    // Desenha as bolhas de chat (padrão chat-lia)
    function adicionarMensagemNoChat(tipo, texto) {
        const div = document.createElement('div');
        div.classList.add('message-bubble');
        div.classList.add(tipo === 'bot' ? 'bubble-ia' : 'bubble-user');
        div.innerText = texto;
        chatContainer.appendChild(div);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Processa o envio da resposta do candidato
    async function processarEnvio() {
        const texto = inputMsg.value.trim();
        if (!texto) return;

        // Desabilita os campos temporariamente
        inputMsg.disabled = true;
        if (sendBtn) sendBtn.disabled = true;

        // 1. Exibe a mensagem do usuário no chat
        adicionarMensagemNoChat('user', texto);
        inputMsg.value = '';

        try {
            // 2. Envia para o backend
            const resultado = await enviarParaIA(texto);

            // 3. Se a resposta foi válida, avança o contador
            if (resultado.respostaValida) {
                if (passoAtual < totalPassos) {
                    passoAtual++;
                    atualizarProgresso();
                }
            }

            // 4. Exibe a mensagem de resposta da IA
            adicionarMensagemNoChat('bot', resultado.texto);

            // 5. REDIRECIONAMENTO: Se a IA marcou concluída OU se o backend mandou o relatório
            if (resultado.concluida || resultado.relatorio) {
                if (resultado.relatorio) {
                    localStorage.setItem("devolutiva_resultado", JSON.stringify(resultado.relatorio));
                }

                // Aguarda 2.5s para o usuário ler a mensagem de encerramento da Lia e redireciona
                setTimeout(() => {
                    window.location.href = "../HTML/devolutiva.html";
                }, 2500);
            }
        } catch (error) {
            console.error("Erro no processamento:", error);
        } finally {
            // Reativa a barra de texto
            inputMsg.disabled = false;
            if (sendBtn) sendBtn.disabled = false;
            inputMsg.focus();
        }
    }

    // Inicia a entrevista automaticamente ao abrir a página
    const inicio = await enviarParaIA("INICIAR_ENTREVISTA");
    adicionarMensagemNoChat('bot', inicio.texto);
});