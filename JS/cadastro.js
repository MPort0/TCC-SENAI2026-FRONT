document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formCadastro');
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

    // VALIDAR CAMPOS E SUBMIT
    if (btnContinuar) {
        btnContinuar.addEventListener('click', function(event) {
            event.preventDefault();

            const nome = document.querySelector('#nome').value.trim();
            const email = document.querySelector('#email').value.trim();
            const senha = document.querySelector('#senha').value.trim();
            const confirmarSenha = document.querySelector('#confirmar-senha').value.trim();

            if (nome === "" || email === "" || senha === "" || confirmarSenha === "") {
                alert("Ops! Preencha todos os campos para entrar.");
                return;
            }

            if (senha !== confirmarSenha) {
                alert("As senhas não coincidem!");
                return;
            }

            localStorage.setItem('emailEmCadastro', email);
            window.location.href = "../HTML/login-usuario.html";
        });
    }
});