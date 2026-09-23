document.addEventListener('DOMContentLoaded', () => {
    const inputEmail = document.querySelector('#email') || document.querySelector('input[type="email"]');
    const inputSenha = document.querySelector('#senha') || document.querySelector('input[type="password"]');
    const labelLembrar = document.querySelector('.lembrar-senha');
    const checkLembrar = document.querySelector('#lembrar');
    const iconeCheckbox = document.querySelector('#checkbox');
    const formLogin = document.querySelector('form');
    const btnEntrar = document.querySelector('#btnEntrar') || document.querySelector('button[type="submit"]');

    // Caminhos das imagens (Confira se os nomes dos seus arquivos estão exatamente assim)
    const imgDesmarcado = '../IMG/checkbox-vazio.svg';
    const imgMarcado = '../IMG/checkbox.svg';

    // 1. CLIQUE DIRETO NA LABEL
    if (labelLembrar && checkLembrar && iconeCheckbox) {
            labelLembrar.addEventListener('click', (e) => {
                e.preventDefault();

                checkLembrar.checked = !checkLembrar.checked;
                iconeCheckbox.src = checkLembrar.checked ? imgMarcado : imgDesmarcado;
            });
        }
        
    // 2. RESTAURAR ESTADO SALVO
    const emailSalvo = localStorage.getItem('lembrar_email');
    const senhaSalvaLembrada = localStorage.getItem('lembrar_senha');

    if (emailSalvo && senhaSalvaLembrada && inputEmail && inputSenha) {
        // Se a opção de lembrar estava salva, preenche os campos e marca o checkbox
        inputEmail.value = emailSalvo;
        inputSenha.value = senhaSalvaLembrada;

        if (checkLembrar && iconeCheckbox) {
            checkLembrar.checked = true;
            iconeCheckbox.src = imgMarcado;
        }
    }

    // 3. LÓGICA DO OLHINHO (MOSTRAR / ESCONDER SENHA)
    document.querySelectorAll('.input-wrapper').forEach(wrapper => {
        const input = wrapper.querySelector('input');
        const olhoFechado = wrapper.querySelector('.olho-fechado');
        const olhoAberto = wrapper.querySelector('.olho-aberto');

        if (input && olhoFechado && olhoAberto) {
            olhoFechado.addEventListener('click', () => {
                input.type = 'text';
                olhoFechado.style.display = 'none';
                olhoAberto.style.display = 'block';
            });

            olhoAberto.addEventListener('click', () => {
                input.type = 'password';
                olhoAberto.style.display = 'none';
                olhoFechado.style.display = 'block';
            });
        }
    });

    // 4. SUBMIT E VALIDAÇÃO DE LOGIN
    function realizarLogin(event) {
        if (event) event.preventDefault();

        const emailDigitado = inputEmail ? inputEmail.value.trim() : '';
        const senhaDigitada = inputSenha ? inputSenha.value.trim() : '';

        if (!emailDigitado || !senhaDigitada) {
            alert('Ops! Preencha o e-mail e a senha para entrar.');
            return;
        }

        const senhaCadastrada = localStorage.getItem(emailDigitado);

        if (!senhaCadastrada) {
            alert('E-mail não encontrado! Por favor, faça o cadastro primeiro.');
            return;
        }

        if (senhaDigitada === senhaCadastrada) {
            if (checkLembrar && checkLembrar.checked) {
                localStorage.setItem('lembrar_email', emailDigitado);
                localStorage.setItem('lembrar_senha', senhaDigitada);
            } else {
                localStorage.removeItem('lembrar_email');
                localStorage.removeItem('lembrar_senha');
            }

            alert('Login realizado com sucesso!');
            window.location.href = '../HTML/home.html';
        } else {
            alert('Senha incorreta! Tente novamente.');
        }
    }

    if (formLogin) {
        formLogin.addEventListener('submit', realizarLogin);
    } else if (btnEntrar) {
        btnEntrar.addEventListener('click', realizarLogin);
    }
});