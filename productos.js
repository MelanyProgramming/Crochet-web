/* ========================================
   PRODUCTOS JAVASCRIPT - Funcionalidades específicas de productos
   ======================================== */

// ========================================
// PRODUCT DATA
// ========================================
const products = [
    {
        id: 1,
        name: "Bufanda Elegante",
        description: "Bufanda tejida a crochet con hilo premium, perfecta para el invierno.",
        price: 25.99,
        image: "https://images.unsplash.com/photo-1601925260369-5b7b0a2b8b8b?w=400",
        colors: ["#8B4513", "#2F4F4F", "#800080", "#FF6347"],
        category: "accesorios",
        featured: true,
        stock: 15
    },
    {
        id: 2,
        name: "Cojín Decorativo",
        description: "Cojín tejido a mano con diseño floral único para tu hogar.",
        price: 35.50,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        colors: ["#FFB6C1", "#98FB98", "#F0E68C", "#DDA0DD"],
        category: "hogar",
        featured: true,
        stock: 8
    },
    {
        id: 3,
        name: "Vestido de Verano",
        description: "Vestido ligero y cómodo, ideal para días soleados.",
        price: 45.00,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400",
        colors: ["#FF69B4", "#00CED1", "#32CD32", "#FFD700"],
        category: "ropa",
        featured: true,
        stock: 12
    },
    {
        id: 4,
        name: "Set de Bebé",
        description: "Conjunto completo para bebé: gorrito, manoplas y botitas.",
        price: 30.75,
        image: "https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=400",
        colors: ["#FFC0CB", "#87CEEB", "#F0E68C", "#DDA0DD"],
        category: "bebes",
        featured: false,
        stock: 20
    },
    {
        id: 5,
        name: "Bolso Artesanal",
        description: "Bolso tejido a crochet, perfecto para el día a día.",
        price: 28.99,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
        colors: ["#8B4513", "#2F4F4F", "#800080", "#FF6347"],
        category: "accesorios",
        featured: false,
        stock: 10
    },
    {
        id: 6,
        name: "Manta de Sofá",
        description: "Manta decorativa para tu sofá, tejida con amor.",
        price: 55.00,
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        colors: ["#FFB6C1", "#98FB98", "#F0E68C", "#DDA0DD"],
        category: "hogar",
        featured: false,
        stock: 6
    }
];

// ========================================
// SHOPPING CART
// ========================================
let cart = [];

// ========================================
// CART FUNCTIONS
// ========================================
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    updateCartDisplay();
    showNotification(`${product.name} agregado al carrito!`);
    
    // Cart bubble animation
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.classList.add('bubble');
        setTimeout(() => cartBtn.classList.remove('bubble'), 500);
    }
    
    // Sparkle effect (safe when no event target)
    try {
        const evt = window.event;
        if (evt && evt.target && typeof evt.target.getBoundingClientRect === 'function') {
            const rect = evt.target.getBoundingClientRect();
            createSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
        } else if (cartBtn) {
            const rect = cartBtn.getBoundingClientRect();
            createSparkle(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    } catch (_) {}
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartDisplay();
}

function updateQuantity(productId, newQuantity) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            item.quantity = newQuantity;
            updateCartDisplay();
        }
    }
}

function updateCartDisplay() {
    const cartCount = document.getElementById('cartCount');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    if (cartItems) {
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Tu carrito está vacío</p>';
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <i class="fas fa-gem"></i>
                    </div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
        }
    }
    
    if (cartTotal) {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = `$${total.toFixed(2)}`;
    }
}

// ========================================
// CART MODAL FUNCTIONS
// ========================================
function openCart() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ========================================
// PRODUCT MODAL FUNCTIONS
// ========================================
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('productModal');
    const modalBody = document.getElementById('productModalBody');
    
    if (modal && modalBody) {
        modalBody.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center;">
                <div>
                    <div style="width: 100%; height: 300px; background: var(--gradient); border-radius: 15px; display: flex; align-items: center; justify-content: center; color: white; font-size: 4rem;">
                        <i class="fas fa-gem"></i>
                    </div>
                </div>
                <div>
                    <h2 style="color: var(--secondary-color); margin-bottom: 1rem;">${product.name}</h2>
                    <p style="color: var(--text-dark); margin-bottom: 1.5rem; line-height: 1.6;">${product.description}</p>
                    <div style="margin-bottom: 1rem;">
                        <strong style="color: var(--secondary-color);">Colores disponibles:</strong>
                        <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
                            ${product.colors.map(color => `
                                <div style="width: 30px; height: 30px; background: ${color}; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1);"></div>
                            `).join('')}
                        </div>
                    </div>
                    <div style="font-size: 2rem; font-weight: 700; color: var(--secondary-color); margin-bottom: 1.5rem;">
                        $${product.price.toFixed(2)}
                    </div>
                    <div style="display: flex; gap: 1rem;">
                        <button onclick="addToCart(${product.id}); closeProductModal();" style="flex: 1; background: var(--gradient); color: white; border: none; padding: 1rem; border-radius: 10px; font-weight: 600; cursor: pointer;">
                            Agregar al Carrito
                        </button>
                        <button onclick="closeProductModal()" style="background: white; color: var(--secondary-color); border: 2px solid var(--secondary-color); padding: 1rem; border-radius: 10px; font-weight: 600; cursor: pointer;">
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ========================================
// CHECKOUT FUNCTION
// ========================================
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío!', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simulate checkout process
    showNotification('Procesando pedido...', 'info');
    
    setTimeout(() => {
        showNotification(`¡Pedido realizado! Total: $${total.toFixed(2)}`, 'success');
        cart = [];
        updateCartDisplay();
        closeCartModal();
        
        // Create celebration sparkles
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                createSparkle(
                    Math.random() * window.innerWidth,
                    Math.random() * window.innerHeight
                );
            }, i * 100);
        }
    }, 2000);
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ========================================
// PRODUCT RENDERING FUNCTIONS
// ========================================
function renderProductsHomeOrCatalog() {
    const container = document.getElementById('productsCarousel');
    if (!container) return;
    
    // Show only featured products on home page
    const featuredProducts = products.filter(product => product.featured);
    
    container.innerHTML = '';
    featuredProducts.forEach((product, index) => {
        const productCard = createProductCard(product);
        productCard.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(productCard);
    });
}

