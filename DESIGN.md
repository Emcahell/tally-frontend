# Design System — Tally Neobank

> **Guía de diseño para agentes de código.** Seguir estas reglas al crear o modificar componentes para mantener consistencia visual.

---

## 1. Stack

| Capa | Tecnología |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 8 |
| Estilos | Tailwind CSS v4 (theme en CSS, no config file) |
| Iconos | **phosphor-react** (`import { Icon } from 'phosphor-react'`) — NUNCA lucide-react ni otra lib |
| Fuente | Inter Variable Font (local en `src/assets/fonts/Inter/`) |

---

## 2. Paleta de Colores

### Primary (Tally Green)
| Token | Valor | Uso |
|---|---|---|
| `primary` | `#10B981` | Botones principales, links activos, acentos fuertes |
| `primary-glow` | `rgba(16, 185, 129, 0.25)` | Sombras de botones, glow effects |
| `primary-accent` | `#34D399` | Hover states, variantes secundarias |

### Backgrounds (Dark Mode Only)
| Token | Valor | Uso |
|---|---|---|
| `bg-deep` | `#04060C` | Fondo general de la app (casi negro) |
| `bg-surface` | `#0A0F1A` | Navbar, header, superficies elevadas |
| `bg-card` | `rgba(12, 18, 32, 0.7)` | Cards con glassmorphism |
| `bg-card-solid` | `#0C1220` | Cards sin transparencia |
| `border` | `rgba(255, 255, 255, 0.08)` | Bordes sutiles en todo |

### Accent Colors
| Token | Valor | Uso |
|---|---|---|
| `accent-cyan` | `#06B6D4` | Ingresos, depósitos, info |
| `accent-violet` | `#8B5CF6` | Categorías premium, badges |
| `accent-amber` | `#F59E0B` | Advertencias, alertas |
| `accent-rose` | `#F43F5E` | Errores, gastos, elimination |

### Text
| Token | Valor | Uso |
|---|---|---|
| `text-primary` | `#F9FAFB` | Títulos, montos, texto principal |
| `text-secondary` | `#9CA3AF` | Descripciones, subtítulos |
| `text-muted` | `#6B7280` | Labels, timestamps, texto de fondo |

### Semantic
| Token | Valor | Uso |
|---|---|---|
| `success` | `#10B981` | Confirmaciones, estados positivos |
| `warning` | `#F59E0B` | Warnings, attention |
| `error` | `#F43F5E` | Errores, eliminaciones |
| `info` | `#06B6D4` | Informational, links |

---

## 3. Clases de Tailwind

Todas las variables CSS están registradas en `@theme` de Tailwind v4. Se usan directamente como clases:

```
bg-primary          → #10B981
bg-bg-deep          → #04060C
bg-bg-card          → rgba(12, 18, 32, 0.7)
text-text-primary   → #F9FAFB
border-border       → rgba(255, 255, 255, 0.08)
hover:bg-primary-accent → #34D399 en hover
```

**Regla:** Usar SIEMPRE las tokens del theme, NUNCA valores hardcodeados en clases (`bg-[#10B981]` está prohibido).

---

## 4. Glassmorphism

El estilo visual principal de la app. Aplicar en cards, modales, paneles flotantes.

```tsx
// Componente base
<GlassCard glow className="p-6">
  {/* contenido */}
</GlassCard>

// Clases Tailwind equivalentes
className="rounded-3xl bg-bg-card border border-border backdrop-blur-xl"
```

**Reglas de glassmorphism:**
- `backdrop-blur-xl` siempre presente
- `bg-bg-card` (semi-transparente)
- `border border-border` (borde sutil blanco al 8%)
- `rounded-3xl` para cards grandes, `rounded-2xl` para elementos medianos, `rounded-xl` para botones/chips
- Glow: usar `bg-primary/8` con `blur-[120px]` — NUNCA más del 10% de opacidad en el fondo

---

## 5. Componentes UI (`src/components/ui/`)

### GlassCard
```tsx
import { GlassCard } from '../components/ui/GlassCard';

<GlassCard glow className="p-6">
  {children}
</GlassCard>
```
- `glow`: agrega un resplandor verde sutil en la esquina inferior derecha

