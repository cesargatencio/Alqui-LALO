# AlquiLALO - Plataforma de Alquiler de Espacios

Plataforma web para el alquiler de espacios en la Universidad Metropolitana. Conecta a usuarios con salones, teatros y áreas disponibles para eventos académicos, culturales o recreativos.

## 🚀 Características Principales
- Catálogo completo de espacios disponibles
- Sistema de reservas integrado
- Autenticación segura para usuarios
- Panel administrativo
- Pasarela de pagos con PayPal

## 📦 Prerrequisitos
- Node.js (v16 o superior)
- npm (v8 o superior)
- Cuenta de Firebase (para autenticación y base de datos)

## 🛠️ Instalación Local

### Opción 1: Mediante archivo ZIP
1. **Descargar el proyecto**
   - Haz clic en el botón "Code" en GitHub y selecciona "Download ZIP"
   - Extrae el archivo ZIP en tu directorio preferido

2. **Abrir terminal en la carpeta del proyecto**
   ```bash
   Ejemplo: cd /ruta/a/alquilalo-main
3. Usa en el terminal npm install
4. Por ultimo ejecuta el programa con npm run dev

### Opción 2: Clonando repositorio
1. git clone https://github.com/cesargatencio/Alqui-LALO
2. cd alquilalo
3. npm install
npm install chart.js 
npm install react-chartjs-2
4. npm run dev

Configuración de Administradores
La lista de correos con privilegios de administrador está hard-coded en el componente que controla rutas protegidas. Para modificarla:

Abre el archivo src/components/ProtectedRoute.jsx

Localiza el array adminEmails al inicio del fichero. Por ejemplo:

const adminEmails = [
"cesar@unimet.edu.ve",
"salvador@unimet.edu.ve",
// agrega aquí más correos @unimet.edu.ve
];

Añade o elimina direcciones de correo según necesites.

Guarda los cambios y reinicia el servidor:
npm run dev