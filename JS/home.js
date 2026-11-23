document.addEventListener("DOMContentLoaded", async () => {
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");
 
    // 1. Mantém a atualização da sidebar e do título da Home que você já tinha
    if (userName) {
        const primeiroNome = userName.split(" ")[0];
 
        const sidebarNome = document.querySelector(".user-nome");
        const sidebarEmail = document.querySelector(".user-email");
        if (sidebarNome) sidebarNome.textContent = `Olá, ${primeiroNome}!`;
        if (sidebarEmail && userEmail) sidebarEmail.textContent = userEmail;
 
        const homeTitulo = document.querySelector(".header h1");
        if (homeTitulo && homeTitulo.textContent.includes("Olá")) {
            homeTitulo.textContent = `Olá, ${primeiroNome}!`;
        }
    }
 
    if (!userId) return;
 
    // 2. Carrega os indicadores reais do card "Seu progresso"
    const elEntrevistas = document.getElementById("stat-entrevistas");
    const elCurriculos = document.getElementById("stat-curriculos");
    const elArea = document.getElementById("stat-area");
    const elObjetivoTexto = document.getElementById("stat-objetivo-texto");
    const elObjetivoBarra = document.getElementById("stat-objetivo-barra");
 
    const apiBase = window.API_BASE || "http://localhost:8080";
 
    try {
        const [respCurriculos, respDevolutivas] = await Promise.all([
            fetch(`${apiBase}/curriculos/${userId}`).catch(() => null),
            fetch(`${apiBase}/ia/devolutivas/usuario/${userId}`).catch(() => null)
        ]);
 
        const curriculos = respCurriculos && respCurriculos.ok ? await respCurriculos.json() : [];
        const devolutivas = respDevolutivas && respDevolutivas.ok ? await respDevolutivas.json() : [];
 
        // Total de entrevistas e currículos formatado com 2 dígitos (00, 01, 04...)
        const totalEntrevistas = Array.isArray(devolutivas) ? devolutivas.length : 0;
        const totalCurriculos = Array.isArray(curriculos) ? curriculos.length : 0;
 
        if (elEntrevistas) elEntrevistas.textContent = String(totalEntrevistas).padStart(2, "0");
        if (elCurriculos) elCurriculos.textContent = String(totalCurriculos).padStart(2, "0");
 
        // Área mais buscada (a partir das entrevistas e currículos)
        const contagemAreas = {};
        if (Array.isArray(devolutivas)) {
            devolutivas.forEach((d) => {
                const chave = (d.tecnologia || d.cargo || "").trim();
                if (chave) contagemAreas[chave] = (contagemAreas[chave] || 0) + 1;
            });
        }
        if (Array.isArray(curriculos)) {
            curriculos.forEach((c) => {
                const chave = (c.cargo || "").trim();
                if (chave) contagemAreas[chave] = (contagemAreas[chave] || 0) + 1;
            });
        }
 
        const areasOrdenadas = Object.entries(contagemAreas).sort((a, b) => b[1] - a[1]);
        const areaMaisBuscada = areasOrdenadas.length > 0 ? areasOrdenadas[0][0] : "Nenhuma ainda";
 
        if (elArea) elArea.textContent = areaMaisBuscada;
 
        // Barra de progresso ("Seu objetivo") baseada na média das notas
        let porcentagemObjetivo = 0;
 
        if (totalEntrevistas > 0) {
            const somaNotas = devolutivas.reduce((acc, item) => acc + (Number(item.nota) || 0), 0);
            const mediaNotas = somaNotas / totalEntrevistas;
            porcentagemObjetivo = mediaNotas <= 10 ? Math.round(mediaNotas * 10) : Math.round(mediaNotas);
        } else if (totalCurriculos > 0) {
            porcentagemObjetivo = Math.min(totalCurriculos * 25, 100);
        }
 
        porcentagemObjetivo = Math.max(0, Math.min(100, porcentagemObjetivo));
 
        if (elObjetivoTexto) elObjetivoTexto.textContent = `${porcentagemObjetivo}%`;
        if (elObjetivoBarra) elObjetivoBarra.style.width = `${porcentagemObjetivo}%`;
 
    } catch (erro) {
        console.error("Erro ao carregar progresso da Home:", erro);
    }
});