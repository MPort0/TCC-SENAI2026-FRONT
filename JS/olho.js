document.querySelectorAll('.input-wrapper').forEach(wrapper => {
    const input = wrapper.querySelector('input'); // pega qualquer input dentro do wrapper
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
