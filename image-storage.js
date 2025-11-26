/* Sistema de almacenamiento de imágenes usando IndexedDB (gratis y con mucho espacio) */
(function() {
    const DB_NAME = 'amc_image_storage';
    const DB_VERSION = 1;
    const STORE_NAME = 'images';
    
    let db = null;
    
    // Inicializar IndexedDB
    function initDB() {
        return new Promise((resolve, reject) => {
            if (db) {
                resolve(db);
                return;
            }
            
            const request = indexedDB.open(DB_NAME, DB_VERSION);
            
            request.onerror = () => {
                console.error('❌ Error abriendo IndexedDB:', request.error);
                reject(request.error);
            };
            
            request.onsuccess = () => {
                db = request.result;
                console.log('✅ IndexedDB inicializado correctamente');
                resolve(db);
            };
            
            request.onupgradeneeded = (event) => {
                const database = event.target.result;
                if (!database.objectStoreNames.contains(STORE_NAME)) {
                    const objectStore = database.createObjectStore(STORE_NAME, { keyPath: 'id' });
                    objectStore.createIndex('productId', 'productId', { unique: false });
                    console.log('✅ ObjectStore creado en IndexedDB');
                }
            };
        });
    }
    
    // Guardar imagen en IndexedDB
    async function saveImageToIndexedDB(productId, imageDataUrl) {
        try {
            await initDB();
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                
                const imageData = {
                    id: `img_${productId}`,
                    productId: productId,
                    imageDataUrl: imageDataUrl,
                    timestamp: Date.now()
                };
                
                const request = store.put(imageData);
                
                request.onsuccess = () => {
                    console.log('✅ Imagen guardada en IndexedDB:', productId);
                    resolve(imageData.id);
                };
                
                request.onerror = () => {
                    console.error('❌ Error guardando imagen en IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('❌ Error en saveImageToIndexedDB:', error);
            throw error;
        }
    }
    
    // Obtener imagen desde IndexedDB
    async function getImageFromIndexedDB(productId) {
        try {
            await initDB();
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readonly');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.get(`img_${productId}`);
                
                request.onsuccess = () => {
                    const result = request.result;
                    if (result) {
                        resolve(result.imageDataUrl);
                    } else {
                        resolve(null);
                    }
                };
                
                request.onerror = () => {
                    console.error('❌ Error obteniendo imagen de IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('❌ Error en getImageFromIndexedDB:', error);
            return null;
        }
    }
    
    // Eliminar imagen de IndexedDB
    async function deleteImageFromIndexedDB(productId) {
        try {
            await initDB();
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const request = store.delete(`img_${productId}`);
                
                request.onsuccess = () => {
                    console.log('✅ Imagen eliminada de IndexedDB:', productId);
                    resolve(true);
                };
                
                request.onerror = () => {
                    console.error('❌ Error eliminando imagen de IndexedDB:', request.error);
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('❌ Error en deleteImageFromIndexedDB:', error);
            return false;
        }
    }
    
    // Limpiar todas las imágenes huérfanas (productos que ya no existen)
    async function cleanupOrphanedImages(productIds) {
        try {
            await initDB();
            
            return new Promise((resolve, reject) => {
                const transaction = db.transaction([STORE_NAME], 'readwrite');
                const store = transaction.objectStore(STORE_NAME);
                const index = store.index('productId');
                const request = index.openCursor();
                const idsToDelete = [];
                
                request.onsuccess = (event) => {
                    const cursor = event.target.result;
                    if (cursor) {
                        const productId = cursor.value.productId;
                        if (!productIds.includes(productId)) {
                            idsToDelete.push(cursor.value.id);
                        }
                        cursor.continue();
                    } else {
                        // Eliminar imágenes huérfanas
                        if (idsToDelete.length > 0) {
                            const deletePromises = idsToDelete.map(id => {
                                return new Promise((res, rej) => {
                                    const deleteReq = store.delete(id);
                                    deleteReq.onsuccess = () => res();
                                    deleteReq.onerror = () => rej(deleteReq.error);
                                });
                            });
                            
                            Promise.all(deletePromises).then(() => {
                                console.log(`✅ ${idsToDelete.length} imágenes huérfanas eliminadas`);
                                resolve(true);
                            }).catch(reject);
                        } else {
                            resolve(true);
                        }
                    }
                };
                
                request.onerror = () => {
                    reject(request.error);
                };
            });
        } catch (error) {
            console.error('❌ Error en cleanupOrphanedImages:', error);
            return false;
        }
    }
    
    // API pública
    window.ImageStorage = {
        save: saveImageToIndexedDB,
        get: getImageFromIndexedDB,
        delete: deleteImageFromIndexedDB,
        cleanup: cleanupOrphanedImages,
        init: initDB
    };
    
    // Inicializar al cargar
    if (typeof indexedDB !== 'undefined') {
        initDB().catch(err => {
            console.warn('⚠️ IndexedDB no disponible, usando localStorage como respaldo');
        });
    } else {
        console.warn('⚠️ IndexedDB no soportado en este navegador');
    }
})();

