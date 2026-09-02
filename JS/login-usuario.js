
// olho
const input = document.getElementById('password');
const olhoFechado = document.querySelector('.olho-fechado');
const olhoAberto = document.querySelector('.olho-aberto');

olhoFechado.addEventListener('click', () => {
    input.type = 'text'; // mostra senha
    olhoFechado.style.display = 'none';
    olhoAberto.style.display = 'block';
});

olhoAberto.addEventListener('click', () => {
    input.type = 'password'; // esconde senha
    olhoAberto.style.display = 'none';
    olhoFechado.style.display = 'block';
});

// lembrar de mim
document.querySelector('.lembrar-senha').addEventListener('click', function () {
    this.classList.toggle('active');
});