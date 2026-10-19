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

    // 2. VISUALIZAÇÃO DA SENHA / OLHINHO (Funções globais para funcionarem no onclick do HTML)
    window.toggleSenha = function() {
        if (inputSenha.type === 'password') {
            inputSenha.type = 'text';
            iconeOlho.src = "../IMG/ver-senha.svg";
        } else {
            inputSenha.type = 'password';
            iconeOlho.src = "../IMG/ocultar-senha.svg";
        }
    };

    window.toggleConfirmar = function() {
        if (inputConfirmar.type === 'password') {
            inputConfirmar.type = 'text';
            iconeVer.src = "../IMG/ver-senha.svg";
        } else {
            inputConfirmar.type = 'password';
            iconeVer.src = "../IMG/ocultar-senha.svg";
        }
    };

    // 3. VERIFICAR SE A NOVA SENHA É IGUAL À SALVA NO LOCALSTORAGE
    function verificarSenhaAntiga() {
        const emailDigitado = inputEmail ? inputEmail.value.trim() : '';
        const senhaNova = inputSenha.value;

        // Busca no localStorage a senha cadastrada para o e-mail digitado
        const senhaAntigaSalva = localStorage.getItem(emailDigitado);

        if (senhaAntigaSalva && senhaNova === senhaAntigaSalva && senhaNova !== "") {
            exibirAvisoSenhaAntiga(true);
            return true;
        }

        exibirAvisoSenhaAntiga(false);
        return false;
    }

    function exibirAvisoSenhaAntiga(mostrar) {
        if (avisoSenhaAntiga) {
            if (mostrar) {
                avisoSenhaAntiga.style.display = 'block';
                btnContinuar.style.opacity = "0.5";
                btnContinuar.style.pointerEvents = "none";
            } else {
                avisoSenhaAntiga.style.display = 'none';
                btnContinuar.style.opacity = "1";
                btnContinuar.style.pointerEvents = "auto";
            }
        }
    }

    // 4. VALIDANDO EM TEMPO REAL A CRIAÇÃO DA SENHA
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

        // VÊ SE TODAS AS REGRAS FORAM ATINGIDAS & SE NÃO É A SENHA ANTIGA
        const todasRegrasAtendidas = Object.values(regras).every(v => v === true);
        const eSenhaAntiga = verificarSenhaAntiga();

        senhaValida = todasRegrasAtendidas && !eSenhaAntiga;

        validarCoincidencia();
    });

    // Também recalcula se mudar o e-mail no meio do processo
    if (inputEmail) {
        inputEmail.addEventListener('input', verificarSenhaAntiga);
    }

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

    // 5. COR NA BORDA DO CAMPO DE CONFIRMAÇÃO
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

    // 6. FINALIZAÇÃO E SALVAMENTO
    btnContinuar.addEventListener('click', (event) => {
        event.preventDefault();

        const emailDigitado = inputEmail ? inputEmail.value.trim() : '';

        // a. Verifica campos vazios
        if (!emailDigitado || !inputSenha.value || !inputConfirmar.value) {
            alert("Por favor, preencha todos os campos.");
            return;
        }

        // b. Verifica se o e-mail existe no sistema
        if (!localStorage.getItem(emailDigitado)) {
            alert("Este e-mail não está cadastrado em nosso sistema.");
            return;
        }

        // c. Verifica se a senha atende aos requisitos
        if (!senhaValida) {
            alert("A senha não atende a todos os requisitos de segurança.");
            return;
        }

        // d. Verifica se as duas senhas coincidem
        if (inputSenha.value !== inputConfirmar.value) {
            alert("As senhas não coincidem. Verifique os campos.");
            return;
        }

        // e. Salva a nova senha atualizada usando o e-mail como chave
        localStorage.setItem(emailDigitado, inputSenha.value);
        alert("Senha alterada com sucesso!");

        // f. Redireciona para a tela de login
        window.location.href = "../HTML/login-usuario.html";
    });
});