/* Dashboard de administración simple - sólo cliente */
(function(){
    const ADMIN_KEY = 'amc_admin_unlocked';
    const OWNER_EMAIL = (typeof window !== 'undefined' && window.AMC_OWNER_EMAIL) ? window.AMC_OWNER_EMAIL : (localStorage.getItem('amc_owner_email') || 'tu-correo@example.com');

    // Usar el sistema de sincronización Firebase
    async function getItems() {
        if (window.getProducts) {
            return await window.getProducts();
        }
        // Fallback si el sistema de sincronización no está disponible
        try {
            const raw = localStorage.getItem('amc_products');
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error leyendo storage', e);
            return [];
        }
    }

    async function saveItems(items) {
        if (window.saveProducts) {
            await window.saveProducts(items);
            return;
        }
        // Fallback si el sistema de sincronización no está disponible
        try {
            localStorage.setItem('amc_products', JSON.stringify(items));
        } catch (e) {
            console.error('Error guardando storage', e);
            throw e;
        }
    }

    function uid() {
        return 'p_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
    }

    function formatPrice(v) {
        const n = Number(v);
        return isNaN(n) ? v : `$${n.toFixed(2)}`;
    }

    async function renderList() {
        const container = document.getElementById('itemsList');
        if (!container) return;
        const items = await getItems();
        container.innerHTML = '';
        items.forEach((item, index) => {
            const card = document.createElement('div');
            card.className = 'admin-card';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 50).toString());
            const img = document.createElement('img');
            img.alt = item.title || 'Producto';
            
            // Cargar imagen desde IndexedDB si está marcada ahí
            if (item.imageInIndexedDB && window.getProductImage) {
                window.getProductImage(item.id).then(imageDataUrl => {
                    if (imageDataUrl) {
                        img.src = imageDataUrl;
                    } else {
                        // Fallback si no se encuentra en IndexedDB
                        img.src = item.imageUrl || item.imageDataUrl || '';
                    }
                }).catch(() => {
                    img.src = item.imageUrl || item.imageDataUrl || '';
                });
            } else {
                // Usar imageUrl o imageDataUrl directamente
                img.src = item.imageUrl || item.imageDataUrl || '';
            }
            const meta = document.createElement('div');
            meta.className = 'meta';
            const h4 = document.createElement('h4');
            h4.textContent = item.title || 'Sin título';
            const row = document.createElement('div');
            row.className = 'row';
            row.innerHTML = `<span><strong>${formatPrice(item.price)}</strong></span><span style="background: var(--light-bg); padding: 4px 10px; border-radius: 8px; font-weight: 600; color: var(--secondary-color);">${item.category}</span>`;
            const actions = document.createElement('div');
            actions.className = 'card-actions';
            const del = document.createElement('button');
            del.className = 'btn btn-secondary';
            del.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
            del.style.width = '100%';
            del.addEventListener('click', async () => {
                if (confirm('¿Estás segura de eliminar este producto?')) {
                    card.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(async () => {
                        if (window.deleteProduct) {
                            await window.deleteProduct(item.id);
                        } else {
                            const items = await getItems();
                            const next = items.filter(x => x.id !== item.id);
                            await saveItems(next);
                        }
                        await renderList();
                    }, 300);
                }
            });
            actions.appendChild(del);
            meta.appendChild(h4);
            meta.appendChild(row);
            if (item.description) {
                const d = document.createElement('div');
                d.style.color = 'var(--text-light)';
                d.style.fontSize = '0.9rem';
                d.style.marginTop = '8px';
                d.style.lineHeight = '1.5';
                d.textContent = item.description;
                meta.appendChild(d);
            }
            meta.appendChild(actions);
            card.appendChild(img);
            card.appendChild(meta);
            container.appendChild(card);
        });
    }

    function readFileAsDataUrl(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = evt => resolve(String(evt.target.result));
            reader.onerror = () => reject(new Error('No se pudo leer la imagen'));
            reader.readAsDataURL(file);
        });
    }

    async function optimizeImage(file) {
        const dataUrl = await readFileAsDataUrl(file);
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                let { width, height } = img;
                const maxSize = 1080;
                if (width > maxSize || height > maxSize) {
                    const scale = Math.min(maxSize / width, maxSize / height);
                    width = Math.round(width * scale);
                    height = Math.round(height * scale);
                }
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const isPng = file.type === 'image/png';
                const mime = isPng ? 'image/png' : 'image/jpeg';
                const quality = isPng ? 0.9 : 0.75;
                try {
                    resolve(canvas.toDataURL(mime, quality));
                } catch (err) {
                    reject(err);
                }
            };
            img.onerror = reject;
            img.src = dataUrl;
        });
    }

    function bindForm() {
        const form = document.getElementById('productForm');
        const imageInput = document.getElementById('imageInput');
        const titleInput = document.getElementById('titleInput');
        const priceInput = document.getElementById('priceInput');
        const categoryInput = document.getElementById('categoryInput');
        const descInput = document.getElementById('descInput');
        const previewBtn = document.getElementById('previewBtn');

        if (!form) return;

        form.addEventListener('submit', async function(e){
            e.preventDefault();
            const file = imageInput.files && imageInput.files[0];
            if (!file) { alert('Selecciona una imagen'); return; }
            
            // Mostrar indicador de carga
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Subiendo...';
            }
            
            let imageDataUrl = null;
            
            try {
                // Optimizar imagen
                imageDataUrl = await optimizeImage(file);
            } catch (err) {
                console.error('No se pudo procesar la imagen', err);
                alert('No se pudo procesar la imagen. Intenta con otra o reduce su tamaño.');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                return;
            }
            
            const productId = uid();
            
            // Guardar imagen en IndexedDB (gratis, mucho espacio)
            try {
                if (window.saveProductImage) {
                    await window.saveProductImage(imageDataUrl, productId);
                    console.log('✅ Imagen guardada en IndexedDB');
                }
            } catch (err) {
                console.warn('⚠️ No se pudo guardar en IndexedDB, usando localStorage como respaldo:', err);
                // Si IndexedDB falla, guardar en el producto directamente (pero será más pesado)
            }
            
            const newProduct = {
                id: productId,
                title: titleInput.value.trim(),
                price: priceInput.value.trim(),
                category: categoryInput.value,
                description: descInput.value.trim(),
                imageInIndexedDB: true, // Marcar que la imagen está en IndexedDB
                // No guardar imageDataUrl aquí, se guarda en IndexedDB
                createdAt: Date.now()
            };
            
            try {
                if (window.addProduct) {
                    await window.addProduct(newProduct);
                } else {
                    const items = await getItems();
                    items.unshift(newProduct);
                    await saveItems(items);
                }
            } catch (err) {
                console.error('Error guardando producto:', err);
                // Si el error es por almacenamiento lleno, sugerir usar Firebase Storage
                if (err.message && err.message.includes('QuotaExceededError')) {
                    alert('El almacenamiento del navegador está lleno. Por favor, configura Firebase Storage para continuar agregando productos sin límites.');
                } else {
                    alert('Error al guardar el producto: ' + (err.message || 'Error desconocido'));
                }
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                }
                return;
            }
            
            form.reset();
            await renderList();
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnText;
            }
            alert('Producto agregado' + (window.FIREBASE_ENABLED ? ' y sincronizado' : ''));
        });

        if (previewBtn) {
            previewBtn.addEventListener('click', function(){
                const file = imageInput.files && imageInput.files[0];
                if (!file) { alert('Selecciona una imagen para previsualizar'); return; }
                const reader = new FileReader();
                reader.onload = function(evt){
                    const w = window.open('', '_blank');
                    if (!w) return;
                    w.document.write(`<img src="${String(evt.target.result)}" style="max-width:100%;height:auto;display:block;margin:0 auto;" />`);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    function bindTopActions() {
        const logoutBtn = document.getElementById('logoutBtn');
        const clearAllBtn = document.getElementById('clearAllBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function(){
                localStorage.removeItem(ADMIN_KEY);
                location.reload();
            });
        }
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', async function(){
                if (confirm('¿Eliminar todos los elementos guardados?')) {
                    await saveItems([]);
                    await renderList();
                }
            });
        }
    }

    function showBlocked(reason){
        let blocker = document.getElementById('admin-blocked');
        if (!blocker) {
            blocker = document.createElement('div');
            blocker.id = 'admin-blocked';
            blocker.className = 'admin-login';
            blocker.innerHTML = `<h1>Acceso restringido</h1><p class="hint">${reason}</p><div class="admin-actions"><a class="btn btn-secondary" href="index.html"><i class="fas fa-home"></i> Ir al inicio</a></div>`;
            document.body.insertBefore(blocker, document.body.firstChild);
        }
    }

    document.addEventListener('DOMContentLoaded', function(){
        const app = document.getElementById('admin-app');
        const session = (window.AMCAuth && window.AMCAuth.getSession) ? window.AMCAuth.getSession() : null;
        if (!session) {
            if (app) app.style.display = 'none';
            showBlocked('Inicia sesión con tu cuenta propietaria para continuar.');
            return;
        }
        if (String(session.email || '').toLowerCase() !== String(OWNER_EMAIL).toLowerCase()) {
            if (app) app.style.display = 'none';
            showBlocked('Esta cuenta no tiene permisos para el Dashboard.');
            return;
        }
        if (app) {
            app.style.display = 'block';
            bindForm();
            bindTopActions();
            renderList().then(() => {
                // Re-initialize AOS after rendering
                setTimeout(() => {
                    if (typeof AOS !== 'undefined') {
                        AOS.refresh();
                    }
                }, 100);
            });
            
            // Escuchar actualizaciones de productos
            window.addEventListener('productsUpdated', async (event) => {
                await renderList();
                if (typeof AOS !== 'undefined') {
                    AOS.refresh();
                }
            });
        }
    });
})();


