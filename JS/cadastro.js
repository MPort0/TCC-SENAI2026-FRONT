document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
    const email = document.getElementById('email');
    const inputSenha = document.getElementById('senha');
    const iconeOlho = document.getElementById('icone-senha');
    const inputConfirmar = document.getElementById('confirmar-senha');
    const iconeVer = document.getElementById('icone-confirmarSenha');
    const btnContinuar = document.getElementById('btnContinuar');

    // OLHINHO SENHA    
    window.toggleSenha = function() {
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
        if (inputConfirmar.type === 'password') {
            inputConfirmar.type = 'text';
            iconeVer.setAttribute('src', '../IMG/ver-senha.svg');
        } else {
            inputConfirmar.type = 'password';
            iconeVer.setAttribute('src', '../IMG/ocultar-senha.svg');
        }
    };

    // REGRAS DE NEGÓCIO PARA SENHA VALIDADOS EM TEMPO REAL
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
    });

    function atualizarVisualRegra(id, ehValido){
        const elemento = document.getElementById(id);
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

            const nome = document.querySelector('#nome').value.trim();
            const email = document.querySelector('#email').value.trim();
            const senha = document.querySelector('#senha').value.trim();
            const confirmarSenha = document.querySelector('#confirmar-senha').value.trim();

            // VERIFICANDO CAMPOS VAZIOS 
            if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
                alert("Ops! Preencha todos os campos para entrar.");
                return;
            }

            // VÊ SE AS REGRAS DE NEGÓCIO FORAM ATENDIDAS
            if (!senhaValida) {
                alert("Ops! A senha não atende aos requisitos de segurança.");
                return;
            }

            // VERIFICAÇÃO DE EMAIL VÁLIDO
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Ops! Por favor, insira um e-mail válido.");
                return;
            }

            // VERIFICAÇÃO DE SENHAS IGUAIS
            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem!");
                return;
            }

            // SALVA A SENHA USANDO O EMAIL DO USER COMO CHAVE
            localStorage.setItem(email, senha);

            alert("Cadastro realizado com sucesso!");

            localStorage.setItem('emailEmCadastro', email);
            window.location.href = "../HTML/login-usuario.html";
        });
    }
});