### Avatar
```tsx
import { Avatar } from '../components/ui/Avatar';

<Avatar src={url} alt="Nombre" size="md" showStatus />
```
- `size`: `"sm"` (32px) | `"md"` (40px) | `"lg"` (48px)
- `showStatus`: indicador verde de estado online

### IconButton
```tsx
import { IconButton } from '../components/ui/IconButton';

<IconButton aria-label="Notificaciones" badge>
  <Bell size={20} weight="bold" />
</IconButton>
```
- `badge`: punto verde con animación pulse

---

## 6. Iconos (phosphor-react)

### Importación
```tsx
import { Bell, Eye, ArrowUpRight } from 'phosphor-react';
```

### Sizes
| Contexto | Size |
|---|---|
| Navbar | `size={22}` |
| Header buttons | `size={20}` |
| Action buttons internos | `size={14}` |
| Transaction icons | `size={20}` |

### Weights
| Contexto | Weight |
|---|---|
| Iconos activos/seleccionados | `weight="fill"` |
| Iconos normales | `weight="regular"` |
| Iconos de acción/importantes | `weight="bold"` |

### Colores en iconos
- Usar `className` con clases de color de Tailwind: `text-primary`, `text-accent-cyan`, `text-text-muted`
- Iconos de depósito → `text-accent-cyan`
- Iconos de retiro/gasto → `text-primary`
- Iconos inactivos → `text-text-muted`

---

## 7. Layout & Estructura

### Header (Fixed Top)
```tsx
<header className="fixed top-0 left-0 right-0 z-40 bg-bg-deep/80 backdrop-blur-xl px-5 pt-10 pb-4 flex items-center justify-between max-w-lg mx-auto">
```
- Siempre fijo arriba, fondo semitransparente con blur
- Contenido: Avatar + Bienvenido + IconButton de notificaciones
- Padding top `pt-10` para safe area

### BottomNav (Fixed Bottom)
```tsx
<nav className="fixed bottom-0 left-0 right-0 z-50 bg-bg-surface/90 backdrop-blur-xl border-t border-border overflow-hidden">
```
- Siempre fijo abajo, 4 tabs: Inicio, Enviar, Depositar, Tarjetas
- Tabs sin redirección (solo visual por ahora)
- `overflow-hidden` para prevenir scroll horizontal

### Content Area
```tsx
<div className="relative z-10 max-w-lg mx-auto">
  <div className="h-[88px]" /> {/* Spacer para header fijo */}
  <main className="px-5 space-y-6 pb-20"> {/* pb-20 para navbar */}
    {/* contenido */}
  </main>
</div>
```
- `max-w-lg mx-auto` para centrar en desktop
- Spacer de 88px arriba para header fijo
- `pb-20` para evitar que el navbar tape contenido
- `px-5` como padding horizontal estándar

---

## 8. Tipografía

| Uso | Clase | Ejemplo |
|---|---|---|
| Balance principal | `text-3xl font-extrabold tracking-tight` | `$24,850.40` |
| Título de sección | `text-base font-bold` | `Movimientos Recientes` |
| Nombre de usuario | `text-sm font-semibold tracking-wide` | `Alex Turner` |
| Label sekundario | `text-xs font-medium text-text-muted uppercase tracking-wider` | `BALANCE TOTAL` |
| Monto de transacción | `text-sm font-bold` | `+ $250.00` |
| Subtítulo/transacción | `text-xs text-text-muted` | `Hoy · 2:45 PM` |
| Texto de botón/acción | `text-xs font-medium` | `Refrescar` |
| Número de cuenta | `text-sm text-text-secondary font-mono tracking-wider` | `****1234` |

---

## 9. Espaciado

| Contexto | Valor |
|---|---|
| Padding horizontal de página | `px-5` |
| Gap entre secciones | `space-y-6` |
| Padding de cards | `p-6` |
| Gap interno de items | `gap-3` |
| Separación entre header y contenido | `h-[88px]` (spacer) |
| Bottom padding del contenido | `pb-20` |

---

## 10. Border Radius

