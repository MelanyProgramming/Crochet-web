# 🧶 Crochet Artesanal - Página Web

Una hermosa página web para mostrar y vender productos tejidos a crochet. Diseñada con un estilo moderno y elegante, perfecta para artesanos que quieren mostrar su trabajo al mundo.

## ✨ Características Principales

### 🎨 Diseño Atractivo
- **Diseño moderno y responsivo** que se adapta a todos los dispositivos
- **Paleta de colores suave** con tonos rosados y elegantes
- **Animaciones fluidas** que mejoran la experiencia del usuario
- **Tipografías elegantes** (Poppins y Dancing Script)

### 🛍️ Funcionalidades de E-commerce
- **Catálogo de productos** con filtros por categoría
- **Carrito de compras** funcional con persistencia local
- **Modal de detalles** para cada producto
- **Sistema de notificaciones** para feedback del usuario
- **Proceso de checkout** simulado

### 📱 Experiencia de Usuario
- **Navegación suave** con scroll automático
- **Menú móvil** para dispositivos pequeños
- **Formulario de contacto** funcional
- **Elementos flotantes** animados en el hero
- **Efectos hover** en todos los elementos interactivos

## 🚀 Cómo Usar

### 1. Abrir la Página
Simplemente abre el archivo `index.html` en tu navegador web. La página se cargará automáticamente con todos los productos y funcionalidades.

### 2. Navegar por los Productos
- **Filtros**: Usa los botones de filtro para ver productos por categoría (Todos, Accesorios, Hogar, Ropa)
- **Ver detalles**: Haz clic en "Ver Detalles" para ver información completa del producto
- **Agregar al carrito**: Haz clic en "Agregar" para añadir productos al carrito

### 3. Gestionar el Carrito
- **Ver carrito**: Haz clic en el ícono del carrito en la barra de navegación
- **Modificar cantidades**: Usa los botones + y - para cambiar cantidades
- **Proceder al pago**: Haz clic en "Proceder al Pago" para simular la compra

### 4. Contacto
- **Formulario**: Completa el formulario en la sección de contacto
- **Información**: Encuentra datos de contacto en la sección correspondiente

## 📁 Estructura de Archivos

```
crochet-web/
├── index.html          # Página principal
├── styles.css          # Estilos y diseño
├── script.js           # Funcionalidad JavaScript
└── README.md           # Este archivo
```

## 🎯 Productos Incluidos

La página incluye 8 productos de ejemplo:

### Accesorios
- Gorro de Invierno ($25.00)
- Bufanda Elegante ($35.00)
- Bolso Bohemio ($40.00)

### Hogar
- Mantel de Mesa ($45.00)
- Cojín Decorativo ($30.00)
- Alfombra Circular ($80.00)

### Ropa
- Chaleco de Verano ($55.00)
- Cardigan Abierto ($75.00)

## 🛠️ Personalización

### Agregar Productos
Para agregar nuevos productos, edita el array `products` en `script.js`:

```javascript
{
    id: 9,
    name: "Nuevo Producto",
    description: "Descripción del producto",
    price: 50.00,
    category: "accesorios", // o "hogar", "ropa"
    image: "🆕", // Emoji o ícono
    colors: ["Color1", "Color2"],
    material: "Material del producto",
    size: "Tamaño disponible"
}
```

### Cambiar Colores
Modifica las variables CSS en `styles.css`:

```css
:root {
    --primary-color: #f8b4d9;    /* Color principal */
    --secondary-color: #e91e63;  /* Color secundario */
    --accent-color: #ff6b9d;     /* Color de acento */
}
```

### Agregar Imágenes
Reemplaza los emojis en el array de productos con URLs de imágenes:

```javascript
image: "ruta/a/tu/imagen.jpg"
```

## 📱 Responsive Design

La página está optimizada para:
- **Desktop**: Pantallas grandes con diseño completo
- **Tablet**: Diseño adaptado para tablets
- **Mobile**: Menú hamburguesa y diseño móvil optimizado

## 🔧 Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos modernos con Grid y Flexbox
- **JavaScript ES6+**: Funcionalidad interactiva
- **Font Awesome**: Íconos
- **Google Fonts**: Tipografías elegantes

## 🌟 Características Avanzadas

### Animaciones
- **Elementos flotantes** en el hero
- **Transiciones suaves** en hover
- **Animaciones de entrada** para modales
- **Efectos parallax** sutiles

### Funcionalidades
- **Persistencia del carrito** en localStorage
- **Filtrado dinámico** de productos
- **Sistema de notificaciones** personalizado
- **Scroll suave** entre secciones

### UX/UI
- **Feedback visual** en todas las interacciones
- **Estados de carga** y transiciones
- **Accesibilidad** mejorada
- **Diseño intuitivo** y fácil de usar

## 📞 Soporte

Si necesitas ayuda para personalizar o modificar la página:

1. **Revisa el código**: Todos los archivos están bien comentados
2. **Modifica productos**: Edita el array en `script.js`
3. **Cambia estilos**: Modifica las variables CSS en `styles.css`
4. **Agrega funcionalidades**: Extiende el JavaScript según tus necesidades

## 🎨 Inspiración

Esta página está diseñada pensando en:
- **Artesanos independientes** que quieren mostrar su trabajo
- **Negocios pequeños** que buscan una presencia online profesional
- **Amantes del crochet** que quieren compartir su pasión
- **Clientes** que buscan productos únicos y hechos a mano

---

**¡Disfruta tu nueva página!