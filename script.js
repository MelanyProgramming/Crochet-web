// Product Data
const products = [
    {
        id: 1,
        name: "Gorro de Invierno",
        description: "Gorro tejido a crochet con hilo suave y cálido, perfecto para el invierno. Diseño elegante con patrones únicos.",
        price: 25.00,
        category: "accesorios",
        image: "🧶",
        colors: ["Rosa", "Azul", "Verde", "Morado"],
        material: "Algodón 100% premium",
        size: "Única",
        featured: true
    },
    {
        id: 2,
        name: "Bufanda Elegante",
        description: "Bufanda larga y suave tejida con patrones únicos, ideal para cualquier ocasión.",
        price: 35.00,
        category: "accesorios",
        image: "🧣",
        colors: ["Negro", "Gris", "Beige"],
        material: "Lana merino",
        size: "180cm x 25cm"
    },
    {
        id: 3,
        name: "Mantel de Mesa",
        description: "Mantel circular tejido con delicados patrones florales para decorar tu mesa.",
        price: 45.00,
        category: "hogar",
        image: "🍽️",
        colors: ["Blanco", "Cremoso"],
        material: "Algodón premium",
        size: "Diámetro 90cm"
    },
    {
        id: 4,
        name: "Cojín Decorativo",
        description: "Cojín suave y cómodo con diseño geométrico moderno.",
        price: 30.00,
        category: "hogar",
        image: "🛋️",
        colors: ["Multicolor", "Gris", "Rosa"],
        material: "Algodón y poliéster",
        size: "40cm x 40cm"
    },
    {
        id: 5,
        name: "Chaleco de Verano",
        description: "Chaleco ligero y elegante perfecto para las tardes de verano.",
        price: 55.00,
        category: "ropa",
        image: "👚",
        colors: ["Blanco", "Beige", "Azul claro"],
        material: "Algodón fino",
        size: "S, M, L, XL"
    },
    {
        id: 6,
        name: "Bolso Bohemio",
        description: "Bolso tejido con estilo bohemio, espacioso y resistente.",
        price: 40.00,
        category: "accesorios",
        image: "👜",
        colors: ["Marrón", "Negro", "Verde"],
        material: "Yute y algodón",
        size: "30cm x 25cm"
    },
    {
        id: 7,
        name: "Alfombra Circular",
        description: "Alfombra suave y decorativa con patrones étnicos.",
        price: 80.00,
        category: "hogar",
        image: "🟢",
        colors: ["Multicolor", "Beige", "Gris"],
        material: "Lana natural",
        size: "Diámetro 120cm"
    },
    {
        id: 8,
        name: "Cardigan Abierto",
        description: "Cardigan elegante y cómodo perfecto para cualquier ocasión. Tejido con patrones delicados y acabados perfectos.",
        price: 75.00,
        category: "ropa",
        image: "🧥",
        colors: ["Negro", "Gris", "Beige", "Morado"],
        material: "Lana merino premium",
        size: "S, M, L, XL",
        featured: true
    },
    {
        id: 9,
        name: "Set de Cojines Decorativos",
        description: "Set de 2 cojines con diseños florales únicos, perfectos para decorar tu sala o dormitorio.",
        price: 45.00,
        category: "hogar",
        image: "🛋️",
        colors: ["Multicolor", "Rosa", "Verde"],
        material: "Algodón y poliéster premium",
        size: "40cm x 40cm cada uno"
    },
    {
        id: 10,
        name: "Manta de Bebé",
        description: "Manta suave y cálida tejida con amor para los más pequeños. Diseño delicado y materiales hipoalergénicos.",
        price: 60.00,
        category: "hogar",
        image: "👶",
        colors: ["Rosa", "Azul", "Amarillo", "Verde"],
        material: "Algodón orgánico",
        size: "80cm x 80cm"
    },
    {
        id: 11,
        name: "Bolso de Playa",
        description: "Bolso espacioso y resistente perfecto para la playa. Tejido con hilos resistentes al agua.",
        price: 35.00,
        category: "accesorios",
        image: "🏖️",
        colors: ["Azul", "Blanco", "Rosa"],
        material: "Yute y algodón resistente",
        size: "35cm x 30cm"
    },
    {
        id: 12,
        name: "Vestido de Verano",
        description: "Vestido ligero y elegante tejido con hilos finos. Perfecto para días soleados y ocasiones especiales.",
        price: 85.00,
        category: "ropa",
        image: "👗",
        colors: ["Blanco", "Rosa", "Azul claro"],
        material: "Algodón fino premium",
        size: "XS, S, M, L, XL"
    }
];

