# 🗺️ Roadmap de Zenco - Plan Maestro a Largo Plazo

Este documento contiene la hoja de ruta estratégica definida entre los equipos fundadores para llevar a Zenco (y futuros negocios) a su máxima automatización y madurez.

---

## 🟢 Fase 1: Estructura Visual y UI/UX (¡Completada!)
**Objetivo:** Crear una "Demo Robusta" que funcione como cimiento para todo el front-end del proyecto.

- [x] Elegir paleta visual ("Zorro" Kitsune de tonos ámbar) y diseñar interfaz Premium.
- [x] Desarrollar el *Dashboard UI* principal (Métricas y Órdenes Urgentes que expiran).
- [x] Administrador simulado de Prendas y Filtrado de Búsqueda.
- [x] Control de Calidad: Iniciar infraestructura de _Playwright_ (Pruebas e2e).

## 🟡 Fase 2: Motor Inteligente (Incialización del Bot)
**Objetivo:** Integrar un Agente IA con la capacidad técnica de conectarse a WhatsApp.

- [x] Preparar POC (Proof of Concept) del Agente Zenco con Prompt base.
- [x] Implementar Node + `@whiskeysockets/baileys` para sincronizar códigos QR de WhastApp sin usar APIs costosas de Meta.
- [x] Configurar la API de la Inteligencia artificial elegida (ej. Google Gemini Free Tier).

## 🟡 Fase 3: Infraestructura Local y Datos (Current Sprint)
**Objetivo:** Conectar el frontend a un backend real para que se guarden datos persistentemente y poder prepararnos para publicarlo en Internet.

- [ ] Instalar Base de Datos transitoria eficiente (Prisma + SQLite/Postgresql).
- [ ] Desarrollar esquema para `Cliente`, `Prenda`, y `Finanzas`.
- [ ] API (Express): Exponer datos para que la Web (Vite) reemplace sus datos falsos por los traídos de la DB.

## 🔴 Fase 4: Cloud y El Cerebro Final (Próximos Sprints)
**Objetivo:** Exponer los puertos a internet y enseñarle a la IA a manejar el taller.

- [ ] **Deploy:** Subir la Web a un tier gratuito (ej. Vercel) y el Bot a un VPS / VPN Túnel permanente.
- [ ] Conectar Functions (Tools) de la IA: Cuando alguien pida por WhatsApp "cómo va mi arreglo", el Bot automáticamente debe ejecutar un `SELECT` en la tabla Orders de Prisma ORM para chequear en tiempo real si está En Proceso, sin intervención de Ariel ni Ana.
- [ ] Agendar turnos si alguien pide ir a retirar o acercarse vinculando **Google Calendar API**.

## 🔴 Fase 5: Expansión Arquitectónica (Multi-negocio)
**Objetivo:** El mismo repositorio o la misma arquitectura VPS servirá de soporte para el Centro de Masajes de Damián.

- [ ] Refactorización Multi-tenant (Opcional) o aislamiento de Docker.
- [ ] Copiar esta misma base de Node + React para levantar el negocio de Damián modificando únicamente la identidad visual, los Prompts de la IA y el esquema de productos (Servicios Médicos vs Ropa).
- [ ] Generador de Turnos para el local de masajes integrado con Google Calendar.
