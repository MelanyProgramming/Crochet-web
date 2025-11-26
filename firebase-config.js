/* Configuración de Firebase - Reemplaza estos valores con los de tu proyecto Firebase */
// Para obtener estos valores:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto o selecciona uno existente
// 3. Ve a Configuración del proyecto > Tus apps > Web
// 4. Copia los valores de configuración aquí

const firebaseConfig = {
    apiKey: "AIzaSyDJYG6_0a6dOQ6CsymYpm6J9s8X37xQfV8",
    authDomain: "crochet-web-4d85d.firebaseapp.com",
    projectId: "crochet-web-4d85d",
    storageBucket: "crochet-web-4d85d.firebasestorage.app",
    messagingSenderId: "117824547848",
    appId: "1:117824547848:web:413c89257cc407060675bd",
    measurementId: "G-F1SBLTM8C4"
  };
  

// Si Firebase no está configurado, usaremos solo localStorage
const FIREBASE_ENABLED = firebaseConfig.apiKey !== "TU_API_KEY";

// Inicializar Firebase solo si está configurado (usando API compat)
let db = null;
if (FIREBASE_ENABLED && typeof firebase !== 'undefined' && firebase.apps) {
    try {
        // Usar la API compat de Firebase
        if (!firebase.apps.length) {
            firebase.initializeApp(firebaseConfig);
        }
        db = firebase.firestore();
        console.log('✅ Firebase inicializado correctamente');
        console.log('💾 Las imágenes se guardan en IndexedDB (gratis, mucho espacio)');
    } catch (error) {
        console.error('❌ Error inicializando Firebase:', error);
        console.log('⚠️ Continuando con localStorage solamente');
    }
} else if (!FIREBASE_ENABLED) {
    console.log('⚠️ Firebase no configurado. Los productos se guardarán solo localmente.');
    console.log('📝 Para habilitar sincronización entre dispositivos, configura Firebase en firebase-config.js');
}

window.FIREBASE_ENABLED = FIREBASE_ENABLED;
window.firebaseDb = db;

