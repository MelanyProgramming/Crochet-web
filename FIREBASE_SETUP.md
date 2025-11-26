# 🔥 Configuración de Firebase para Sincronización de Productos

Este documento explica cómo configurar Firebase para que tus productos se sincronicen entre todos tus dispositivos (computadora, tablet, teléfono, etc.).

## 📋 ¿Por qué Firebase?

Sin Firebase, los productos que agregues solo se guardan en el navegador donde los agregaste. Con Firebase, todos tus productos se guardan en la nube y se sincronizan automáticamente en todos tus dispositivos.

## 🚀 Pasos para Configurar Firebase

### Paso 1: Crear un Proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz clic en **"Agregar proyecto"** o **"Add project"**
3. Ingresa un nombre para tu proyecto (ej: "atelier-mely-crochet")
4. Sigue las instrucciones para crear el proyecto
5. **Desactiva** Google Analytics si no lo necesitas (puedes activarlo después)

### Paso 2: Obtener las Credenciales de Configuración

1. En la consola de Firebase, haz clic en el ícono de **⚙️ Configuración** (Settings) > **Configuración del proyecto**
2. Desplázate hacia abajo hasta la sección **"Tus apps"** o **"Your apps"**
3. Haz clic en el ícono **</>** (Web) para agregar una app web
4. Ingresa un nombre para tu app (ej: "Atelier Mely Web")
5. **NO marques** la casilla de Firebase Hosting (no la necesitamos por ahora)
6. Haz clic en **"Registrar app"**
7. Copia el objeto de configuración que aparece. Se verá así:

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

### Paso 3: Configurar Firestore Database

1. En el menú lateral de Firebase Console, haz clic en **"Firestore Database"**
2. Haz clic en **"Crear base de datos"** o **"Create database"**
3. Selecciona **"Comenzar en modo de prueba"** o **"Start in test mode"** (para desarrollo)
4. Elige una ubicación para tu base de datos (elige la más cercana a ti)
5. Haz clic en **"Habilitar"** o **"Enable"**

### Paso 4: Configurar Reglas de Seguridad (IMPORTANTE)

1. En Firestore Database, ve a la pestaña **"Reglas"** o **"Rules"**
2. Reemplaza las reglas con estas (permiten lectura y escritura para desarrollo):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura y escritura a todos (solo para desarrollo)
    match /products/{productId} {
      allow read, write: if true;
    }
  }
}
```

**⚠️ IMPORTANTE:** Estas reglas permiten que cualquiera pueda leer y escribir en tu base de datos. Esto es adecuado para desarrollo, pero para producción deberías:
- Implementar autenticación de Firebase
- Configurar reglas más estrictas que solo permitan escritura a usuarios autenticados
- O usar un backend seguro para manejar las escrituras

### Paso 5: Actualizar el Archivo de Configuración

1. Abre el archivo `firebase-config.js` en tu proyecto
2. Reemplaza los valores `"TU_API_KEY"`, `"TU_PROYECTO"`, etc. con los valores que copiaste en el Paso 2
3. Guarda el archivo

Ejemplo:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "atelier-mely-crochet.firebaseapp.com",
    projectId: "atelier-mely-crochet",
    storageBucket: "atelier-mely-crochet.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef1234567890"
};
```

### Paso 6: Probar la Configuración

1. Abre tu página web en el navegador
2. Abre la consola del navegador (F12 > Console)
3. Deberías ver el mensaje: **"✅ Firebase inicializado correctamente"**
4. Si ves un error, verifica que:
   - Los valores en `firebase-config.js` sean correctos
   - Firestore esté habilitado en Firebase Console
   - Las reglas de seguridad estén configuradas

## ✅ ¡Listo!

Ahora cuando agregues productos desde cualquier dispositivo:
- Se guardarán en Firebase (la nube)
- Se sincronizarán automáticamente en todos tus dispositivos
- Funcionarán incluso si no tienes conexión (usando caché local)

## 🔒 Seguridad Adicional (Opcional)

Para mayor seguridad, puedes:
1. Implementar autenticación de Firebase
2. Configurar reglas más estrictas en Firestore
3. Usar Firebase Storage para las imágenes en lugar de Data URLs

## 📝 Notas Importantes

- **Gratis:** Firebase tiene un plan gratuito generoso que debería ser suficiente para tu tienda
- **Límites:** El plan gratuito incluye:
  - 1 GB de almacenamiento
  - 50,000 lecturas/día
  - 20,000 escrituras/día
- **Sin configuración:** Si no configuras Firebase, la aplicación seguirá funcionando usando solo localStorage (pero los productos no se sincronizarán entre dispositivos)

## 🆘 Problemas Comunes

### "Firebase no configurado"
- Verifica que hayas actualizado `firebase-config.js` con tus credenciales

### "Error de permisos"
- Verifica las reglas de Firestore en Firebase Console

### "Los productos no se sincronizan"
- Verifica que tengas conexión a internet
- Revisa la consola del navegador para ver errores
- Asegúrate de que Firestore esté habilitado

## 📞 ¿Necesitas Ayuda?

Si tienes problemas, revisa:
- [Documentación de Firebase](https://firebase.google.com/docs)
- [Documentación de Firestore](https://firebase.google.com/docs/firestore)

