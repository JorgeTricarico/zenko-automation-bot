# Zenco.arg - Plataforma Integradora 🦊

Bienvenido al repositorio central de **Zenco**, el ecosistema digital diseñado para modernizar y gestionar el emprendimiento de arreglo de ropa, diseño e indumentaria de Ana y Ariel. A largo plazo, el proyecto servirá como arquitectura base para otros emprendimientos (como el centro de estética de Damián).

## 🚀 Visión General del Proyecto

Zenco actualmente tiene el desafío de agilizar el tiempo de atención de Ana, brindándole más tiempo para diseñar y coser. Para esto, en lugar de manejar todo desde una libreta o interactuando mecánicamente con cada cliente, construimos dos núcleos de tecnología que se comunican:

1. **Dashboard Web (Frontend):** Una interfaz premium donde Ana y Ariel administran las órdenes urgentes, ven los ingresos y revisan las prendas pendientes.
2. **AI WhatsApp Bot (Backend):** El "Cerebro" de Zenco. Escucha los mensajes de los clientes, cruza la información con la base de datos para saber el estado de un arreglo sin intervención humana, e interactúa amablemente utilizando Inteligencia Artificial.

---

## 🛠️ Stack Tecnológico

Toda la infraestructura está pensada para ser **económica, rápida y nativa en la nube**.

- **Frontend (Vite / React 18):** `TypeScript`, `Vanilla CSS` con sistema de variables, `Lucide Icons` o SVGs a medida (Aesthetics Premium).
- **Backend (Node.js):** `Express.js`, encapsulado en `server-bot/`.
- **Bot Engine:** `@whiskeysockets/baileys` (conexión a WhatsApp escaneando código QR) y `@google/generative-ai` (Gemini) para procesamiento de lenguaje.
- **Base de Datos:** `Prisma ORM` como motor lógico. Estructurada sobre `SQLite` para la fase temprana de desarrollo rápido, pensada para migrar en producción a `PostgreSQL` (tipo Supabase).
- **Control de Calidad (QA):** `Vitest` (Pruebas Unitarias) y `Playwright` (Pruebas E2E Smoke).

---

## 💻 Entorno de Desarrollo (Cómo Empezar)

Este proyecto asume un entorno similar a WSL / Linux con NodeJS v20+.

### 1. Levantar el Panel Dashboard
```bash
cd /raíz-del-proyecto
npm install
npm run dev
```
La aplicación correrá usualmente en `http://localhost:5173`.

### 2. Levantar el Bot / API (Base de Datos)
```bash
cd server-bot
npm install
# Sincronizar Prisma con SQLite
npx prisma db push
npm run start
```

---

## 📖 Roadmap y Futuro

Todo el Plan Maestro y el cronograma de sprints se encuentra documentado en el archivo [ROADMAP.md](./ROADMAP.md). Por favor referirse a ese archivo para ver los avances organizacionales.