| Elemento | Radio |
|---|---|
| Cards grandes (GlassCard) | `rounded-3xl` |
| Elementos medianos (botones de acción) | `rounded-2xl` |
| Botones pequeños, chips, badges | `rounded-full` o `rounded-xl` |
| Avatares | `rounded-full` |
| Iconos de transacción | `rounded-full` |

---

## 11. Efectos Visuales

### Glow Background
```tsx
<div className="fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
```
- Opacidad máxima: 8% para verde, 5% para cyan
- `pointer-events-none` siempre
- Solo en pages principales, no en modales

### Glassmorphism Blur
- `backdrop-blur-xl` en cards y paneles
- Fondo semi-transparente `bg-bg-card`
- Bordes sutiles `border border-border`

### Animaciones
- `animate-pulse` solo en badges/puntos de notificación
- `transition-colors` en botones interactivos
- `transition-all` en action buttons (para scale + color)
- `group-active:scale-90` en botones de acción (feedback táctil)

---

## 12. Layout Mobile-First

### Breakpoints
| Tailwind | Rango | Uso |
|---|---|---|
| Default | < 640px | **Mobile first** — diseño principal |
| `sm:` | ≥ 640px | Ajustes para tablets |
| `md:` | ≥ 768px | Desktop — `max-w-lg` centrado |
| `lg:` | ≥ 1024px | Desktop grande |

### Reglas
- El diseño base SIEMPRE es mobile
- Desktop: contenido centrado con `max-w-lg mx-auto`
- Header y BottomNav se adaptan con `max-w-lg mx-auto`
- Cards y contenido usan `px-5` como padding estándar

---

## 13. Estructura de Componentes

```
src/
├── components/
│   ├── ui/                    # Primitivas reutilizables (sin lógica de negocio)
│   │   ├── GlassCard.tsx
│   │   ├── Avatar.tsx
│   │   └── IconButton.tsx
│   └── shared/
│       └── layout/            # Layout shell (Header, BottomNav)
├── pages/
│   ├── dashboard/
│   │   ├── DashboardPage.tsx  # Página = layout + componentes
│   │   └── components/        # Componentes específicos de esta página
│   ├── auth/
│   ├── accounts/
│   ├── transfers/
│   ├── cards/
│   ├── loans/
│   ├── settings/
│   └── errors/
├── hooks/                     # Custom hooks
├── services/                  # API calls (una archivo por dominio)
├── types/                     # Interfaces TypeScript
├── utils/                     # Helpers
├── contexts/                  # React Contexts
├── constants/                 # Constantes globales
└── config/                    # Configuración de la app
```

### Reglas de estructura
- **`components/ui/`** → solo componentes VISUALES, sin dependencias de negocio
- **`components/shared/`** → componentes compartidos entre pages
- **`pages/X/components/`** → componentes PRIVADOS de esa página
- **Un componente por archivo** (para componentes no triviales)
- **Named exports** para componentes, default export solo para pages

---

## 14. Reglas de Consistencia

1. **Siempre usar tokens del theme** — no hardcodear colores en clases
2. **Siempre importar de `phosphor-react`** — nunca lucide-react ni otra lib de iconos
3. **Glassmorphism consistente** — mismo blur, mismo border, mismo radius
4. **Mobile-first** — diseñar para mobile, adaptar para desktop
5. **Header y BottomNav siempre fixed** — nunca sticky, nunca inline
6. **Spacing consistente** — `px-5` horizontal, `space-y-6` entre secciones
7. **Tipografía consistente** — seguir la tabla de tipografía (sección 8)
8. **Nombres en español** para labels de UI, en inglés para código
9. **No usar `any`** — tipar todo con TypeScript
10. **Un color por contexto** — depósitos=cyan, gastos=primary, errores=rose

---

## 15. Imágenes de Referencia

Las imágenes de referencia del diseño están en la memoria de la conversación. Al crear nuevas pantallas, mantener:
- Fondo `bg-deep` oscuro
- Glassmorphism en cards
- Green accent sutil, no dominante
- Glow backgrounds de baja opacidad
- Texto claro sobre fondo oscuro
- Iconos de phosphor-react siempre
