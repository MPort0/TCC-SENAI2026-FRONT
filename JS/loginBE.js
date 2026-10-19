function showAlert(message) {
    alert(message);
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value.trim();

        if (!email || !password) {
            return showAlert('Email e senha são obrigatórios.'); 
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

            // Salva dados do usuário no localStorage (WEB) para uso em toda a aplicação
            if (data.user) {
                localStorage.setItem('userEmail', data.user.email);
                localStorage.setItem('userName', data.user.name);
            }

            showAlert('Login realizado com sucesso!');
            window.location.href = '../HTML/home.html';
        } catch (error) {
            console.error(error);
            showAlert('Erro de rede ao fazer login. Tente novamente.');
        }
    })
})