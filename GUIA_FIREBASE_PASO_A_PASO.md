# 🔥 Guía Visual: Configurar Firebase en 5 Pasos

## 📍 Paso 1: Crear tu Proyecto en Firebase

1. **Abre tu navegador** y ve a: https://console.firebase.google.com/
2. **Inicia sesión** con tu cuenta de Google (si no tienes, créala)
3. Haz clic en el botón **"Agregar proyecto"** o **"Add project"** (botón grande en el centro)
4. **Nombre del proyecto**: Escribe algo como `atelier-mely-crochet` o `mely-crochet`
5. **Google Analytics**: Puedes desactivarlo si no lo necesitas (marca "No habilitar")
6. Haz clic en **"Crear proyecto"** y espera unos segundos

✅ **Resultado**: Verás la pantalla de tu proyecto creado

---

## 📍 Paso 2: Agregar una App Web

1. En la pantalla de tu proyecto, busca el ícono **`</>`** (Web) y haz clic
2. **Nombre de la app**: Escribe `Atelier Mely Web` o cualquier nombre
3. **NO marques** la casilla de "Firebase Hosting" (no la necesitamos)
4. Haz clic en **"Registrar app"**
5. **¡IMPORTANTE!** Copia el código que aparece. Se verá así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

📋 **Copia TODO este código** - lo necesitarás en el Paso 5

---

## 📍 Paso 3: Activar Firestore Database

1. En el menú lateral izquierdo, busca **"Firestore Database"** y haz clic
2. Haz clic en el botón **"Crear base de datos"** o **"Create database"**
3. Selecciona **"Comenzar en modo de prueba"** (Start in test mode)
4. **Ubicación**: Elige la más cercana a ti (ej: `us-central` para México/América)
5. Haz clic en **"Habilitar"** o **"Enable"**
6. Espera unos minutos mientras se crea la base de datos

✅ **Resultado**: Verás la pantalla de Firestore Database (vacía por ahora)

---

## 📍 Paso 4: Configurar las Reglas de Seguridad

1. En la pantalla de Firestore Database, haz clic en la pestaña **"Reglas"** o **"Rules"** (arriba)
2. Verás un código como este:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. **Reemplaza TODO** ese código con este:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read, write: if true;
    }
  }
}
```

4. Haz clic en **"Publicar"** o **"Publish"**

✅ **Resultado**: Las reglas se guardarán y verás un mensaje de confirmación

---

## 📍 Paso 5: Actualizar tu Archivo firebase-config.js

1. **Abre el archivo** `firebase-config.js` en tu proyecto
2. **Busca** esta sección:

```javascript
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    projectId: "TU_PROJECT_ID",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};
```

3. **Reemplaza** cada valor con los que copiaste en el Paso 2:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",  // ← Pega tu apiKey aquí
    authDomain: "tu-proyecto.firebaseapp.com",      // ← Pega tu authDomain aquí
    projectId: "tu-proyecto",                        // ← Pega tu projectId aquí
    storageBucket: "tu-proyecto.appspot.com",       // ← Pega tu storageBucket aquí
    messagingSenderId: "123456789012",               // ← Pega tu messagingSenderId aquí
    appId: "1:123456789012:web:abcdef1234567890"    // ← Pega tu appId aquí
};
```

4. **Guarda el archivo** (Ctrl+S o Cmd+S)

✅ **Resultado**: Tu archivo quedará configurado con tus credenciales

---

## ✅ Paso 6: Probar que Funciona

1. **Abre tu página web** en el navegador (index.html o dashboard.html)
2. **Abre la consola del navegador**:
   - Presiona **F12** (o clic derecho > Inspeccionar)
   - Ve a la pestaña **"Console"** o **"Consola"**
3. **Busca estos mensajes**:
   - ✅ `Firebase inicializado correctamente`
   - ✅ `Sistema de sincronización Firebase activo`
4. Si ves estos mensajes, **¡todo está funcionando!** 🎉

---

## 🎯 ¿Qué Hacer Ahora?

Una vez configurado, cuando agregues productos:

1. **Desde tu computadora**: Se guardan en Firebase
2. **Desde tu tablet**: Se sincronizan automáticamente
3. **Desde tu teléfono**: Verás los mismos productos

**¡Los productos ahora se sincronizan entre todos tus dispositivos!** ✨

---

## 🆘 Si Algo No Funciona

### Error: "Firebase no configurado"
- ✅ Verifica que hayas reemplazado TODOS los valores en `firebase-config.js`
- ✅ Asegúrate de haber guardado el archivo

### Error: "Permission denied"
- ✅ Ve a Firestore Database > Reglas
- ✅ Verifica que las reglas sean exactamente como en el Paso 4
- ✅ Haz clic en "Publicar" de nuevo

### Error: "Firestore not enabled"
- ✅ Ve a Firestore Database en Firebase Console
- ✅ Asegúrate de haber completado el Paso 3

### No veo los mensajes en la consola
- ✅ Presiona F5 para recargar la página
- ✅ Abre la consola ANTES de cargar la página
- ✅ Verifica que los scripts de Firebase estén cargando (F12 > Network)

---

## 📞 ¿Necesitas Más Ayuda?

- Revisa el archivo `FIREBASE_SETUP.md` para más detalles
- Consulta la documentación oficial: https://firebase.google.com/docs

---

**¡Listo! Con estos pasos tendrás Firebase configurado y tus productos se sincronizarán en todos tus dispositivos.** 🚀

