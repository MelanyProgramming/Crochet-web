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

    function createCard(item, index = 0){
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', item.category || 'todos');
        card.setAttribute('data-aos', 'fade-up');
        card.setAttribute('data-aos-delay', (index * 100).toString());
        const hasImage = item.imageDataUrl && item.imageDataUrl.trim() !== '';
        const imageHTML = hasImage 
            ? `<img src="${item.imageDataUrl}" alt="${(item.title||'Producto').replace(/"/g,'&quot;')}" loading="lazy">`
            : `<div class="product-placeholder">
                <i class="fas fa-gem"></i>
                <div class="placeholder-shine"></div>
               </div>`;
        card.innerHTML = `
            <div class="product-image">
                ${imageHTML}
                <div class="product-overlay">
                    <div class="overlay-buttons">
                        <button class="overlay-btn view-btn" title="Ver detalles">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="overlay-btn cart-btn-overlay" title="Agregar al carrito">
                            <i class="fas fa-shopping-cart"></i>
                        </button>
                    </div>
                </div>
                ${item.category === 'accesorios' ? '<div class="featured-badge"><i class="fas fa-star"></i> Nuevo</div>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${item.title || 'Sin título'}</h3>
                ${item.description ? `<p class="product-description">${item.description.substring(0, 80)}${item.description.length > 80 ? '...' : ''}</p>` : ''}
                <div class="product-footer">
                    <p class="product-price">${money(item.price)}</p>
                    <button class="add-to-cart-btn" data-product-id="${item.id || ''}">
                        <i class="fas fa-plus"></i> Agregar
                    </button>
                </div>
            </div>
        `;
        
        // Add click handlers
        const viewBtn = card.querySelector('.view-btn');
        const cartBtn = card.querySelector('.cart-btn-overlay, .add-to-cart-btn');
        
        if (viewBtn) {
            viewBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showProductDetails(item);
            });
        }
        
        if (cartBtn) {
            cartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                addToCart(item);
            });
        }
        
        card.addEventListener('click', () => showProductDetails(item));
        
        return card;
    }
    
    function showProductDetails(item) {
        // This would open a modal with product details
        console.log('View product:', item);
    }
    
    function addToCart(item) {
        // This would add item to cart
        console.log('Add to cart:', item);
        // Show notification
        showNotification('Producto agregado al carrito! ✨');
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'product-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    function renderGrid() {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;
        const items = getItems();
        grid.innerHTML = '';
        
        if (items.length === 0) {
            // Show empty state with message
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="empty-icon">
                    <i class="fas fa-gem"></i>
                </div>
                <h3>No hay productos aún</h3>
                <p>Agrega productos desde el dashboard para verlos aquí</p>
            `;
            grid.appendChild(emptyState);
        } else {
            items.forEach((item, index) => {
                grid.appendChild(createCard(item, index));
            });
        }
        
        bindFilters();
        
        // Initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
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
        
        if (items.length === 0) {
            // Show placeholder products if no products exist
            const placeholderProducts = [
                { title: 'Bufanda de Crochet', price: '25.00', category: 'accesorios', description: 'Bufanda suave y cálida tejida a mano', id: 'placeholder-1' },
                { title: 'Cojín Decorativo', price: '18.50', category: 'hogar', description: 'Cojín decorativo para tu hogar', id: 'placeholder-2' },
                { title: 'Vestido Veraniego', price: '35.00', category: 'ropa', description: 'Vestido ligero y cómodo', id: 'placeholder-3' },
                { title: 'Set para Bebé', price: '28.00', category: 'bebes', description: 'Set completo para bebé', id: 'placeholder-4' }
            ];
            placeholderProducts.forEach((item, index) => {
                const card = createCard(item, index);
                card.classList.add('featured', 'placeholder-product');
                carousel.appendChild(card);
            });
        } else {
            items.forEach((item, index) => {
                const card = createCard(item, index);
                card.classList.add('featured');
                carousel.appendChild(card);
            });
        }
        
        // Initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    window.initProducts = function(){
        renderGrid();
        renderFeatured();
    }
})();

