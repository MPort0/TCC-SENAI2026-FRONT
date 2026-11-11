function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Obtém os valores inseridos pelo usuário nos campos
    const informacoes = document.getElementById('informacoes').value.trim();
    const formacao = document.getElementById('formacao').value.trim();
    const habilidades = document.getElementById('habilidades1').value.trim();
    const dificuldades = document.getElementById('dificuldades').value.trim();
    const diferenciais = document.getElementById('diferenciais').value.trim();

    // Validação rápida para garantir que os campos foram preenchidos
    if (!informacoes && !formacao && !habilidades) {
        alert("Por favor, preencha o formulário antes de exportar o PDF.");
        return;
    }

    // Configurações do cabeçalho e estilização do PDF
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(30, 41, 59); // Cor escura para o título
    doc.text("Currículo - Desenvolvedor Front-end", 15, 20);

    doc.setDrawColor(95, 127, 191);
    doc.setLineWidth(0.8);
    doc.line(15, 25, 195, 25); // Linha divisória azul

    let posY = 35;

    // Função auxiliar para inserir seções com quebra de linha automática
    function adicionarSecao(titulo, conteudo) {
        if (!conteudo) return;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(95, 127, 191);
        doc.text(titulo, 15, posY);
        posY += 6;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(51, 65, 85);

        // Quebra linhas longas automaticamente dentro do limite de largura da página (180mm)
        const linhas = doc.splitTextToSize(conteudo, 180);
        doc.text(linhas, 15, posY);

        posY += (linhas.length * 5) + 8; // Ajusta espaçamento vertical para a próxima seção
    }

    // Adiciona os dados coletados
    adicionarSecao("Informações Pessoais:", informacoes);
    adicionarSecao("Formação Acadêmica:", formacao);
    adicionarSecao("Habilidades:", habilidades);
    adicionarSecao("Dificuldades:", dificuldades);
    adicionarSecao("Diferenciais:", diferenciais);

    // Salva o arquivo gerado diretamente no dispositivo do usuário
    doc.save("curriculo-desenvolvedor.pdf");
}