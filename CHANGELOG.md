# Changelog

All notable changes to **Tally — Digital Bank** will be documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/), versioning follows [Semantic Versioning](https://semver.org/).

---

## [1.0.0] — 2026-08-27

> 🚀 **Primera versión pública de Tally.** Tu banco digital, listo para lanzamiento.

### 🎉 Highlights

- Aplicación web completa de banca digital (neobank)
- Progressive Web App (PWA) instalable desde el navegador
- Diseño dark mode con glassmorphism
- Mobile-first responsive

---

### ✨ Features

#### Authentication & Onboarding
- Registro de usuario con nombre, email, teléfono y contraseña
- Inicio de sesión con email y contraseña
- Validación de formularios con mensajes claros en español
- Persistencia de sesión con JWT
- Página de bienvenida tras registro con regalo de $50 USD
- Términos y condiciones

#### Dashboard
- Vista principal con saldo disponible y número de cuenta
- Botón de refresh para actualizar datos
- Transacciones recientes en la página de inicio
- Loading skeletons para una experiencia fluida

#### Money Transfers
- Envío de dinero a cualquier usuario registrado por correo electrónico
- Formulario con validación de monto, concepto y saldo disponible
- Pantalla de procesamiento animada durante la transferencia
- Pantalla de éxito con recibo detallado (monto, destinatario, referencia, fecha)
- Pantalla de error con opción de reintentar
- Beneficiarios frecuentes — guardar y reutilizar destinatarios
- Historial de movimientos con paginación y carga incremental ("Ver más")

#### Bank Cards
- Visualización de tarjeta virtual con diseño realista
- Opción de mostrar/ocultar datos de la tarjeta
- Congelar/descongelar tarjeta
- Activar/desactivar pagos internacionales
- Skeleton loading para la tarjeta

#### Notifications
- Centro de notificaciones con feed completo
- Estados de leído/no leído
- Marcar como leído individualmente
- Marcar todas como leídas
- Iconos diferenciados por tipo (enviado, recibido, sistema)
- Caché en memoria para carga rápida

#### Profile & Settings
- Página de perfil con avatar y badge de verificación KYC
- Datos personales
- Seguridad
- Información de la cuenta
- Cierre de sesión con limpieza completa de caché

#### PWA (Progressive Web App)
- Service Worker para caché offline
- Manifest con iconos y splash screen
- Modal de instalación para nuevos visitantes
- Orientación portrait bloqueada
- Display standalone (sin barra de navegador)

---

### 🎨 UI/UX

- Dark mode exclusivo — fondo casi negro (`#04060C`)
- Glassmorphism en cards, modales y paneles
- Paleta de colores verde Tally (`#10B981`) como acento principal
- Glow backgrounds con baja opacidad
- Fuente Inter Variable self-hosted
- Animaciones: pulse en badges, spin en loaders, scale en botones
- Toast notifications para mensajes in-app
- Layout mobile-first, centrado en desktop (`max-w-lg`)

---

### 🛠 Tech Stack

- React 19 + TypeScript
- Vite 8 con React Compiler (Babel)
- Tailwind CSS v4 (configuración CSS-first)
- React Router v7
- React Hook Form
- Phosphor React (iconos)
- Despliegue en Vercel

---

### 📁 Architecture

- Componentes UI reutilizables (`components/ui/`)
- Layout compartido (Header, BottomNav, AuthLayout, PageHeader)
- Pages con componentes privados (`pages/X/components/`)
- Servicios de API por dominio (auth, account, transfer, notification)
- Caché en memoria con TTL
- Validación centralizada de formularios
- Tipado completo en TypeScript (sin `any`)
- Rutas protegidas con guards (ProtectedRoute, PublicOnlyRoute, RootRedirect)

---

### 🐛 Fixes

- Corrección de redirección a cuenta real de usuarios
- Corrección de bug al mostrar datos de la API
- Corrección de nombre de inicio de sesión
- Corrección de rutas SPA para despliegue en Vercel
- Sesión persistente implementada correctamente
- Welcome page corregida para limpiar flag de registro
- Fix de datos declarados no leídos en dashboard

---

### 📝 Docs

- `DESIGN.md` — Documentación completa del design system
- `README.md` — Documentación del proyecto con guía de inicio rápido

---

## [Unreleased]

### Planned

- Depósitos de dinero
- Préstamos
- Autenticación biométrica
- Transferencias internacionales
- Notificaciones push
- Modo claro
