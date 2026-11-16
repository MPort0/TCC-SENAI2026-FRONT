function showAlert(message) {
    alert(message);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const lembrarCheckbox = document.getElementById('lembrar');
    const checkboxImg = document.getElementById('checkbox');

    if (!form) return;

    // 1. AO CARREGAR A PÁGINA: Preenche apenas o e-mail se estiver salvo ("Lembrar de mim")
    const emailSalvo = localStorage.getItem('emailSalvo');
    if (emailSalvo) {
        emailInput.value = emailSalvo;
        
        if (checkboxImg && checkboxImg.src.includes('checkbox-vazio.svg')) {
            checkboxImg.click();
        }
        if (lembrarCheckbox) lembrarCheckbox.checked = true;
    }

    // 2. ENVIO DO FORMULÁRIO
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = emailInput?.value.trim().toLowerCase();
        const password = passwordInput?.value.trim();

        if (!email || !password) {
            return showAlert('Email e senha são obrigatórios.');
        }

        // Verifica se ESTE e-mail específico já aceitou os Termos de Uso
        const chaveTermos = `termosAceitos_${email}`;
        if (localStorage.getItem(chaveTermos) !== 'true') {
            // Guarda temporariamente qual e-mail está tentando logar para vincular ao aceite
            sessionStorage.setItem('emailPendenteTermos', email);
            return showAlert('Erro ao conectar: você precisa ler e aceitar os Termos de Uso e Políticas de Privacidade antes de fazer login.');
        }

        try {
            const response = await fetch(`${window.API_BASE}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return showAlert(data.error || 'Email ou senha incorretos.');
            }

            // Salva ou remove o e-mail do "Lembrar de mim"
            const estaMarcado = lembrarCheckbox?.checked || 
                                (checkboxImg && !checkboxImg.src.includes('checkbox-vazio.svg'));

            if (estaMarcado) {
                localStorage.setItem('emailSalvo', email);
            } else {
                localStorage.removeItem('emailSalvo');
            }

            if (data.user) {
                localStorage.setItem('userId', data.user.id);
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userName', data.user.name);
            }

            showAlert('Login realizado com sucesso!');
            window.location.href = '../HTML/home.html';
        } catch (error) {
            console.error(error);
            showAlert('Erro de rede ao fazer login. Tente novamente.');
        }
    });
});