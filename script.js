/* ========================================
   ATELIER MELY CROCHET - JAVASCRIPT BASE
   Funcionalidades generales de la aplicación
   ======================================== */

// ========================================
// UTILITY FUNCTIONS
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// ========================================
// HEADER FUNCTIONALITY
// ========================================
function setupHeaderTransitions() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Header scroll effect
    const handleScroll = throttle(() => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(246, 241, 250, 0.95)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = '#f6f1fa';
            header.style.backdropFilter = 'blur(10px)';
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    
    // Active link highlighting
    const sections = document.querySelectorAll('section[id]');
    const observerOptions = {
        rootMargin: '-20% 0px -35% 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);
    
    sections.forEach(section => observer.observe(section));
}

// ========================================
// MOBILE MENU
// ========================================
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
        
        // Close menu when clicking on links
        navMenu.addEventListener('click', (e) => {
            if (e.target.classList.contains('nav-link')) {
                navMenu.classList.remove('active');
                const icon = menuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    }
}

// ========================================
// FADE IN ANIMATIONS
// ========================================
function setupFadeInSections() {
    const fadeElements = document.querySelectorAll('.fade-in-up');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    fadeElements.forEach(element => observer.observe(element));
}

// ========================================
// FAQ FUNCTIONALITY
// ========================================
function setupFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isOpen = item.classList.contains('open');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('open');
                }
            });
            
            // Toggle current item
            item.classList.toggle('open', !isOpen);
        });
    });
}

// ========================================
// SCROLL TO TOP
// ========================================
function setupScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTopBtn');
    
    if (scrollBtn) {
        const handleScroll = throttle(() => {
            if (window.scrollY > 300) {
                scrollBtn.classList.add('visible');
            } else {
                scrollBtn.classList.remove('visible');
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        
        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ========================================
// PARALLAX EFFECTS
// ========================================
function setupParallax() {
    const parallaxElements = document.querySelectorAll('.floating-item, .pattern-circle, .decoration-circle');
    
    const handleScroll = throttle(() => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate}px)`;
        });
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
}

// ========================================
// TESTIMONIALS CAROUSEL
// ========================================
function setupTestimonialsCarousel() {
    const testimonials = document.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    
    if (testimonials.length === 0) return;
    
    const showTestimonial = (index) => {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.opacity = i === index ? '1' : '0.7';
            testimonial.style.transform = i === index ? 'scale(1.05)' : 'scale(1)';
        });
    };
    
    const nextTestimonial = () => {
        currentIndex = (currentIndex + 1) % testimonials.length;
        showTestimonial(currentIndex);
    };
    
    // Auto-rotate testimonials
    setInterval(nextTestimonial, 5000);
    
    // Initialize
    showTestimonial(0);
}

// ========================================
// BUTTON INTERACTIONS
// ========================================
function setupButtonInteractions() {
    const buttons = document.querySelectorAll('.cta-button, .submit-btn, .see-more-btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0) scale(1)';
        });
        
        button.addEventListener('mousedown', () => {
            button.style.transform = 'translateY(-1px) scale(1.02)';
        });
        
        button.addEventListener('mouseup', () => {
            button.style.transform = 'translateY(-3px) scale(1.05)';
        });
    });
}

// ========================================
// LOGO MODAL
// ========================================
function setupLogoModal() {
    const logoIcon = document.querySelector('.logo-icon');
    const logoModal = document.getElementById('logoModal');
    const closeLogoModal = document.getElementById('closeLogoModal');
    
    if (logoIcon && logoModal && closeLogoModal) {
        logoIcon.addEventListener('click', () => {
            logoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        closeLogoModal.addEventListener('click', () => {
            logoModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });
        
        logoModal.addEventListener('click', (e) => {
            if (e.target === logoModal) {
                logoModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }
}

// ========================================
// SPARKLES/CONFETTI EFFECTS
// ========================================
function createSparkle(x, y) {
    const sparkleContainer = document.getElementById('sparkle-container');
    if (!sparkleContainer) return;
    
    const sparkle = document.createElement('div');
    sparkle.className = 'sparkle';
    sparkle.style.left = x + 'px';
    sparkle.style.top = y + 'px';
    
    // Random sparkle icon
    const icons = ['✨', '⭐', '💫', '🌟', '💎'];
    sparkle.textContent = icons[Math.floor(Math.random() * icons.length)];
    
    sparkleContainer.appendChild(sparkle);
    
    // Remove sparkle after animation
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.parentNode.removeChild(sparkle);
        }
    }, 1200);
}

function setupSparkleEffects() {
    const sparkleElements = document.querySelectorAll('.hero-feature, .category-card, .benefit-card');
    
    sparkleElements.forEach(element => {
        element.addEventListener('mouseenter', (e) => {
            const rect = element.getBoundingClientRect();
            const x = rect.left + rect.width / 2;
            const y = rect.top + rect.height / 2;
            
            // Create multiple sparkles
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    createSparkle(
                        x + (Math.random() - 0.5) * 100,
                        y + (Math.random() - 0.5) * 100
                    );
                }, i * 100);
            }
        });
    });
}

// ========================================
// FORM HANDLING
// ========================================
function setupFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const name = contactForm.querySelector('input[type="text"]').value;
            const email = contactForm.querySelector('input[type="email"]').value;
            const message = contactForm.querySelector('textarea').value;
            
            if (name && email && message) {
                // Simulate form submission
                const submitBtn = contactForm.querySelector('.submit-btn');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Enviando...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    submitBtn.textContent = '¡Mensaje Enviado!';
                    submitBtn.style.background = '#4CAF50';
                    
                    setTimeout(() => {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        submitBtn.style.background = '';
                        contactForm.reset();
                    }, 2000);
                }, 1500);
            }
        });
    }
}

// ========================================
// EVENT LISTENERS SETUP
// ========================================
function setupEventListeners() {
    // Smooth scrolling for anchor links
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
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close any open modals
            const logoModal = document.getElementById('logoModal');
            if (logoModal && logoModal.classList.contains('active')) {
                logoModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        }
    });
}

// ========================================
// INITIALIZATION
// ========================================
function initializeApp() {
    // Setup all functionality
    setupEventListeners();
    setupHeaderTransitions();
    setupMobileMenu();
    setupFadeInSections();
    setupFAQ();
    setupScrollToTop();
    setupParallax();
    setupTestimonialsCarousel();
    setupButtonInteractions();
    setupLogoModal();
    setupSparkleEffects();
    setupFormHandling();
    
    // Initialize products if the function exists
    setTimeout(() => {
        if (typeof initProducts === 'function') {
            initProducts();
        }
    }, 100);
    
    // Fade in on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s cubic-bezier(.4,0,.2,1)';
    setTimeout(() => { 
        document.body.style.opacity = '1'; 
    }, 80);
}

// ========================================
// DOM CONTENT LOADED
// ========================================
document.addEventListener('DOMContentLoaded', initializeApp);

// ========================================
// WINDOW LOAD
// ========================================
window.addEventListener('load', () => {
    // Additional setup after all resources are loaded
    console.log('Atelier Mely Crochet - Website loaded successfully!');
});

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
});

// ========================================
// EXPORT FOR MODULE USAGE (if needed)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        debounce,
        throttle,
        createSparkle,
        initializeApp
    };
}