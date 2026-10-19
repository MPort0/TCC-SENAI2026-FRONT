// 1. Faz o botão original "clicar" no input invisível
function abrirJanelaArquivos() {
    document.getElementById('meu-pdf-input').click();
}

// 2. Executa quando o usuário escolhe o arquivo PDF
function arquivoAdicionado(input) {
    if (input.files && input.files[0]) {
        const arquivo = input.files[0];
        
        // Aqui você já tem o arquivo PDF capturado!
        console.log("PDF Selecionado:", arquivo.name);
        alert("Você selecionou o arquivo: " + arquivo.name);
        
        // Exemplo: Se quiser ler ou processar o arquivo depois, use o objeto 'arquivo'
    }
}