// Shopping Cart
let cart = [];

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cartModal');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const productModal = document.getElementById('productModal');
const closeProductModal = document.getElementById('closeProductModal');
const productModalBody = document.getElementById('productModalBody');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');

// Initialize the application
// Render products for home carousel or full grid
function renderProductsHomeOrCatalog() {
    const isHome = document.getElementById('productsCarousel');
    const isCatalog = document.getElementById('productsGrid');
    if (isHome) {
        // Home: mostrar solo 4 productos destacados en carrusel
        const featured = products.filter(p => p.featured).slice(0, 4);
        const carousel = document.getElementById('productsCarousel');
        carousel.innerHTML = '';
        featured.forEach(product => {
            const card = createProductCard(product);
            carousel.appendChild(card);
        });
    } else if (isCatalog) {
        // Catálogo: mostrar todos los productos
        displayProducts(products);
    }
}

// Smooth page transition for header links
function setupHeaderTransitions() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = link.getAttribute('href');
            if (!href || href.startsWith('javascript:') || link.hasAttribute('data-no-fade')) return;
            // Si es ancla interna en la misma página
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            } else if (window.location.pathname.replace(/\\/g, '/') !== '/' + href.replace(/^\//, '')) {
                // Si es a otra página
                e.preventDefault();
                document.body.style.transition = 'opacity 0.5s cubic-bezier(.4,0,.2,1)';
                document.body.style.opacity = '0';
                setTimeout(() => {
                    window.location.href = href;
                }, 400);
            }
        });
    });
}

// Animación de entrada fade-in-up para secciones
function setupFadeInSections() {
    const fadeSections = document.querySelectorAll('.fade-in-up');
    const reveal = () => {
        fadeSections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top < window.innerHeight - 80) {
                section.classList.add('visible');
            }
        });
    };
    window.addEventListener('scroll', reveal);
    reveal();
}

// FAQ colapsable
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            item.classList.toggle('open');
            // Cerrar otros
            faqItems.forEach(other => {
                if (other !== item) other.classList.remove('open');
            });
        });
    });
}

// Botón Ir Arriba
function setupScrollToTop() {
    const btn = document.getElementById('scrollToTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Parallax en hero y separadores
function setupParallax() {
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        const hero = document.querySelector('.hero');
        const seps = document.querySelectorAll('.svg-separator, .svg-separator-bottom');
        if (hero) hero.style.backgroundPosition = `center ${y * 0.18}px`;
        seps.forEach(sep => {
            sep.style.backgroundPosition = `center ${-y * 0.08}px`;
        });
    });
}

// Carousel automático en testimonios
function setupTestimonialsCarousel() {
    const grid = document.querySelector('.testimonials-grid');
    if (!grid) return;
    let scroll = 0;
    let maxScroll = grid.scrollWidth - grid.clientWidth;
    setInterval(() => {
        if (window.innerWidth < 900) return;
        scroll += 380;
        if (scroll > maxScroll) scroll = 0;
        grid.scrollTo({ left: scroll, behavior: 'smooth' });
    }, 4000);
}

// Sparkles/confetti animados y burbuja en carrito
function showSparkles(x, y) {
    const container = document.getElementById('sparkle-container');
    for (let i = 0; i < 8; i++) {
        const s = document.createElement('div');
        s.className = 'sparkle';
        s.style.left = (x + Math.random() * 40 - 20) + 'px';
        s.style.top = (y + Math.random() * 20 - 10) + 'px';
        s.innerHTML = '<svg width="18" height="18" viewBox="0 0 18 18"><polygon fill="#c8a2c8" points="9,0 11,7 18,9 11,11 9,18 7,11 0,9 7,7"/></svg>';
        container.appendChild(s);
        setTimeout(() => s.remove(), 1200);
    }
}

