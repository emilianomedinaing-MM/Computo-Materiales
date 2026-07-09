# Medina Materiales — Módulo de Parámetros Técnicos

## Archivos generados

```
src/
├── types/
│   └── parametros.ts          ← Tipos TypeScript de todos los parámetros
├── lib/
│   ├── defaultParams.ts       ← Valores por defecto + metadatos para UI
│   └── computo.ts             ← Motor de cómputo (usa parámetros dinámicos)
├── hooks/
│   ├── useParametros.ts       ← Context + hook global (carga API + LS)
│   └── useAdminAuth.ts        ← Autenticación simple con sessionStorage
├── components/
│   ├── PasswordGate.tsx       ← Pantalla de contraseña
│   └── Parametros.tsx         ← Sección de parámetros editable
└── app/
    └── api/
        └── parametros/
            └── route.ts       ← API Route: GET / PUT / DELETE
```

---

## Instalación

```bash
# 1. Copiar los archivos al proyecto Next.js existente

# 2. Instalar dependencias opcionales
npm install @vercel/kv       # Persistencia en Vercel KV (Redis)
# Si no instalás @vercel/kv, el sistema usa /tmp como fallback
# y localStorage en el cliente como cache

# 3. Configurar variables de entorno en Vercel
# Dashboard → Settings → Environment Variables

NEXT_PUBLIC_ADMIN_PASSWORD=tu_contraseña_segura

# Si usás Vercel KV:
KV_URL=...
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
KV_REST_API_READ_ONLY_TOKEN=...
# (estas variables las genera Vercel KV automáticamente al crear el store)
```

---

## Configurar Vercel KV (recomendado, gratis en plan Hobby)

1. Ir a tu proyecto en vercel.com
2. **Storage** → **Create Database** → **KV**
3. Conectar al proyecto → las variables KV_* se agregan automáticamente
4. Hacer redeploy

---

## Integrar en tu layout

### 1. Agregar el Provider en `src/app/layout.tsx`

```tsx
import { ParamProvider } from '@/hooks/useParametros';

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <ParamProvider>
          {children}
        </ParamProvider>
      </body>
    </html>
  );
}
```

### 2. Botón "Parámetros" en tu navbar o header

```tsx
'use client';
import { useState } from 'react';
import { Parametros } from '@/components/Parametros';

export function AppShell() {
  const [showParams, setShowParams] = useState(false);

  if (showParams) {
    return <Parametros onClose={() => setShowParams(false)} />;
  }

  return (
    <>
      {/* tu botón en el header */}
      <button
        onClick={() => setShowParams(true)}
        className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
      >
        ⚙️ Parámetros
      </button>

      {/* resto de tu app */}
    </>
  );
}
```

### 3. Usar el motor de cómputo en tu página principal

```tsx
'use client';
import { useParametros } from '@/hooks/useParametros';
import { calcularComputo } from '@/lib/computo';

export function PaginaComputo() {
  const { params, loading } = useParametros();

  function handleCalcular(inputs) {
    if (loading) return;
    const resultado = calcularComputo(inputs, params);
    // resultado es { Cimientos: [...], Mampostería: [...], ... }
  }
}
```

---

## Comportamiento del sistema de persistencia

| Escenario | Comportamiento |
|-----------|----------------|
| Vercel KV configurado | Guarda en Redis, persiste entre deploys |
| Sin KV | Guarda en `/tmp` (persiste en la instancia) + localStorage |
| Sin conexión | Usa localStorage como cache local |
| Primera carga | API → localStorage → defaults |

Los parámetros nunca se pierden: si la API falla, el cliente mantiene
el último estado guardado en localStorage.

---

## API endpoints

| Método | URL | Descripción |
|--------|-----|-------------|
| GET | `/api/parametros` | Obtiene parámetros actuales |
| PUT | `/api/parametros` | Guarda nuevos parámetros (body: JSON) |
| DELETE | `/api/parametros` | Restaura valores por defecto |

La API valida que todos los valores sean números finitos y positivos
antes de guardar.

---

## Seguridad

- La contraseña se almacena como variable de entorno `NEXT_PUBLIC_ADMIN_PASSWORD`
- La sesión dura 4 horas (sessionStorage, se borra al cerrar el tab)
- NO es seguridad de producción; es protección básica para uso interno
- Si necesitás seguridad real: usar NextAuth.js con proveedor OAuth

---

## Agregar nuevos parámetros

1. Agregar el campo en `src/types/parametros.ts` (interfaz correspondiente)
2. Agregar el valor por defecto en `DEFAULT_PARAMS` en `src/lib/defaultParams.ts`
3. Agregar el metadato en `PARAM_CATEGORIAS` en `src/lib/defaultParams.ts`
4. Usarlo en `src/lib/computo.ts` con `p.seccion.nombreParam`

La UI lo mostrará automáticamente en la categoría correspondiente.
