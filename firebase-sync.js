/* Sistema de sincronización Firebase + localStorage */
(function() {
    const STORAGE_KEY = 'amc_products';
    const SYNC_KEY = 'amc_last_sync';
    const COLLECTION_NAME = 'products';
    
    let db = window.firebaseDb;
    let storage = window.firebaseStorage;
    const isFirebaseEnabled = window.FIREBASE_ENABLED && db !== null;
    
    // Función para obtener productos desde localStorage
    function getItemsFromLocal() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Error leyendo localStorage', e);
            return [];
        }
    }
    
    // Función para guardar productos en localStorage
    function saveItemsToLocal(items) {
        try {
            // Optimizar: no guardar imageDataUrl en localStorage (se guarda en IndexedDB)
            // Solo guardar un marcador que indique que la imagen está en IndexedDB
            const optimizedItems = items.map(item => {
                const optimized = { ...item };
                // Si tiene imageDataUrl (base64), no guardarlo en localStorage
                // Se guardará en IndexedDB y solo guardamos un marcador
                if (optimized.imageDataUrl && optimized.imageDataUrl.startsWith('data:')) {
                    // Marcar que la imagen está en IndexedDB
                    optimized.imageInIndexedDB = true;
                    // No guardar el base64 completo en localStorage
                    delete optimized.imageDataUrl;
                }
                // Si tiene imageUrl (de Firebase Storage), mantenerlo
                if (optimized.imageUrl && optimized.imageUrl.startsWith('http')) {
                    delete optimized.imageDataUrl;
                }
                return optimized;
            });
            
            localStorage.setItem(STORAGE_KEY, JSON.stringify(optimizedItems));
            localStorage.setItem(SYNC_KEY, Date.now().toString());
            return true;
        } catch (e) {
            console.error('Error guardando en localStorage', e);
            throw e;
        }
    }
    
    // Función para guardar imagen en IndexedDB (gratis, mucho espacio)
    async function saveImageToIndexedDB(productId, imageDataUrl) {
        if (window.ImageStorage && window.ImageStorage.save) {
            try {
                await window.ImageStorage.save(productId, imageDataUrl);
                return true;
            } catch (error) {
                console.error('❌ Error guardando imagen en IndexedDB:', error);
                return false;
            }
        }
        return false;
    }
    
    // Función para obtener imagen desde IndexedDB
    async function getImageFromIndexedDB(productId) {
        if (window.ImageStorage && window.ImageStorage.get) {
            try {
                return await window.ImageStorage.get(productId);
            } catch (error) {
                console.error('❌ Error obteniendo imagen de IndexedDB:', error);
                return null;
            }
        }
        return null;
    }
    
    // Función para eliminar imagen de IndexedDB
    async function deleteImageFromIndexedDB(productId) {
        if (window.ImageStorage && window.ImageStorage.delete) {
            try {
                await window.ImageStorage.delete(productId);
                return true;
            } catch (error) {
                console.error('❌ Error eliminando imagen de IndexedDB:', error);
                return false;
            }
        }
        return false;
    }
    
    // Función para convertir producto a formato Firestore
    function productToFirestore(product) {
        // Para Firestore, podemos guardar imageDataUrl si es pequeño, o solo un marcador
        // Las imágenes grandes se guardan en IndexedDB localmente
        return {
            id: product.id,
            title: product.title || '',
            price: product.price || '0',
            category: product.category || 'accesorios',
            description: product.description || '',
            // Solo guardar imageDataUrl en Firestore si es pequeño (< 100KB aprox)
            // Para imágenes grandes, solo guardar un marcador
            imageDataUrl: (product.imageDataUrl && product.imageDataUrl.length < 100000) 
                ? product.imageDataUrl 
                : (product.imageInIndexedDB ? 'INDEXEDDB' : ''),
            imageUrl: product.imageUrl || '',
            createdAt: product.createdAt || Date.now(),
            updatedAt: Date.now()
        };
    }
    
    // Función para convertir documento Firestore a producto
    function firestoreToProduct(doc) {
        const data = doc.data();
        // Priorizar imageUrl sobre imageDataUrl
        const imageUrl = data.imageUrl || '';
        const imageDataUrl = data.imageDataUrl || '';
        
        // Si imageDataUrl es 'INDEXEDDB', marcar que está en IndexedDB
        const imageInIndexedDB = imageDataUrl === 'INDEXEDDB';
        
        return {
            id: data.id || doc.id,
            title: data.title || '',
            price: data.price || '0',
            category: data.category || 'accesorios',
            description: data.description || '',
            imageUrl: imageUrl,
            imageDataUrl: (imageInIndexedDB || !imageDataUrl) ? '' : imageDataUrl,
            imageInIndexedDB: imageInIndexedDB,
            createdAt: data.createdAt || Date.now(),
            updatedAt: data.updatedAt || Date.now()
        };
    }
    
    // Guardar un producto en Firestore
    async function saveProductToFirestore(product) {
        if (!isFirebaseEnabled) return false;
        
        try {
            const productData = productToFirestore(product);
            await db.collection(COLLECTION_NAME).doc(product.id).set(productData);
            console.log('✅ Producto guardado en Firestore:', product.id);
            return true;
        } catch (error) {
            console.error('❌ Error guardando en Firestore:', error);
            return false;
        }
    }
    
    // API pública para guardar imagen (usa IndexedDB, gratis)
    window.saveProductImage = async function(imageDataUrl, productId) {
        return await saveImageToIndexedDB(productId, imageDataUrl);
    };
    
    // API pública para obtener imagen desde IndexedDB
    window.getProductImage = async function(productId) {
        return await getImageFromIndexedDB(productId);
    };
    
    // Eliminar un producto de Firestore
    async function deleteProductFromFirestore(productId) {
        if (!isFirebaseEnabled) return false;
        
        try {
            // Eliminar imagen de IndexedDB si existe
            await deleteImageFromIndexedDB(productId);
            
            await db.collection(COLLECTION_NAME).doc(productId).delete();
            console.log('✅ Producto eliminado de Firestore:', productId);
            return true;
        } catch (error) {
            console.error('❌ Error eliminando de Firestore:', error);
            return false;
        }
    }
    
    // Cargar todos los productos desde Firestore
    async function loadProductsFromFirestore() {
        if (!isFirebaseEnabled) return null;
        
        try {
            const snapshot = await db.collection(COLLECTION_NAME).orderBy('createdAt', 'desc').get();
            const products = [];
            snapshot.forEach(doc => {
                products.push(firestoreToProduct(doc));
            });
            console.log('✅ Productos cargados desde Firestore:', products.length);
            return products;
        } catch (error) {
            console.error('❌ Error cargando desde Firestore:', error);
            return null;
        }
    }
    
    // Sincronizar productos: Firestore -> localStorage
    async function syncFromFirestore() {
        if (!isFirebaseEnabled) {
            console.log('⚠️ Firebase no disponible, usando solo localStorage');
            return getItemsFromLocal();
        }
        
        try {
            const firestoreProducts = await loadProductsFromFirestore();
            if (firestoreProducts !== null) {
                saveItemsToLocal(firestoreProducts);
                console.log('✅ Sincronización desde Firestore completada');
                return firestoreProducts;
            }
        } catch (error) {
            console.error('❌ Error en sincronización:', error);
        }
        
        // Si falla, devolver productos locales
        return getItemsFromLocal();
    }
    
    // Migrar productos existentes a IndexedDB
    async function migrateProductsToIndexedDB(products) {
        if (!window.ImageStorage || !window.ImageStorage.save) {
            return products;
        }
        
        const migrated = [];
        for (const item of products) {
            // Si tiene imageDataUrl pero no está marcado como en IndexedDB, migrarlo
            if (item.imageDataUrl && item.imageDataUrl.startsWith('data:') && !item.imageInIndexedDB) {
                try {
                    await window.ImageStorage.save(item.id, item.imageDataUrl);
                    item.imageInIndexedDB = true;
                    console.log('✅ Imagen migrada a IndexedDB para producto:', item.id);
                } catch (err) {
                    console.warn('⚠️ No se pudo migrar imagen a IndexedDB:', err);
                }
            }
            migrated.push(item);
        }
        
        // Si se migraron productos, guardar los cambios
        if (migrated.some((item, idx) => item.imageInIndexedDB && !products[idx].imageInIndexedDB)) {
            saveItemsToLocal(migrated);
        }
        
        return migrated;
    }
    
    // API pública para obtener productos (con sincronización automática)
    window.getProducts = async function(forceSync = false) {
        let localProducts = getItemsFromLocal();
        
        // Migrar productos existentes a IndexedDB si es necesario
        if (window.ImageStorage) {
            localProducts = await migrateProductsToIndexedDB(localProducts);
        }
        
        // Si Firebase no está habilitado, devolver solo productos locales
        if (!isFirebaseEnabled) {
            return localProducts;
        }
        
        // Sincronizar desde Firestore si es necesario
        if (forceSync || localProducts.length === 0) {
            try {
                const firestoreProducts = await syncFromFirestore();
                // Migrar productos de Firestore también
                if (window.ImageStorage) {
                    return await migrateProductsToIndexedDB(firestoreProducts);
                }
                return firestoreProducts;
            } catch (error) {
                console.error('Error en sincronización, usando productos locales:', error);
                return localProducts;
            }
        }
        
        // Verificar si hay conexión y sincronizar en segundo plano
        if (navigator.onLine) {
            syncFromFirestore().catch(err => {
                console.log('Sincronización en segundo plano falló:', err);
            });
        }
        
        return localProducts;
    };
    
    // API pública para guardar productos
    window.saveProducts = async function(products) {
        // Guardar en localStorage primero (para funcionar offline)
        saveItemsToLocal(products);
        
        // Si Firebase está habilitado, sincronizar cada producto
        if (isFirebaseEnabled) {
            const promises = products.map(product => saveProductToFirestore(product));
            await Promise.allSettled(promises);
        }
        
        return true;
    };
    
    // API pública para agregar un producto
    window.addProduct = async function(product) {
        // Si el producto tiene imageDataUrl, guardarlo en IndexedDB
        if (product.imageDataUrl && product.imageDataUrl.startsWith('data:')) {
            await saveImageToIndexedDB(product.id, product.imageDataUrl);
        }
        
        const products = getItemsFromLocal();
        products.unshift(product);
        await window.saveProducts(products);
        
        // Guardar individualmente en Firestore
        if (isFirebaseEnabled) {
            await saveProductToFirestore(product);
        }
        
        return products;
    };
    
    // API pública para eliminar un producto
    window.deleteProduct = async function(productId) {
        // Eliminar imagen de IndexedDB
        await deleteImageFromIndexedDB(productId);
        
        const products = getItemsFromLocal().filter(p => p.id !== productId);
        await window.saveProducts(products);
        
        // Eliminar de Firestore
        if (isFirebaseEnabled) {
            await deleteProductFromFirestore(productId);
        }
        
        return products;
    };
    
    // Sincronización automática al cargar la página
    if (isFirebaseEnabled && navigator.onLine) {
        // Sincronizar después de un pequeño delay para no bloquear la carga
        setTimeout(() => {
            syncFromFirestore().catch(err => {
                console.log('Sincronización inicial falló:', err);
            });
        }, 1000);
        
        // Escuchar cambios en Firestore en tiempo real
        try {
            db.collection(COLLECTION_NAME)
                .orderBy('createdAt', 'desc')
                .onSnapshot((snapshot) => {
                    const products = [];
                    snapshot.forEach(doc => {
                        products.push(firestoreToProduct(doc));
                    });
                    saveItemsToLocal(products);
                    console.log('🔄 Sincronización en tiempo real completada');
                    
                    // Disparar evento personalizado para notificar cambios
                    window.dispatchEvent(new CustomEvent('productsUpdated', { detail: products }));
                }, (error) => {
                    console.error('Error en sincronización en tiempo real:', error);
                });
        } catch (error) {
            console.error('Error configurando sincronización en tiempo real:', error);
        }
    }
    
    // Escuchar cambios de conexión
    window.addEventListener('online', () => {
        console.log('🌐 Conexión restaurada, sincronizando...');
        if (isFirebaseEnabled) {
            syncFromFirestore().catch(err => {
                console.log('Error sincronizando después de restaurar conexión:', err);
            });
        }
    });
    
    console.log(isFirebaseEnabled ? '✅ Sistema de sincronización Firebase activo' : '⚠️ Modo solo localStorage');
})();

