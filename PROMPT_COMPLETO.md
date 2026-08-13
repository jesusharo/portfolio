# Consejo de Agentes - Especificaciones Completas

## Descripción General
Aplicación de chat multi-agente donde 4 agentes especializados (Investigador, Analista, Estratega y Consejero) colaboran secuencialmente para ayudar a los usuarios con sus proyectos. La interfaz incluye una visualización de red con 50+ nodos, panel lateral de conversaciones, iconos de agentes posicionados a la derecha, y un input de chat centrado.

## Tecnologías
- React 18.3.1 con TypeScript
- React Router 7.13.0 (Data mode con RouterProvider)
- Tailwind CSS 4.1.12
- Lucide React para iconos
- Motion (Framer Motion) para animaciones

## Fuentes
```css
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@300;400;500;600;700&family=Source+Sans+Pro:wght@300;400;600;700&display=swap');
```

**Uso:**
- Source Sans Pro: Títulos, etiquetas, nombres de agentes
- Source Sans 3: Contenido de mensajes, inputs

## Paleta de Colores

### Colores de Agentes
```typescript
{
  'Investigador': '#ECDFFC',  // Púrpura claro
  'Analista': '#FBE1F7',      // Rosa claro
  'Estratega': '#0084FF',     // Azul brillante
  'Consejero': '#E7D3FF'      // Lavanda
}
```

### Colores de Stroke para Iconos
```typescript
{
  'Investigador': '#0367C4',  // Azul oscuro
  'Analista': '#0367C4',      // Azul oscuro
  'Estratega': 'white',       // Blanco
  'Consejero': '#0367C4'      // Azul oscuro
}
```

### Colores Generales
- Background principal: `#ffffff` (blanco)
- Texto principal: `#032b44` (azul oscuro)
- Input button: `#0084ff` (azul)
- Input button hover: `#0070d9`
- Texto secundario: `#c7c7c7` (gris claro)

## Estructura de Componentes

### 1. Layout Principal (ChatView)

**Fondo con efectos:**
```jsx
{/* Capa 1: Backdrop blur */}
<div className="absolute backdrop-blur-[20px] bg-gradient-to-t from-[69.674%] from-[rgba(255,255,255,0)] h-full left-0 to-[99.185%] to-[rgba(255,255,255,0.24)] top-0 w-full" />

{/* Capa 2: Gradiente radial SVG */}
<div className="absolute flex h-full items-center justify-center left-0 top-0 w-full">
  <div className="flex-none rotate-180">
    <div style={{ 
      backgroundImage: "url('data:image/svg+xml;utf8,<svg viewBox=\\'0 0 1512 982\\' xmlns=\\'http://www.w3.org/2000/svg\\' preserveAspectRatio=\\'none\\'><rect x=\\'0\\' y=\\'0\\' height=\\'100%\\' width=\\'100%\\' fill=\\'url(%23grad)\\' opacity=\\'0.20000000298023224\\'/><defs><radialGradient id=\\'grad\\' gradientUnits=\\'userSpaceOnUse\\' cx=\\'0\\' cy=\\'0\\' r=\\'10\\' gradientTransform=\\'matrix(-7.5282e-15 98.2 -151.2 -4.0275e-14 756 2.1805e-13)\\'><stop stop-color=\\'rgba(108,6,230,0.3)\\' offset=\\'0\\'/><stop stop-color=\\'rgba(145,68,236,0.25)\\' offset=\\'0.25\\'/><stop stop-color=\\'rgba(182,131,243,0.2)\\' offset=\\'0.5\\'/><stop stop-color=\\'rgba(255,255,255,0.1)\\' offset=\\'1\\'/></radialGradient></defs></svg>')" 
    }} />
  </div>
</div>
```

### 2. Header (Superior)

**Posición:** `fixed top-0 left-0 right-0 z-30`

**Estilos:**
```css
backdrop-blur-[15px]
bg-[rgba(255,255,255,0.7)]
padding: 40px 8px 8px 8px
```

**Contenido:**
- Icono de sombrero con gafas (20x20px)
- Título "Consejo de Agentes"
  - Font: Source Sans Pro
  - Size: 14px
  - Color: #032b44
  - Line-height: 1.4
- Botón de configuración (settings) en la esquina superior derecha
  - Position: absolute right-[24px] top-[24px]
  - Size: 20x20px

### 3. Sidebar (Izquierda)

**Posición:** 
```css
position: absolute
left: 85px
top: calc(50% + 40px)
transform: translateY(-50%)
width: 129px
z-index: 10
```

**Elementos:**

a) **Botón "Nueva conversación":**
```jsx
- Icono de mensaje circular (20x20px)
- Texto: "Nueva conversación"
- Font: Source Sans Pro, 14px
- Color: black
- Hover: opacity-70
```

b) **Lista de conversaciones:**
```jsx
- Cada conversación muestra su título truncado
- Font: Source Sans Pro, 14px
- Color: #c7c7c7
- Conversación activa: opacity-100
- Conversaciones inactivas: opacity-50
- Hover: opacity-70
```

