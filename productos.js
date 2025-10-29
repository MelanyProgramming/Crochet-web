/* Productos dinámicos desde localStorage */
(function(){
    const STORAGE_KEY = 'amc_products';

    function getItems() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error leyendo productos', e);
            return [];
        }
    }

    function money(v){
        const n = Number(v);
        return isNaN(n) ? v : `$${n.toFixed(2)}`;
    }

    function createCard(item){
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', item.category || 'todos');
        card.innerHTML = `
            <div class="product-image">
                <img src="${item.imageDataUrl}" alt="${(item.title||'Producto').replace(/"/g,'&quot;')}">
            </div>
            <div class="product-info">
                <h3>${item.title || 'Sin título'}</h3>
                <p class="product-price">${money(item.price)}</p>
            </div>
        `;
        return card;
    }

    function renderGrid() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        const items = getItems();
        grid.innerHTML = '';
        items.forEach(item => grid.appendChild(createCard(item)));
        bindFilters();
    }

    function bindFilters(){
        const buttons = document.querySelectorAll('.filter-btn');
        const grid = document.getElementById('productsGrid');
        if (!grid || buttons.length === 0) return;
        buttons.forEach(btn => {
            btn.addEventListener('click', function(){
                buttons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                const cat = this.getAttribute('data-category');
                Array.from(grid.children).forEach(el => {
                    const ecat = el.getAttribute('data-category') || 'todos';
                    const show = cat === 'todos' || cat === ecat;
                    el.style.display = show ? '' : 'none';
                });
            });
        });
    }

    function renderFeatured(){
        const carousel = document.getElementById('productsCarousel');
        if (!carousel) return;
        const items = getItems().slice(0, 6);
        carousel.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card featured';
            card.innerHTML = `
                <div class="product-image">
                    <img src="${item.imageDataUrl}" alt="${(item.title||'Producto').replace(/"/g,'&quot;')}">
                </div>
                <div class="product-info">
                    <h3>${item.title || 'Sin título'}</h3>
                    <p class="product-price">${money(item.price)}</p>
                </div>
            `;
            carousel.appendChild(card);
        });
    }

    window.initProducts = function(){
        renderGrid();
        renderFeatured();
    }
})();

