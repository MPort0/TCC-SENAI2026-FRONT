
# 🎓 AVA.Lia — Front-end

## 📖 Sobre o projeto

O AVA.Lia é uma plataforma desenvolvida como Trabalho de Conclusão de Curso (TCC) do curso técnico de Desenvolvimento de Sistemas do SENAI.

O projeto tem como objetivo auxiliar jovens e profissionais na preparação para o mercado de trabalho, oferecendo ferramentas de criação de currículos, simulações de entrevistas de emprego e orientações personalizadas por meio da inteligência artificial.

Este repositório contém o front-end da aplicação, responsável pela interface gráfica, experiência do usuário e comunicação com a API do back-end.

## 🚀 Funcionalidades

- Cadastro e login de usuários;
- Tela de recuperação de senha;
- Página inicial personalizada;
- Gerenciamento de perfil;
- Criação e edição de currículos;
- Simulação de entrevistas de emprego;
- Devolutivas personalizadas;
- Histórico de simulações;
- Chat com inteligência artificial — Lia;
- Alternância entre modo claro e escuro;
- Sidebar integrada às páginas internas;
- Comunicação com o back-end por meio de uma API REST.

## 🛠️ Tecnologias utilizadas

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)
![Render](https://img.shields.io/badge/Render-000000?style=for-the-badge&logo=render&logoColor=white)

| Tecnologia | Finalidade |
|------------|------------|
| HTML5 | Estruturação das páginas |
| CSS3 | Estilização e organização visual |
| JavaScript | Interatividade e funcionalidades |
| Lucide Icons | Ícones da interface |
| Google Fonts | Tipografia da aplicação |
| Fetch API | Comunicação com o back-end |
| LocalStorage | Armazenamento local de informações |
| Git e GitHub | Versionamento do código |
| Render | Hospedagem da aplicação |

## 📁 Estrutura do projeto

```text
TCC-SENAI2026-FRONT/
├── HTML/
│   ├── cadastro.html
│   ├── chat-lia.html
│   ├── devolutiva.html
│   ├── editar-curriculo.html
│   ├── esqueci-senha.html
│   ├── historico.html
│   ├── home.html
│   ├── login.html
│   ├── novo-curriculo.html
│   ├── perfil.html
│   ├── simulacao.html
│   ├── simulacao-corrida.html
│   └── termos-uso.html
├── CSS/
│   ├── temas.css
│   ├── sidebar.css
│   ├── home.css
│   ├── perfil.css
│   └── ...
├── JS/
│   ├── cadastro.js
│   ├── chat-back.js
│   ├── devolutiva.js
│   ├── editar-curriculo.js
│   ├── entrevista.js
│   ├── esqueci-senha.js
│   ├── historico.js
│   ├── home.js
│   ├── ipback.js
│   ├── loginBE.js
│   ├── novoCurriculo.js
│   ├── olho.js
│   ├── perfil.js
│   ├── sidebar.js
│   ├── simulacao.js
│   ├── simulacaoCorrida.js
│   ├── temas.js
│   └── termos-uso.js
├── IMG/
└── README.md
```

## ⚙️ Instalação e execução

### Pré-requisitos

- Navegador atualizado;
- Git;
- Visual Studio Code (recomendado);
- Extensão Live Server (recomendada);
- Back-end disponível localmente ou hospedado.

### 1. Clone o repositório

```bash
git clone https://github.com/MPort0/TCC-SENAI2026-FRONT.git
```

### 2. Acesse a pasta do projeto

```bash
cd TCC-SENAI2026-FRONT
```

### 3. Abra o projeto no Visual Studio Code

```bash
code .
```

### 4. Configure a comunicação com o back-end

O arquivo responsável por definir o endereço da API é:

```text
JS/ipback.js
```

Para utilizar o back-end hospedado no Render:

```javascript
window.API_BASE = "https://tcc-senai2026-back.onrender.com";
```

Para utilizar um servidor local na porta 8080:

```javascript
window.API_BASE = "http://localhost:8080";
```

### 5. Execute o projeto

Abra o arquivo:

```text
HTML/login.html
```

Clique com o botão direito e selecione:

**Open with Live Server**

O front-end será aberto automaticamente no navegador.

Por utilizar HTML, CSS e JavaScript, a interface não necessita de um processo de compilação para ser executada.

## 🎨 Interface e experiência do usuário

A interface do AVA.Lia foi desenvolvida buscando proporcionar uma experiência intuitiva, moderna e organizada.

Entre os principais recursos visuais estão:

- Identidade visual própria;
- Sidebar de navegação;
- Ícones padronizados;
- Componentes reutilizáveis;
- Formulários interativos;
- Indicadores de progresso;
- Temas claro e escuro;
- Organização das páginas por funcionalidade.

O gerenciamento dos temas é realizado principalmente pelos arquivos:

```text
CSS/temas.css
JS/temas.js
```

## 🤖 Inteligência artificial — Lia

A Lia é a assistente virtual da plataforma, desenvolvida para auxiliar os usuários em sua preparação profissional.

Por meio da comunicação com o back-end, a plataforma oferece recursos como:

- Orientações profissionais;
- Simulações de entrevistas;
- Perguntas relacionadas ao mercado de trabalho;
- Análise de respostas;
- Devolutivas personalizadas;
- Apoio ao desenvolvimento profissional.

O processamento da inteligência artificial é realizado pelo back-end, mantendo as chaves de API fora do código do front-end.

## 🔄 Arquitetura da aplicação

```text
             USUÁRIO
                │
                ▼
           FRONT-END
     HTML, CSS e JavaScript
                │
                ▼
             API REST
                │
                ▼
            BACK-END
     Node.js, Express e TypeScript
           │          │
           ▼          ▼
        Prisma    Inteligência
        SQLite     Artificial
```

O front-end é responsável pela interação com o usuário, enquanto o back-end realiza o processamento das informações, o gerenciamento dos dados e a integração com os serviços de inteligência artificial.

## 🌐 Hospedagem

O projeto está hospedado na plataforma Render.

### Front-end

🔗 https://ava-lia.onrender.com

### Back-end

🔗 https://tcc-senai2026-back.onrender.com

### Configuração do Render

Tipo de serviço:

```text
Static Site
```

Branch:

```text
main
```

Build Command:

```bash
echo "Frontend pronto"
```

Publish Directory:

```text
.
```

### Redirecionamento inicial

| Configuração | Valor |
|--------------|-------|
| Source | / |
| Destination | /HTML/login.html |
| Action | Redirect |

Essa configuração permite que o usuário seja direcionado para a tela de login ao acessar o endereço principal da plataforma.

## 🔗 Repositórios

- [Front-end](https://github.com/MPort0/TCC-SENAI2026-FRONT)
- [Back-end](https://github.com/MPort0/TCC-SENAI2026-BACK)

## 📌 Status do projeto

🟢 Em desenvolvimento.

## 🎓 Projeto acadêmico

Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso técnico de Desenvolvimento de Sistemas do SENAI — 2026.

O AVA.Lia busca unir tecnologia, inteligência artificial e educação para facilitar a preparação e a inserção de pessoas no mercado de trabalho.

---

<p align="center">
  <strong>AVA.Lia — Tecnologia a favor do desenvolvimento profissional.</strong>
</p>