function displayProducts(productsToShow = products) {
    const container = document.getElementById('productsGrid');
    if (!container) return;
    
    container.innerHTML = '';
    productsToShow.forEach((product, index) => {
        const productCard = createProductCard(product);
        productCard.style.animationDelay = `${index * 0.1}s`;
        container.appendChild(productCard);
    });
}

function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const colorsHtml = product.colors.slice(0, 3).map(color => 
        `<div class="color-dot" style="background: ${color}"></div>`
    ).join('');
    
    const moreColors = product.colors.length > 3 ? 
        `<span class="more-colors">+${product.colors.length - 3} más</span>` : '';
    
    const featuredBadge = product.featured ? 
        `<div class="featured-badge">
            <i class="fas fa-star"></i>
            <span>Destacado</span>
        </div>` : '';
    
    card.innerHTML = `
        ${featuredBadge}
        <div class="product-image">
            <i class="fas fa-gem" style="font-size: 4rem; color: white;"></i>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-colors">
                ${colorsHtml}
                ${moreColors}
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="add-to-cart-btn" data-add-id="${product.id}">
                    <i class="fas fa-shopping-cart"></i>
                    Agregar
                </button>
            </div>
        </div>
    `;

    // Open details when clicking the card (anywhere except the add button)
    card.addEventListener('click', () => {
        showProductDetails(product.id);
    });
    
    // Prevent card click when pressing the add button
    const addBtn = card.querySelector('[data-add-id]');
    if (addBtn) {
        addBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(product.id);
        });
    }
    
    return card;
}

// ========================================
// FILTER FUNCTIONS
// ========================================
function filterProducts(category) {
    const filteredProducts = category === 'todos' ? products : products.filter(product => product.category === category);
    displayProducts(filteredProducts);
    
    // Update active filter button
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

// ========================================
// INITIALIZATION FUNCTION
// ========================================
function initProducts() {
    // Set up cart event listeners
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCart');
    const checkoutBtn = document.getElementById('checkoutBtn');
    const closeProductModalBtn = document.getElementById('closeProductModal');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', openCart);
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', closeCartModal);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', checkout);
    }
    
    if (closeProductModalBtn) {
        closeProductModalBtn.addEventListener('click', closeProductModal);
    }
    
    // Set up filter buttons
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const category = e.target.getAttribute('data-category') || 'todos';
            filterProducts(category);
        });
    });
    
    // Initialize display
    const currentPage = window.location.pathname;
    if (currentPage.includes('productos.html')) {
        displayProducts();
    } else {
        renderProductsHomeOrCatalog();
    }
    
    // Load cart from storage
    loadCartFromStorage();
    
    console.log('Products module initialized successfully!');
}

// ========================================
// STORAGE FUNCTIONS
// ========================================
function saveCartToStorage() {
    localStorage.setItem('atelierMelyCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('atelierMelyCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Save cart whenever it changes
const originalAddToCart = addToCart;
const originalRemoveFromCart = removeFromCart;
const originalUpdateQuantity = updateQuantity;

addToCart = function(productId) {
    originalAddToCart(productId);
    saveCartToStorage();
};

removeFromCart = function(productId) {
    originalRemoveFromCart(productId);
    saveCartToStorage();
};

updateQuantity = function(productId, newQuantity) {
    originalUpdateQuantity(productId, newQuantity);
    saveCartToStorage();
};

// ========================================
// MAKE FUNCTIONS GLOBALLY AVAILABLE
// ========================================
window.initProducts = initProducts;
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.openCart = openCart;
window.closeCartModal = closeCartModal;
window.showProductDetails = showProductDetails;
window.closeProductModal = closeProductModal;
window.checkout = checkout;
window.filterProducts = filterProducts;
window.showNotification = showNotification;