/* Dashboard de administración simple - sólo cliente */
(function(){
    const ADMIN_KEY = 'amc_admin_unlocked';
    const STORAGE_KEY = 'amc_products';

    function getItems() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error leyendo storage', e);
            return [];
        }
    }

    function saveItems(items) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function uid() {
        return 'p_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
    }

    function formatPrice(v) {
        const n = Number(v);
        return isNaN(n) ? v : `$${n.toFixed(2)}`;
    }

    function renderList() {
        const container = document.getElementById('itemsList');
        if (!container) return;
        const items = getItems();
        container.innerHTML = '';
        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'admin-card';
            const img = document.createElement('img');
            img.src = item.imageDataUrl;
            img.alt = item.title || 'Producto';
            const meta = document.createElement('div');
            meta.className = 'meta';
            const h4 = document.createElement('h4');
            h4.textContent = item.title || 'Sin título';
            const row = document.createElement('div');
            row.className = 'row';
            row.innerHTML = `<span>${formatPrice(item.price)}</span><span>${item.category}</span>`;
            const actions = document.createElement('div');
            actions.className = 'card-actions';
            const del = document.createElement('button');
            del.className = 'btn btn-secondary';
            del.innerHTML = '<i class="fas fa-trash"></i> Eliminar';
            del.addEventListener('click', () => {
                const next = getItems().filter(x => x.id !== item.id);
                saveItems(next);
                renderList();
            });
            actions.appendChild(del);
            meta.appendChild(h4);
            meta.appendChild(row);
            if (item.description) {
                const d = document.createElement('div');
                d.style.color = 'var(--text-light)';
                d.style.fontSize = '0.9rem';
                d.textContent = item.description;
                meta.appendChild(d);
            }
            meta.appendChild(actions);
            card.appendChild(img);
            card.appendChild(meta);
            container.appendChild(card);
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
            const reader = new FileReader();
            reader.onload = function(evt){
                const imageDataUrl = String(evt.target.result);
                const items = getItems();
                items.unshift({
                    id: uid(),
                    title: titleInput.value.trim(),
                    price: priceInput.value.trim(),
                    category: categoryInput.value,
                    description: descInput.value.trim(),
                    imageDataUrl,
                    createdAt: Date.now()
                });
                saveItems(items);
                form.reset();
                renderList();
                alert('Producto agregado');
            };
            reader.readAsDataURL(file);
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
            clearAllBtn.addEventListener('click', function(){
                if (confirm('¿Eliminar todos los elementos guardados?')) {
                    saveItems([]);
                    renderList();
                }
            });
        }
    }

    document.addEventListener('DOMContentLoaded', function(){
        const unlocked = localStorage.getItem(ADMIN_KEY) === '1';
        const app = document.getElementById('admin-app');
        if (unlocked && app) {
            app.style.display = 'block';
            bindForm();
            bindTopActions();
            renderList();
        }
    });
})();


