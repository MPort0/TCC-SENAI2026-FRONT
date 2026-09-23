document.addEventListener('DOMContentLoaded', () => {
    const inputSenha = document.getElementById('senha');
    const iconeOlho = document.getElementById('icone-senha');
    const inputConfirmar = document.getElementById('confirmar-senha');
    const iconeVer = document.getElementById('icone-confirmarSenha');
    const btnContinuar = document.getElementById('btnContinuar');

    let senhaValida = false;

    // OLHINHO SENHA    
    window.toggleSenha = function() {
        if (!inputSenha || !iconeOlho) return;
        if (inputSenha.type === 'password') {
            inputSenha.type = 'text';
            iconeOlho.setAttribute('src', '../IMG/ver-senha.svg');
        } else {
            inputSenha.type = 'password';
            iconeOlho.setAttribute('src', '../IMG/ocultar-senha.svg');
        }
    };

    // OLHINHO CONFIRMAR SENHA
    window.toggleConfirmar = function() {
        if (!inputConfirmar || !iconeVer) return;
        if (inputConfirmar.type === 'password') {
            inputConfirmar.type = 'text';
            iconeVer.setAttribute('src', '../IMG/ver-senha.svg');
        } else {
            inputConfirmar.type = 'password';
            iconeVer.setAttribute('src', '../IMG/ocultar-senha.svg');
        }
    };

    // 1. FUNÇÃO DE VALIDAÇÃO VISUAL DA BORDA (COLOCADA NO ESCOPO CORRETO)
    function validarCoincidencia() {
        if (!inputConfirmar || !inputSenha) return;

        if (inputConfirmar.value.length > 0) {
            if (inputSenha.value === inputConfirmar.value) {
                inputConfirmar.style.borderColor = "#28a745"; // Verde
            } else {
                inputConfirmar.style.borderColor = "#dc3545"; // Vermelho
            }
        } else {
            inputConfirmar.style.borderColor = "#4d6cae"; // Cor padrão
        }
    }

    // 2. ESCUTA A DIGITAÇÃO NO CAMPO DE CONFIRMAÇÃO
    if (inputConfirmar) {
        inputConfirmar.addEventListener('input', validarCoincidencia);
    }

    // REGRAS DE NEGÓCIO PARA SENHA VALIDADOS EM TEMPO REAL
    if (inputSenha) {
        inputSenha.addEventListener('input', () => {
            const valor = inputSenha.value;

            const regras = {
                caracteres: valor.length >= 8,
                maiuscula: /[A-Z]/.test(valor),
                minuscula: /[a-z]/.test(valor),
                especial: /[!@#$%&*(),.:{}|<>_-]/.test(valor),
                numero: /[0-9]/.test(valor)
            };

            // VISUAL DAS REGRAS
            atualizarVisualRegra('regra-caracteres', regras.caracteres);
            atualizarVisualRegra('regra-maiuscula', regras.maiuscula);
            atualizarVisualRegra('regra-minuscula', regras.minuscula);
            atualizarVisualRegra('regra-especial', regras.especial);
            atualizarVisualRegra('regra-numero', regras.numero);

            // VERIFICAÇÃO SE AS REGRAS FORAM ATENDIDAS
            senhaValida = Object.values(regras).every(v => v === true);

            // Reavalia a confirmação caso a senha principal mude
            validarCoincidencia();
        });
    }

    function atualizarVisualRegra(id, ehValido) {
        const elemento = document.getElementById(id);
        if (!elemento) return;

        if (ehValido) {
            elemento.classList.add('valido');
        } else {
            elemento.classList.remove('valido');
        }
    }

    // VALIDAR CAMPOS E SUBMIT
    if (btnContinuar) {
        btnContinuar.addEventListener('click', function(event) {
            event.preventDefault();

            const nomeEl = document.querySelector('#nome');
            const emailEl = document.querySelector('#email');

            const nome = nomeEl ? nomeEl.value.trim() : '';
            const email = emailEl ? emailEl.value.trim() : '';
            const senha = inputSenha ? inputSenha.value.trim() : '';
            const confirmarSenha = inputConfirmar ? inputConfirmar.value.trim() : '';

            // VERIFICANDO CAMPOS VAZIOS 
            if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
                alert("Ops! Preencha todos os campos para entrar.");
                return;
            }

            // VERIFICAÇÃO DE EMAIL VÁLIDO
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Ops! Por favor, insira um e-mail válido.");
                return;
            }

            // VÊ SE AS REGRAS DE NEGÓCIO FORAM ATENDIDAS
            if (!senhaValida) {
                alert("Ops! A senha não atende aos requisitos de segurança.");
                return;
            }

            // VERIFICAÇÃO DE SENHAS IGUAIS
            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem!");
                return;
            }

            // SALVA A SENHA E SALVA ESTADO
            localStorage.setItem(email, senha);
            localStorage.setItem('emailEmCadastro', email);

            alert("Cadastro realizado com sucesso!");
            window.location.href = "../HTML/login-usuario.html";
        });
    }
});
