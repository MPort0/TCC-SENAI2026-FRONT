
const entrevistas = {
    1: {
        titulo: "Desenvolvedor Front-end HTML/CSS",
        data: "24/08/2026",
        nota: "9.0",
        tecnologia: "HTML e CSS",
        dificuldade: "Média",
        feedback:
            "Exemplo de avaliação: bom domínio dos conceitos fundamentais de HTML e CSS.",
        perguntas: [
            {
                pergunta: "O que é HTML?",
                resposta: "HTML é uma linguagem de marcação utilizada para estruturar o conteúdo de páginas web."
            },
            {
                pergunta: "Qual é a função do CSS?",
                resposta: "CSS é utilizado para definir a aparência e o layout das páginas."
            }
        ]
    },

    2: {
        titulo: "Desenvolvedor Front-end HTML/CSS",
        data: "25/08/2026",
        nota: "9.0",
        tecnologia: "HTML e CSS",
        dificuldade: "Média",
        feedback:
            "Exemplo de avaliação: boa compreensão da estrutura de páginas e da estilização.",
        perguntas: [
            {
                pergunta: "Qual é a diferença entre class e id?",
                resposta:
                    "Uma class pode ser reutilizada em vários elementos; um id identifica um elemento específico."
            },
            {
                pergunta: "O que é Flexbox?",
                resposta: "É um modelo CSS para organizar elementos em linhas ou colunas."
            }
        ]
    },

    3: {
        titulo: "Desenvolvedor Front-end HTML/CSS",
        data: "17/09/2026",
        nota: "9.0",
        tecnologia: "HTML e CSS",
        dificuldade: "Média",
        feedback: "Exemplo de avaliação: bom entendimento de layouts e organização dos elementos.",
        perguntas: [
            {
                pergunta: "O que é design responsivo?",
                resposta: "É a adaptação da interface para diferentes tamanhos de tela e dispositivos."
            },
            {
                pergunta: "Para que servem as media queries?",
                resposta: "Permitem aplicar regras CSS conforme as características da tela ou do dispositivo."
            }
        ]
    },

    4: {
        titulo: "Desenvolvedor Front-end HTML/CSS",
        data: "22/09/2026",
        nota: "9.0",
        tecnologia: "HTML e CSS",
        dificuldade: "Média",
        feedback: "Exemplo de avaliação: boa compreensão dos fundamentos do desenvolvimento front-end.",
        perguntas: [
            {
                pergunta: "O que é o DOM?",
                resposta: "É uma representação estruturada do documento HTML que pode ser acessada pelo JavaScript."
            },
            {
                pergunta: "Como adicionar interatividade a uma página?",
                resposta: "Podemos utilizar JavaScript para responder a eventos e modificar elementos da página."
            }
        ]
    }
};

function openInterview(numero) {
    const entrevista = entrevistas[numero];

    if (!entrevista) return;

    document.getElementById("interviewTitle").textContent =
        entrevista.titulo;

    document.getElementById("interviewDate").textContent =
        entrevista.data;

    document.getElementById("interviewScore").textContent =
        entrevista.nota;

    document.getElementById("interviewTechnology").textContent =
        "Tecnologia: " + entrevista.tecnologia;

    document.getElementById("interviewDifficulty").textContent =
        "Dificuldade: " + entrevista.dificuldade;

    document.getElementById("interviewFeedback").textContent =
        entrevista.feedback;

    const container =
        document.getElementById("interviewQuestions");

    container.replaceChildren();

    entrevista.perguntas.forEach((item) => {
        const bloco = document.createElement("div");
        bloco.className = "question-item";

        const pergunta = document.createElement("h4");
        pergunta.textContent = item.pergunta;

        const resposta = document.createElement("p");
        resposta.textContent = item.resposta;

        bloco.append(pergunta, resposta);
        container.appendChild(bloco);
    });

    const modal = document.getElementById("modal");
    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeInterview(event, force = false) {
    if (
        force ||
        !event ||
        event.target === document.getElementById("modal")
    ) {
        document.getElementById("modal").classList.remove("show");
        document.body.style.overflow = "";
    }
}

document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeInterview(null, true);
    }
});