// Burbuja en carrito al agregar producto
function bubbleCartBtn() {
    const btn = document.querySelector('.cart-btn');
    if (!btn) return;
    btn.classList.add('bubble');
    setTimeout(() => btn.classList.remove('bubble'), 500);
}

// Mejorar addToCart para sparkles y burbuja
const originalAddToCart = window.addToCart;
window.addToCart = function(productId) {
    if (typeof originalAddToCart === 'function') originalAddToCart(productId);
    const btn = document.querySelector('.cart-btn');
    if (btn) {
        const rect = btn.getBoundingClientRect();
        showSparkles(rect.left + rect.width/2, rect.top + rect.height/2);
        bubbleCartBtn();
    }
};

// Micro-interacciones en botones
function setupButtonInteractions() {
    document.querySelectorAll('button, .cta-button, .add-to-cart-btn').forEach(btn => {
        btn.addEventListener('mousedown', () => btn.classList.add('pressed'));
        btn.addEventListener('mouseup', () => btn.classList.remove('pressed'));
        btn.addEventListener('mouseleave', () => btn.classList.remove('pressed'));
    });
}

// Modal de logo grande
function setupLogoModal() {
    const logo = document.querySelector('.main-logo');
    const modal = document.getElementById('logoModal');
    const closeBtn = document.getElementById('closeLogoModal');
    if (!logo || !modal || !closeBtn) return;
    logo.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    renderProductsHomeOrCatalog();
    setupEventListeners();
    setupHeaderTransitions();
    setupFadeInSections();
    setupFAQ();
    setupScrollToTop();
    setupParallax();
    setupTestimonialsCarousel();
    setupButtonInteractions();
    setupLogoModal();
    loadCartFromStorage();
    updateCartDisplay();
    // Fade in on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s cubic-bezier(.4,0,.2,1)';
    setTimeout(() => { document.body.style.opacity = '1'; }, 80);
});

// Setup Event Listeners
function setupEventListeners() {
    // Cart functionality
    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartModal);
    checkoutBtn.addEventListener('click', checkout);
    
    // Product modal
    closeProductModal.addEventListener('click', closeProductModalFunc);
    
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterProducts(category);
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Mobile menu
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === cartModal) closeCartModal();
        if (e.target === productModal) closeProductModalFunc();
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}

// Display Products
function displayProducts(productsToShow) {
    productsGrid.innerHTML = '';
    
    productsToShow.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create Product Card
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    const featuredBadge = product.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> Destacado</div>' : '';
    
    card.innerHTML = `
        <div class="product-image">
            ${featuredBadge}
            <span style="font-size: 4rem;">${product.image}</span>
            <div class="product-overlay">
                <div class="overlay-buttons">
                    <button class="overlay-btn" onclick="showProductDetails(${product.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="overlay-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-description">${product.description}</p>
            <div class="product-colors">
                ${product.colors.slice(0, 3).map(color => 
                    `<span class="color-dot" style="background-color: ${getColorValue(color)}"></span>`
                ).join('')}
                ${product.colors.length > 3 ? `<span class="more-colors">+${product.colors.length - 3}</span>` : ''}
            </div>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <div class="product-actions">
                <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-cart"></i> Agregar
                </button>
                <button class="view-details-btn" onclick="showProductDetails(${product.id})">
                    Ver Detalles
                </button>
            </div>
        </div>
    `;
    return card;
}