### 4. Agent Panel (Derecha)

**Posición:**
```css
position: absolute
right: 88px
top: 397px
width: 168px
z-index: 10
gap: 16px (vertical)
```

**Iconos de Agentes:**
- Size: 32x32px
- Border-radius: 16px (circular)
- Stroke-width: 0.833333

**Orden de arriba a abajo:**
1. Investigador (#ECDFFC) - Icono de búsqueda
2. Analista (#FBE1F7) - Icono de briefcase
3. Estratega (#0084FF) - Icono de cerebro
4. Consejero (#E7D3FF) - Icono de bombilla

**Tooltip al hover:**
```css
position: absolute
right: 100% (con margin-right: 12px)
background: rgba(17, 24, 39, 1) /* gray-900 */
color: white
padding: 8px 12px
border-radius: 8px
font-size: 14px
opacity: 0 (por defecto)
group-hover: opacity-100
transition: opacity
```

Tooltip contiene:
- Nombre del agente (font-semibold)
- Descripción del agente (text-xs, text-gray-300)

### 5. Network Visualization

**Posición:**
```css
position: absolute
height: 961.324px
width: 965px
left: 50%
top: 50%
transform: translate(-50%, -50%)
opacity: 100
pointer-events: none
```

**Elementos:**
- Red compleja de líneas conectadas (stroke: #D9D9D9, opacity: 0.5, stroke-width: 0.919048)
- 50+ nodos circulares de diferentes tamaños:
  - Nodos grandes: radio 14.7048px
  - Nodos medianos: radio 7.35238px
  - Nodos pequeños: radio 3.67619px
  - Nodos especiales: radio 22.0571px, 9.19048px, 6.43333px, 5.51429px

**Colores de nodos:**
- Mayoría: #EDE0FC (púrpura claro)
- Acentos: #FFA1E0 (rosa/magenta)

### 6. Chat Input (Centro inferior)

**Posición:**
```css
position: absolute
left: 50%
top: 50%
transform: translate(-50%, -50%)
z-index: 20
```

**Contenedor:**
```css
background: white
width: 480px
padding: 24px 8px 24px 24px
border-radius: 32px
box-shadow: 0px 4px 36px 0px rgba(0,0,0,0.1)
gap: 24px
display: flex
align-items: end
```

**Input de texto:**
```css
font-family: 'Source Sans 3', sans-serif
font-weight: normal
font-size: 16px
line-height: 1.4
width: 376px
color: black
outline: none
placeholder: "Breve descripción de mi proyecto...."
placeholder-color: rgba(156, 163, 175, 1) /* gray-400 */
```

**Botón de envío:**
```css
background: #0084ff
width: 48px
height: 48px
border-radius: 32px
hover: #0070d9
disabled: opacity-50
transition: colors
```

- Icono: Flecha (send) blanca de 24x24px
- Stroke-width: 2

### 7. Message Bubble

**Estructura para mensajes del usuario:**
```css
display: flex
flex-direction: row-reverse
align-items: start
gap: 12px
margin-bottom: 24px
```

**Avatar del usuario:**
```css
width: 32px
height: 32px
border-radius: 50%
background: linear-gradient(to bottom right, rgb(147, 51, 234), rgb(37, 99, 235))
```
- Icono: User de lucide-react (20px, color blanco, stroke-width: 2)

**Burbuja del usuario:**
```css
background: linear-gradient(to right, rgb(147, 51, 234), rgb(37, 99, 235))
color: white
padding: 12px 16px
border-radius: 16px
max-width: 70%
```

**Estructura para mensajes de agentes:**
```css
display: flex
flex-direction: row
align-items: start
gap: 12px
```

**Avatar del agente:**
- AgentIcon component (32x32px, colores según el agente)

**Burbuja del agente:**
```css
background: white
border: 1px solid rgb(229, 231, 235) /* gray-200 */
color: rgb(17, 24, 39) /* gray-900 */
padding: 12px 16px
border-radius: 16px
max-width: 70%
box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
```

**Nombre del agente:**
```css
font-family: 'Source Sans Pro', sans-serif
font-size: 12px
font-weight: 600
color: rgb(55, 65, 81) /* gray-700 */
padding: 0 4px
margin-bottom: 4px
```

**Contenido del mensaje:**
```css
font-family: 'Source Sans 3', sans-serif
font-size: 14px
line-height: 1.625 /* relaxed */
```

**Timestamp:**
```css
font-family: 'Source Sans Pro', sans-serif
font-size: 12px
color: rgb(156, 163, 175) /* gray-400 */
padding: 0 4px
format: HH:MM (24 horas, locale es-ES)
```

### 8. Empty State

Cuando no hay mensajes, se muestra:
- NetworkVisualization centrada
- Altura completa del contenedor

### 9. Área de Mensajes

**Posición cuando hay mensajes:**
```css
position: absolute
left: 280px
right: 280px
top: 120px
bottom: 120px
overflow-y: auto
```

**Contenedor de mensajes:**
```css
padding: 0 32px
gap: 16px (vertical entre mensajes)
```

## Funcionalidad del Chat

### Sistema de Respuestas Secuenciales

Cuando el usuario envía un mensaje:

1. **Mensaje del usuario** se añade inmediatamente
2. **Agente 1 (Investigador)** responde después de 1.5s
3. **Agente 2 (Analista)** responde después de 2.5s
4. **Agente 3 (Estratega)** responde después de 3.5s
5. **Agente 4 (Consejero)** responde después de 4.5s

### Respuestas de Ejemplo

**Investigador:**
- "He encontrado información relevante sobre \"{userMessage}\". Identificando fuentes clave..."
- "Buscando datos actualizados sobre este tema. He localizado varios proveedores potenciales."
- "Investigación completada. He recopilado información de múltiples fuentes confiables."

**Analista:**
- "Analizando los datos recopilados. Generando un informe de viabilidad..."
- "He evaluado las certificaciones y la salud financiera de los candidatos."
- "Según mi análisis, hay 3 opciones principales que cumplen con los criterios."

**Estratega:**
- "Desarrollando una estrategia basada en los datos analizados..."
- "Mi recomendación es priorizar proveedores con certificación ISO 9001 y experiencia en aerospace."
- "He identificado los riesgos potenciales y las oportunidades de optimización."

**Consejero:**
- "Basándome en el análisis completo, sugiero contactar primero con los dos proveedores mejor calificados."
- "Los insights clave indican que la relación calidad-precio es óptima en la región de Cluj-Napoca."
- "Te recomiendo verificar también la capacidad de producción y los tiempos de entrega antes de decidir."

## Animaciones y Transiciones

### Scroll automático
- Cuando se añade un mensaje nuevo, scroll suave hacia el bottom
- Comportamiento: 'smooth'

### Hover effects
```css
Header settings button: opacity-70
Sidebar buttons: opacity-70
Chat input button: background color transition
Agent icons tooltip: opacity 0 → 100
```

### Transiciones
- All transitions: transition-opacity o transition-colors
- Duration: por defecto (200-300ms)

## Gestión de Conversaciones

### Estructura de datos

```typescript
interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'search' | 'tools' | 'brain' | 'insights';
  timestamp: Date;
  agentName?: string;
}

interface Agent {
  id: 'search' | 'tools' | 'brain' | 'insights';
  name: string;
  description: string;
  color: string;
  icon: string;
}
```

### Comportamiento

1. **Primera conversación:** Se crea automáticamente al iniciar (id: '1', title: 'Nueva conversación')
2. **Nuevo mensaje:** Si es el primer mensaje de una conversación, el título se actualiza con los primeros 50 caracteres del mensaje
3. **Nueva conversación:** Al hacer clic en "Nueva conversación", se crea con título "Conversación N" y se activa automáticamente
4. **Seleccionar conversación:** Al hacer clic en una conversación del sidebar, se activa y muestra sus mensajes

## Routing

```typescript
RouterProvider con createBrowserRouter:
- "/" → ChatView (conversación por defecto)
- "/chat/:conversationId" → ChatView (conversación específica)
```

## Responsividad

La aplicación está optimizada para desktop (1440px+). Los elementos tienen posiciones absolutas calculadas para:
- Sidebar: 85px desde la izquierda
- Agent Panel: 88px desde la derecha
- Header: full width, fixed top
- Chat Input: centrado absoluto
- Área de mensajes: 280px de margen lateral

## Detalles de Implementación Críticos

### Z-index layers
```
z-30: Header
z-20: Chat Input
z-10: Sidebar, Agent Panel
z-0: Background effects, Network Visualization
```

### Backdrop blur
- Header: 15px
- Background overlay: 20px

### Sombras
- Chat Input: 0px 4px 36px 0px rgba(0,0,0,0.1)
- Message bubbles (agent): 0 1px 2px 0 rgba(0, 0, 0, 0.05)

### Border radius
- Chat Input container: 32px
- Send button: 32px
- Message bubbles: 16px
- Agent icons: 16px (circular)
- Tooltips: 8px

## Iconos SVG (Importados)

Todos los iconos personalizados se importan desde archivos SVG:
- Hat with glasses (logo)
- Settings icon
- New conversation icon
- Send arrow icon
- Agent icons (4 diferentes: search, briefcase, brain, lightbulb)
- Network paths

SVG properties:
- fill: none (por defecto)
- preserveAspectRatio: none
- stroke-linecap: round
- stroke-linejoin: round

## Texto en Español

Todos los textos de la interfaz están en español:
- "Consejo de Agentes"
- "Nueva conversación"
- "Breve descripción de mi proyecto...."
- Nombres de agentes: Investigador, Analista, Estratega, Consejero
- Formato de hora: es-ES

## Performance

- pointer-events: none en NetworkVisualization para no interferir con interacciones
- Scroll smooth solo en el contenedor de mensajes
- Mensajes tienen keys únicas basadas en timestamp + tipo de agente
- Estado gestionado con useState y useCallback para optimización
