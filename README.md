<div align="center">

# 🎯 La Feria Digital

### Plataforma Inteligente de Códigos de Descuento con Verificación en Tiempo Real

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

[Demo](https://la-feria-digital.com) · [Reportar Bug](https://github.com/barvaro0411/la-feria-digital/issues) · [Solicitar Feature](https://github.com/barvaro0411/la-feria-digital/issues)

</div>

---

## 📋 Tabla de Contenidos
- [Sobre el Proyecto](#-sobre-el-proyecto)
- [Características](#-características)
- [Stack Tecnológico](#-stack-tecnológico)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Uso](#-uso)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Scripts Disponibles](#-scripts-disponibles)
- [API Endpoints](#-api-endpoints)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

---

## 🎯 Sobre el Proyecto
**La Feria Digital** es una plataforma web innovadora diseñada para revolucionar la forma en que los consumidores chilenos encuentran y utilizan códigos de descuento. A diferencia de otras plataformas, ofrecemos verificación en tiempo real, alertas personalizadas y una comunidad activa que valida cada código.

### ¿Por qué La Feria Digital?
- ✅ **Códigos Verificados**: Sistema automatizado que valida la vigencia de cada código
- 🔔 **Alertas Personalizadas**: Recibe notificaciones de descuentos en tus tiendas favoritas
- 📍 **Mapa Interactivo**: Encuentra descuentos en tiendas físicas cercanas usando Leaflet
- 💰 **Comparador de Precios**: Compara precios entre diferentes retailers
- 👥 **Comunidad Activa**: Sistema de votación y comentarios de usuarios reales
- 📊 **Dashboard Inteligente**: Estadísticas de ahorro y tendencias de descuentos
- 🤖 **Scraping Automatizado**: Actualización continua de códigos desde múltiples fuentes

---

## ✨ Características
| Característica | Estado | Descripción |
|----------------|--------|-------------|
| 🔍 Verificación en Tiempo Real | ✅ Implementado | Validación automática de códigos |
| 🔔 Alertas Personalizadas | 🚧 En Desarrollo | Notificaciones por categorías |
| 📍 Mapa de Descuentos | ✅ Implementado | Geolocalización con React Leaflet |
| 💰 Comparador de Precios | ✅ Implementado | Script de inserción disponible |
| ⭐ Sistema de Votación | 🚧 En Desarrollo | Validación comunitaria |
| 📊 Dashboard de Estadísticas | 🚧 Planificado | Analytics de ahorro |
| 🤖 Web Scraping | ✅ Implementado | Scrapy + BeautifulSoup + Selenium |
| 🔐 Autenticación JWT | ✅ Implementado | Login/Register con bcryptjs |
| 📱 Responsive Design | ✅ Implementado | Tailwind CSS optimizado |

---

## 🛠️ Stack Tecnológico
### Frontend (aplicacion/)
- React 18.2.0
- Vite 4.3.9
- Tailwind CSS 3.3.2
- React Router DOM 6.11.0
- Axios 1.4.0
- React Leaflet 4.2.1
- Leaflet 1.9.4

### Backend (servidor/)
- Node.js
- Express 4.18.2
- MongoDB
- Mongoose 7.0.0
- JSON Web Token 9.0.2
- bcryptjs 2.4.3
- CORS 2.8.5
- dotenv 16.0.3

### Scraping & Automation (raspador/)
- Python 3.x
- BeautifulSoup4 4.12.2
- Selenium 4.10.0
- Scrapy 2.9.0
- Requests 2.31.0
- python-dotenv 1.0.0

### DevOps & Tools
- Nodemon 2.0.22
- Git
- npm
- pip

---

## 📋 Requisitos Previos
Asegúrate de tener instalado lo siguiente antes de comenzar:
| Software | Versión Mínima | Descargar |
|----------|----------------|-----------|
| Node.js | 16.x | [nodejs.org](https://nodejs.org/) |
| npm | 8.x | (incluido con Node.js) |
| Python | 3.8+ | [python.org](https://www.python.org/downloads/) |
| pip | 21.x | (incluido con Python) |
| MongoDB | 5.x | [mongodb.com](https://www.mongodb.com/try/download/community) |
| Git | 2.x | [git-scm.com](https://git-scm.com/downloads) |

### Verificar instalaciones:
```bash
node --version    # v16.x o superior
npm --version     # 8.x o superior
python --version  # Python 3.8 o superior
pip --version     # 21.x o superior
mongod --version  # v5.x o superior
git --version     # v2.x o superior
```

---

## 🚀 Instalación
### 1️⃣ Clonar el repositorio
```bash
git clone https://github.com/barvaro0411/la-feria-digital.git
cd la-feria-digital
```
### 2️⃣ Instalar dependencias del Backend
```bash
cd servidor
npm install
```
### 3️⃣ Instalar dependencias del Frontend
```bash
cd ../aplicacion
npm install
```
### 4️⃣ Instalar dependencias del Scraper
```bash
cd ../raspador
pip install -r requirements.txt
```

---

## ⚙️ Configuración
### Backend (.env)
Crea un archivo `.env` en la carpeta `servidor/` basándote en `.env.example`:
```bash
cd servidor
cp .env.example .env
```
Edita el archivo `.env` con tus credenciales:
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/la-feria-digital
JWT_SECRET=tu_clave_secreta_super_segura_de_al_menos_32_caracteres
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```
### Frontend (opcional)
Si necesitas variables de entorno en el frontend, crea `.env` en `aplicacion/`:
```env
VITE_API_URL=http://localhost:3000/api
VITE_MAPS_API_KEY=tu_api_key_de_mapbox_o_google_maps
```

---

## 🎮 Uso
### Iniciar el Backend
```bash
cd servidor
npm run dev
```

### Iniciar el Frontend
En una nueva terminal:
```bash
cd aplicacion
npm run dev
```

### Ejecutar Scrapers
En una tercera terminal:
```bash
cd raspador
python insertar_tiendas.py
python insertar_comparador_cupones.py
python scrapers/scraper_tiendas.py
```

---

## 📁 Estructura del Proyecto
```
la-feria-digital/
│
├── aplicacion/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── package.json
├── servidor/
│   ├── config/
│   │   └── db.js
│   ├── modelos/
│   ├── controladores/
│   ├── rutas/
│   ├── middlewares/
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── raspador/
│   ├── config/
│   ├── scrapers/
│   │   ├── scraper_tiendas.py
│   │   └── scraper_cupones.py
│   ├── utils/
│   ├── insertar_tiendas.py
│   ├── insertar_comparador_cupones.py
│   ├── datos_tiendas_demo.json
│   └── requirements.txt
├── datos/
│   ├── schemas/
│   └── seeds/
├── .gitignore
├── README.md
├── LICENSE
└── package.json
```

---

## 🔧 Scripts Disponibles
### Backend (servidor/)
```bash
npm run dev
npm start
```
### Frontend (aplicacion/)
```bash
npm run dev
npm run build
npm run preview
```
### Scraper (raspador/)
```bash
python insertar_tiendas.py
python insertar_comparador_cupones.py
python scrapers/scraper_tiendas.py
```

---

## 🔌 API Endpoints
### Autenticación
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me
PUT    /api/auth/profile

### Códigos de Descuento
GET    /api/codigos
GET    /api/codigos/:id
POST   /api/codigos
PUT    /api/codigos/:id
DELETE /api/codigos/:id
POST   /api/codigos/:id/verificar
POST   /api/codigos/:id/votar

### Tiendas
GET    /api/tiendas
GET    /api/tiendas/:id
GET    /api/tiendas/:id/codigos
POST   /api/tiendas

### Alertas
GET    /api/alertas
POST   /api/alertas
PUT    /api/alertas/:id
DELETE /api/alertas/:id

---

## 🗺️ Roadmap
### ✅ Versión 1.0 (Actual)
- [x] Sistema básico de códigos de descuento
- [x] Verificación automática con scrapers
- [x] Autenticación JWT implementada
- [x] Frontend React con Tailwind CSS
- [x] Mapa interactivo con Leaflet
- [x] Backend Express + MongoDB
### 🚧 Versión 1.5 (En Desarrollo)
- [ ] Sistema de votación comunitaria
- [ ] Dashboard de estadísticas
- [ ] Alertas personalizadas por email
- [ ] Mejorar scrapers con más tiendas
- [ ] Sistema de caché con Redis
### 🔮 Versión 2.0 (Futuro)
- [ ] Aplicación móvil con React Native
- [ ] Machine Learning para predecir descuentos
- [ ] Integración oficial con tiendas
- [ ] Sistema de recompensas por contribuciones
- [ ] Extensión de navegador (Chrome/Firefox)
### 🌟 Versión 3.0 (Visión a Largo Plazo)
- [ ] API pública para developers
- [ ] Sistema de afiliados y cashback
- [ ] Expansión a otros países de LATAM
- [ ] Programa de partners con retailers
- [ ] PWA (Progressive Web App)

---

## 🤝 Contribuir
¡Las contribuciones son lo que hace que la comunidad open source sea increíble! Cualquier contribución que hagas será muy apreciada.

### Proceso de Contribución
1. Fork el proyecto
2. Crea tu Feature Branch: `git checkout -b feature/NuevaCaracteristica`
3. Commit tus cambios (usa commits descriptivos): `git commit -m 'Add: nueva funcionalidad de búsqueda avanzada'`
4. Push a la Branch: `git push origin feature/NuevaCaracteristica`
5. Abre un Pull Request

### Convenciones de Código
#### JavaScript/React
- Usa ESLint para linting
- Nombra componentes en PascalCase
- Usa functional components con hooks
- Prefiere arrow functions
#### Python
- Sigue PEP 8
- Usa snake_case para funciones y variables
- Documenta funciones con docstrings
#### Git Commits
Usa prefijos descriptivos en español:
- Add: Nueva funcionalidad
- Fix: Corrección de bugs
- Update: Actualización
- Remove: Eliminación
- Refactor: Refactorización
- Docs: Cambios en documentación

### Reportar Bugs
Abre un [issue](https://github.com/barvaro0411/la-feria-digital/issues) incluyendo:
1. Descripción clara
2. Pasos para reproducir
3. Comportamiento esperado vs actual
4. Screenshots/GIFs si aplica
5. Información del sistema (OS, browser, Node.js, npm)

---

## 📄 Licencia
Distribuido bajo la Licencia MIT. Ver [`LICENSE`](./LICENSE) para más información.

---

## 📧 Contacto
**Desarrollador Principal**: [@barvaro0411](https://github.com/barvaro0411)
**Proyecto**: https://github.com/barvaro0411/la-feria-digital
- 🌐 Website: [la-feria-digital.com](https://la-feria-digital.com) (próximamente)
- 📧 Email: contacto@la-feria-digital.com
- 💬 Discord: (opcional)
- 🐦 Twitter: (opcional)

---

## ❓ FAQ
- ¿Es gratis usar La Feria Digital?
  - Sí, la plataforma es open source y gratuita.
- ¿Cómo verifican que los códigos funcionan?
  - Scrapers automatizados verifican la vigencia contra sitios oficiales.
- ¿Puedo agregar mis propios códigos?
  - Sí, los usuarios registrados pueden sugerir y votar.
- ¿Qué tiendas están soportadas?
  - Tiendas chilenas populares. Ver `datos_tiendas_demo.json`.
- ¿Tienen aplicación móvil?
  - Está en el roadmap para versión 2.0. Actualmente es responsive.
- ¿Por qué MongoDB y no SQL?
  - Flexibilidad para datos variados.

---

<div align="center">
### ⭐ Si este proyecto te ayuda, considera darle una estrella!
Hecho con ❤️ en Chile 🇨🇱
</div>