// Helper function to get color values
function getColorValue(colorName) {
    const colorMap = {
        'Rosa': '#ffb6c1',
        'Azul': '#87ceeb',
        'Verde': '#98fb98',
        'Negro': '#2c2c2c',
        'Gris': '#d3d3d3',
        'Beige': '#f5f5dc',
        'Blanco': '#ffffff',
        'Cremoso': '#fffdd0',
        'Multicolor': 'linear-gradient(45deg, #ffb6c1, #87ceeb, #98fb98)',
        'Marrón': '#8b4513',
        'Amarillo': '#ffffe0',
        'Morado': '#dda0dd',
        'Azul claro': '#b0e0e6'
    };
    return colorMap[colorName] || '#cccccc';
}

// Filter Products
function filterProducts(category) {
    let filteredProducts;
    if (category === 'todos') {
        filteredProducts = products;
    } else {
        filteredProducts = products.filter(product => product.category === category);
    }
    displayProducts(filteredProducts);
}

// Shopping Cart Functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartDisplay();
    showNotification('Producto agregado al carrito');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        saveCartToStorage();
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-light);">Tu carrito está vacío</p>';
        cartTotal.textContent = '$0.00';
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-image">
                <span style="font-size: 1.5rem;">${item.image}</span>
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `$${total.toFixed(2)}`;
}

// Cart Modal Functions
function openCart() {
    cartModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    cartModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Product Modal Functions
function showProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    productModalBody.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem;">
            <div class="product-image" style="height: 400px;">
                <span style="font-size: 8rem;">${product.image}</span>
            </div>
            <div>
                <h2 style="font-size: 2rem; margin-bottom: 1rem; color: var(--secondary-color);">${product.name}</h2>
                <p style="color: var(--text-light); margin-bottom: 1.5rem; line-height: 1.6;">${product.description}</p>
                
                <div style="margin-bottom: 1.5rem;">
                    <h3 style="font-size: 2.5rem; color: var(--secondary-color); margin-bottom: 1rem;">$${product.price.toFixed(2)}</h3>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="margin-bottom: 0.5rem;">Colores disponibles:</h4>
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                        ${product.colors.map(color => `<span style="background: var(--light-bg); padding: 0.5rem 1rem; border-radius: 20px; font-size: 0.9rem;">${color}</span>`).join('')}
                    </div>
                </div>
                
                <div style="margin-bottom: 1.5rem;">
                    <h4 style="margin-bottom: 0.5rem;">Material:</h4>
                    <p>${product.material}</p>
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <h4 style="margin-bottom: 0.5rem;">Tamaño:</h4>
                    <p>${product.size}</p>
                </div>
                
                <button class="add-to-cart-btn" style="width: 100%; font-size: 1.1rem; padding: 1rem;" onclick="addToCart(${product.id}); closeProductModalFunc();">
                    <i class="fas fa-shopping-cart"></i> Agregar al Carrito
                </button>
            </div>
        </div>
    `;
    
    productModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeProductModalFunc() {
    productModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Checkout Function
function checkout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'error');
        return;
    }
    
    // Simulate checkout process
    showNotification('Procesando tu pedido...', 'info');
    
    setTimeout(() => {
        showNotification('¡Pedido realizado con éxito! Te contactaremos pronto.', 'success');
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        closeCartModal();
    }, 2000);
}

// Mobile Menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
}

// Contact Form Handler
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    if (!name || !email || !message) {
        showNotification('Por favor completa todos los campos', 'error');
        return;
    }
    
    showNotification('Mensaje enviado con éxito. Te responderemos pronto.', 'success');
    e.target.reset();
}

// Storage Functions
function saveCartToStorage() {
    localStorage.setItem('crochetCart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('crochetCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Notification System
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            animation: slideIn 0.3s ease;
            max-width: 300px;
        ">
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .nav-menu.active {
        display: flex !important;
        flex-direction: column;
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        padding: 1rem;
        gap: 1rem;
    }
`;
document.head.appendChild(style);

// Smooth scroll behavior for better UX
document.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Add loading animation for better UX
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add some interactive animations
document.addEventListener('mousemove', function(e) {
    const floatingItems = document.querySelectorAll('.floating-item');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    floatingItems.forEach((item, index) => {
        const speed = (index + 1) * 0.5;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        
        item.style.transform = `translate(${x}px, ${y}px)`;
    });
}); 