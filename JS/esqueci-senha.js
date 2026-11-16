document.addEventListener('DOMContentLoaded', () => {
    // 1. INFORMAÇÕES GERAIS
    const inputEmail = document.querySelector('#email');
    const inputSenha = document.querySelector('#senha');
    const inputConfirmar = document.querySelector('#confirmar-senha');
    const iconeOlho = document.querySelector('#icone-senha');
    const iconeVer = document.querySelector('#icone-confirmarSenha');
    const btnContinuar = document.querySelector('#btnContinuar');
    const avisoSenhaAntiga = document.querySelector('#aviso-senha-antiga');

    let senhaValida = false;

    // 2. VISUALIZAÇÃO DA SENHA / OLHINHO
    window.toggleSenha = function () {
        if (inputSenha.type === 'password') {
            inputSenha.type = 'text';
            iconeOlho.src = "../IMG/ver-senha.svg";
        } else {
            inputSenha.type = 'password';
            iconeOlho.src = "../IMG/ocultar-senha.svg";
        }
    };

    window.toggleConfirmar = function () {
        if (inputConfirmar.type === 'password') {
            inputConfirmar.type = 'text';
            iconeVer.src = "../IMG/ver-senha.svg";
        } else {
            inputConfirmar.type = 'password';
            iconeVer.src = "../IMG/ocultar-senha.svg";
        }
    };

    // 3. VALIDANDO EM TEMPO REAL A CRIAÇÃO DA SENHA
    inputSenha.addEventListener('input', () => {
        const valor = inputSenha.value;

        const regras = {
            caracteres: valor.length >= 8,
            maiuscula: /[A-Z]/.test(valor),
            minuscula: /[a-z]/.test(valor),
            numero: /[0-9]/.test(valor),
            especial: /[!@#$%&*(),.:{}|<>_-]/.test(valor)
        };

        // ATUALIZA O VISUAL DAS REGRAS
        atualizarVisualRegra('regra-caracteres', regras.caracteres);
        atualizarVisualRegra('regra-maiuscula', regras.maiuscula);
        atualizarVisualRegra('regra-minuscula', regras.minuscula);
        atualizarVisualRegra('regra-numero', regras.numero);
        atualizarVisualRegra('regra-especial', regras.especial);

        // CHECA SE TODAS AS REGRAS FORAM ATENDIDAS
        senhaValida = Object.values(regras).every(v => v === true);

        validarCoincidencia();
    });

    function atualizarVisualRegra(id, ehValido) {
        const elemento = document.getElementById(id);
        if (elemento) {
            if (ehValido) {
                elemento.classList.add('valido');
            } else {
                elemento.classList.remove('valido');
            }
        }
    }

    // 4. COR NA BORDA DO CAMPO DE CONFIRMAÇÃO
    function validarCoincidencia() {
        if (inputConfirmar.value.length > 0) {
            if (inputSenha.value === inputConfirmar.value) {
                inputConfirmar.style.borderColor = "#28a745"; // Verde
            } else {
                inputConfirmar.style.borderColor = "#dc3545"; // Vermelho
            }
        } else {
            inputConfirmar.style.borderColor = "#4d6cae"; // Roxo padrão
        }
    }

    inputConfirmar.addEventListener('input', validarCoincidencia);

    // 5. ENVIO DOS DADOS PARA O BACKEND
    btnContinuar.addEventListener('click', async (event) => {
        event.preventDefault();

        const emailDigitado = inputEmail ? inputEmail.value.trim() : '';
        const senhaDigitada = inputSenha.value;
        const confirmarSenhaDigitada = inputConfirmar.value;

        // a. Verifica campos vazios
        if (!emailDigitado || !senhaDigitada || !confirmarSenhaDigitada) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // b. Verifica se a senha atende aos requisitos de complexidade
        if (!senhaValida) {
            alert("A senha não atende a todos os requisitos de segurança.");
            return;
        }

        // c. Verifica se as duas senhas coincidem no front
        if (senhaDigitada !== confirmarSenhaDigitada) {
            alert("As senhas não coincidem. Verifique os campos.");
            return;
        }

        // d. Envia a requisição via API HTTP para a sua rota no Express
        try {
            btnContinuar.disabled = true;
            btnContinuar.innerText = "Carregando...";

            const response = await fetch(`${window.API_BASE}/redefinir`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: emailDigitado,
                    password: senhaDigitada,
                    confirmPassword: confirmarSenhaDigitada
                })
            });

            const data = await response.json();

            if (!response.ok) {
                // Exibe mensagens enviadas do backend (ex: "Email não encontrado no sistema")
                alert(data.error || "Erro ao redefinir a senha.");
                return;
            }

            alert(data.message || "Senha redefinida com sucesso!");
            window.location.href = "../HTML/login.html";

        } catch (error) {
            console.error("Erro na comunicação com a API:", error);
            alert("Servidor indisponível. Tente novamente mais tarde.");
        } finally {
            btnContinuar.disabled = false;
            btnContinuar.innerText = "Redefinir senha";
        }
    });
});