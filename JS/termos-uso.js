document.addEventListener('DOMContentLoaded', () => {
            // Elementos DOM
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabContents = document.querySelectorAll('.tab-content');
            const sidebarList = document.getElementById('sidebarList');
            const searchInput = document.getElementById('searchInput');
            const themeToggleBtn = document.getElementById('themeToggleBtn');
            const themeText = document.getElementById('themeText');
            const checkTerms = document.getElementById('checkTerms');
            const checkMarketing = document.getElementById('checkMarketing');
            const btnConfirm = document.getElementById('btnConfirm');
            const logModal = document.getElementById('logModal');
            const logDetails = document.getElementById('logDetails');
            const btnCloseModal = document.getElementById('btnCloseModal');
            const sidebarToggleMobile = document.getElementById('sidebarToggleMobile');
            const sidebarNav = document.getElementById('sidebarNav');

            const toggleTheme = () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
                
                document.documentElement.setAttribute('data-theme', newTheme);
                themeText.textContent = newTheme === 'dark' ? 'Modo Claro' : 'Modo Escuro';
                themeToggleBtn.querySelector('i').className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
            };

            themeToggleBtn.addEventListener('click', toggleTheme);

            const updateSidebar = () => {
                sidebarList.innerHTML = '';
                const activeTab = document.querySelector('.tab-content.active');
                const sections = activeTab.querySelectorAll('.doc-section');

                sections.forEach(sec => {
                    const title = sec.querySelector('h2').textContent;
                    const id = sec.getAttribute('id');
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    
                    a.href = `#${id}`;
                    a.textContent = title;
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
                        
                        // Fecha a sidebar mobile caso esteja aberta
                        sidebarNav.classList.remove('open');

                        // Marca ativo na sidebar
                        document.querySelectorAll('.sidebar-nav a').forEach(link => link.classList.remove('active'));
                        a.classList.add('active');
                    });

                    li.appendChild(a);
                    sidebarList.appendChild(li);
                });
            };

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    const targetTab = btn.getAttribute('data-tab');

                    tabBtns.forEach(b => b.classList.remove('active'));
                    tabContents.forEach(c => c.classList.remove('active'));

                    btn.classList.add('active');
                    document.getElementById(`tab-${targetTab}`).classList.add('active');

                    // Resetar busca ao trocar de aba
                    searchInput.value = '';
                    resetSearch();

                    // Atualizar índice da sidebar
                    updateSidebar();
                });
            });

            // Toggle Sidebar em telas Mobile
            sidebarToggleMobile.addEventListener('click', () => {
                sidebarNav.classList.toggle('open');
            });

            const handleSearch = () => {
                const query = searchInput.value.trim().toLowerCase();
                const activeTab = document.querySelector('.tab-content.active');
                const sections = activeTab.querySelectorAll('.doc-section');

                sections.forEach(section => {
                    const text = section.textContent.toLowerCase();
                    if (query === '') {
                        section.style.display = 'block';
                    } else if (text.includes(query)) {
                        section.style.display = 'block';
                    } else {
                        section.style.display = 'none';
                    }
                });
            };

            const resetSearch = () => {
                const activeTab = document.querySelector('.tab-content.active');
                const sections = activeTab.querySelectorAll('.doc-section');
                sections.forEach(section => section.style.display = 'block');
            };

            searchInput.addEventListener('input', handleSearch);

            checkTerms.addEventListener('change', () => {
                btnConfirm.disabled = !checkTerms.checked;
            });

            btnConfirm.addEventListener('click', () => {
                const logData = {
                    userId: 'usr_' + Math.random().toString(36).substring(2, 11),
                    timestamp: new Date().toISOString(),
                    termosAceito: checkTerms.checked,
                    marketingAceito: checkMarketing.checked,
                    versaoDocumentos: 'v2.4 (Setembro/2026)',
                    ipOrigem: '189.120.' + Math.floor(Math.random() * 255) + '.' + Math.floor(Math.random() * 255)
                };

                logDetails.textContent = JSON.stringify(logData, null, 2);
                logModal.classList.add('active');
            });

            btnCloseModal.addEventListener('click', () => {
                logModal.classList.remove('active');
            });

            // Fechar modal ao clicar fora
            logModal.addEventListener('click', (e) => {
                if (e.target === logModal) {
                    logModal.classList.remove('active');
                }
            });

            // Inicialização Inicial
            updateSidebar();
        });