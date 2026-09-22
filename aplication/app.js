document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Saudação
    const horaAtual = new Date().getHours();
    const saudacao = (horaAtual >= 5 && horaAtual < 12) ? "Bom dia" 
                   : (horaAtual >= 12 && horaAtual < 18) ? "Boa tarde" 
                   : "Boa noite";
    
    const greetingElement = document.getElementById("greeting");
    if (greetingElement) greetingElement.textContent = saudacao;

    // 2. Navegação entre as Abas
    const btnHome = document.querySelector('.nav-btn.act1');
    const btnAdd = document.querySelector('.nav-btn.act2');
    const btnMapa = document.querySelector('.nav-btn.act3');

    const pageHome = document.getElementById('page-home');
    const pageValor = document.getElementById('page-valor');
    const pageMapa = document.getElementById('page-mapa');

    function resetPages() {
        if (pageHome) pageHome.classList.remove('active');
        if (pageValor) pageValor.classList.remove('active');
        if (pageMapa) pageMapa.classList.remove('active');

        if (btnHome) btnHome.classList.remove('active');
        if (btnAdd) btnAdd.classList.remove('active');
        if (btnMapa) btnMapa.classList.remove('active');
    }

    if (btnHome) {
        btnHome.addEventListener('click', () => {
            resetPages();
            if (pageHome) pageHome.classList.add('active');
            btnHome.classList.add('active');
        });
    }

    if (btnAdd) {
        btnAdd.addEventListener('click', () => {
            resetPages();
            if (pageValor) pageValor.classList.add('active');
            btnAdd.classList.add('active');
        });
    }

    if (btnMapa) {
        btnMapa.addEventListener('click', () => {
            resetPages();
            if (pageMapa) pageMapa.classList.add('active');
            btnMapa.classList.add('active');
        });
    }

    // 3. Filtros na Página Inicial (Home)
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            const cards = document.querySelectorAll('#page-home .news-card');

            cards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'todos' || category === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // 4. Seleção de Tipo na Aba "Adicionar"
    let categoriaSelecionada = 'problema';
    const fuelCards = document.querySelectorAll('.fuel-card');
    
    fuelCards.forEach(card => {
        card.addEventListener('click', () => {
            fuelCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            categoriaSelecionada = card.getAttribute('data-type');
        });
    });

    // Mapeamento de Categoria -> Classe e Texto da Badge
    const badgeMap = {
        'problema':  { class: 'badge-problema', text: 'PROBLEMA' },
        'solucao':   { class: 'badge-solucao',  text: 'SOLUÇÃO' },
        'ideia':     { class: 'badge-ideia',    text: 'IDEIA' },
        'avaliacao': { class: 'badge-avaliacao',text: 'AVALIAÇÃO' }
    };

    // 5. Publicar Nova Ocorrência
    const btnSubmit = document.getElementById('btn-1');
    if (btnSubmit) {
        btnSubmit.addEventListener('click', (e) => {
            e.preventDefault();

            const inputTitulo = document.getElementById('complaint-title-input');
            const inputSetor = document.getElementById('complaint-sector-input');
            const inputDescricao = document.getElementById('extra-info-input');

            const titulo = inputTitulo.value.trim();
            const setor = inputSetor.value.trim();
            const descricao = inputDescricao.value.trim();

            if (!titulo || !descricao) {
                alert('Preencha o título e a descrição.');
                return;
            }

            const feedContainer = document.querySelector('#page-home .fuel-news');
            if (feedContainer) {
                const cardId = 'News-' + Date.now();
                const badgeInfo = badgeMap[categoriaSelecionada] || badgeMap['problema'];
                const textoSetor = setor ? ` [${setor}]` : '';

                // Gera os botões de acordo com o tipo
                let acoesHTML = '';
                if (categoriaSelecionada === 'avaliacao') {
                    acoesHTML = `
                        <div class="rating-scale">
                            <button class="btn-rating" onclick="avaliar('${cardId}', 1)">1</button>
                            <button class="btn-rating" onclick="avaliar('${cardId}', 2)">2</button>
                            <button class="btn-rating" onclick="avaliar('${cardId}', 3)">3</button>
                            <button class="btn-rating" onclick="avaliar('${cardId}', 4)">4</button>
                            <button class="btn-rating" onclick="avaliar('${cardId}', 5)">5</button>
                        </div>
                    `;
                } else {
                    acoesHTML = `
                        <button class="btn-float btn-disagree" onclick="votar('${cardId}', 'discordo')">Discordo</button>
                        <button class="btn-float btn-agree" onclick="votar('${cardId}', 'concordo')">Concordo</button>
                    `;
                }

                // Criar o HTML do novo card
                const newCardHTML = `
                    <div id="${cardId}" class="news-card" data-category="${categoriaSelecionada}">
                        <div class="card-header">
                            <span>${titulo}${textoSetor}</span>
                        </div>
                        <div class="content">
                            <p>"${descricao}"</p>
                        </div>
                        <div class="card-footer">
                            <span class="badge ${badgeInfo.class}">${badgeInfo.text}</span>
                            <div class="card-actions">
                                ${acoesHTML}
                            </div>
                        </div>
                    </div>
                `;

                // Adiciona o card no topo
                feedContainer.insertAdjacentHTML('afterbegin', newCardHTML);
            }

            // Resetar formulário
            inputTitulo.value = '';
            if (inputSetor) inputSetor.value = '';
            inputDescricao.value = '';

            // Resetar filtro na Home para "TODOS"
            const btnTodos = document.querySelector('.filter-btn[data-filter="todos"]');
            if (btnTodos) btnTodos.click();

            // Voltar para a Home
            if (btnHome) btnHome.click();
        });
    }

    // 6. Filtros de Status na Página 3
    const statusFilterBtns = document.querySelectorAll('.filter-btn-status');
    statusFilterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            statusFilterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-status');
            const statusCards = document.querySelectorAll('.status-card');

            statusCards.forEach(card => {
                const status = card.getAttribute('data-status');
                if (filterValue === 'todos' || status === filterValue) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// Votação: Circula o botão clicado (Concordo / Discordo)
window.votar = function(cardId, tipo) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const btnAgree = card.querySelector('.btn-agree');
    const btnDisagree = card.querySelector('.btn-disagree');

    if (tipo === 'concordo') {
        if (btnAgree) btnAgree.classList.toggle('selected');
        if (btnDisagree) btnDisagree.classList.remove('selected');
    } else if (tipo === 'discordo') {
        if (btnDisagree) btnDisagree.classList.toggle('selected');
        if (btnAgree) btnAgree.classList.remove('selected');
    }
};

// Avaliação: Seleciona o número clicado (1 a 5)
window.avaliar = function(cardId, valor) {
    const card = document.getElementById(cardId);
    if (!card) return;

    const ratingBtns = card.querySelectorAll('.btn-rating');
    ratingBtns.forEach(btn => {
        if (btn.textContent.trim() === String(valor)) {
            btn.classList.toggle('selected');
        } else {
            btn.classList.remove('selected');
        }
    });
};