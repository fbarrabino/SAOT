# SaOT — Frontend (React Native + Expo)

App mobile de SaOT. Hoy cubre el **Bloque 1**: auth completo + shell de tabs.

## Stack
- Expo (~51) + React Native (0.74) + TypeScript
- expo-router (navegación file-based)
- react-native-svg (logo OT y todos los íconos)
- expo-linear-gradient (CTAs, auroras, tints de billeteras)
- Fuentes: Space Grotesk (display) + Plus Jakarta Sans (body) vía `@expo-google-fonts`

## Cómo correr

```powershell
cd Frontend
pnpm install   # solo la primera vez
pnpm start
```

Después escaneás el QR con la app de **Expo Go** (iOS o Android), o desde la app entrás manualmente a `exp://<tu-IP-LAN>:8081`.

> El script `start` ya invoca Expo CLI vía `node` directo para esquivar el bug de `verify-deps-before-run` de pnpm 11.
>
> Si no tenés pnpm: `corepack prepare pnpm@latest --activate` (corepack viene con Node 16+).
>
> Si la primera vez Windows te pregunta por el firewall, **permitilo en redes privadas** o Expo Go no te va a poder conectar.

## Pantallas implementadas (10)

### Auth (7)
- `app/(auth)/login.tsx`
- `app/(auth)/signup.tsx`
- `app/(auth)/forgot-password.tsx`
- `app/(auth)/email-sent.tsx`
- `app/(auth)/reset-code.tsx` — input de 6 dígitos
- `app/(auth)/reset-new-password.tsx` — con reglas de validación visuales
- `app/(auth)/reset-success.tsx`

### Shell (3 tabs + Actividad placeholder)
- `app/(tabs)/home.tsx` — balance total + cards de billetera + acciones rápidas + actividad reciente
- `app/(tabs)/wallets.tsx` — listado de billeteras conectadas + CTA de conectar nueva
- `app/(tabs)/activity.tsx` — placeholder, contenido real en Bloque 2
- `app/(tabs)/profile.tsx` — usuario + menú de ajustes + cerrar sesión

## Flujo de navegación

```
/ (index) → redirect a /login

login ─┬─→ /signup
       ├─→ /forgot-password → /email-sent → /reset-code → /reset-new-password → /reset-success → /login
       └─→ (botón Ingresar) → /tabs/home

tabs: home | wallets | activity | profile
profile → "Cerrar sesión" → /login
```

> Los botones de submit **no validan ni llaman al backend** todavía — solo navegan. Esto es solo UI.

## Estructura

```
Frontend/
├─ app/
│  ├─ _layout.tsx              (root: carga fonts + stack raíz)
│  ├─ index.tsx                (redirect → login)
│  ├─ (auth)/                  (stack de auth)
│  │  ├─ _layout.tsx
│  │  └─ *.tsx                 (7 pantallas)
│  └─ (tabs)/                  (tab bar: 4 tabs)
│     ├─ _layout.tsx
│     └─ *.tsx                 (4 pantallas)
├─ src/
│  ├─ theme/tokens.ts          (colores, gradientes, tipografía, radios — derivados de saot.css)
│  └─ components/
│     ├─ OTLogo.tsx            (logo de marca SVG inline — el que pasaste)
│     ├─ AppIcon.tsx           (tile redondeado gradiente lime + OT — el que se ve en Login)
│     ├─ AuroraBackground.tsx  (auroras radiales firma del producto)
│     ├─ PrimaryButton.tsx     (gradiente cyan + sombra)
│     ├─ SocialButton.tsx      (Apple / Google / Face ID)
│     ├─ Input.tsx             (con label uppercase + toggle VER para passwords)
│     ├─ CodeInput.tsx         (6 casillas con auto-focus)
│     ├─ ScreenHeader.tsx      (botón volver glass + título centrado)
│     └─ WalletGlyph.tsx       (placeholders MP/Ualá/Lemon hasta tener los PNGs)
├─ package.json
├─ app.json
├─ tsconfig.json
├─ babel.config.js
└─ expo-env.d.ts
```

## Tokens (resumen)
- **Fondo:** negro puro + auroras azul/violeta/lima.
- **Acento:** cyan `#39C3F2` con gradiente a teal `#6FE0D6`.
- **Texto:** blanco + escala de muted/dim.
- **Radios:** cards 16–20, botones 14, pills 999.
- **Fuentes:** Space Grotesk (display/montos) + Plus Jakarta Sans (resto).

Tokens completos en `src/theme/tokens.ts`.

## Pendientes
- **Logos PNG de billeteras** (MP, Ualá, Lemon, Naranja X, Brubank). Hoy uso un glyph de letra como placeholder en `WalletGlyph.tsx`. Cuando tengamos los PNGs, los meto en `src/assets/wallets/` y reemplazo el componente.
- **Lógica de auth real** + conexión al backend → otro momento (lo dejaste claro).
- Bloques 2–5 según mapa del handoff.
