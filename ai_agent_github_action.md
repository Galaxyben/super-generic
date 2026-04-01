# Análisis del AI-Agent en GitHub Actions (Auto-Resolve Bug)

El repositorio cuenta con un flujo de GitHub Actions bastante avanzado llamado **"Auto-Resolve Bug"** (`auto-resolve.yml`) que actúa como un Agente de IA para resolver automáticamente tickets de Notion. A continuación se detalla su funcionamiento paso a paso.

---

## 🚀 Desencadenadores (Triggers)
El agente se ejecuta mediante dos vías:
1. **Automática (`repository_dispatch`):** Cuando recibe un webhook/evento llamado `notion-bug-ticket`, asumiendo que viene de una integración con Notion.
2. **Manual (`workflow_dispatch`):** Permite pruebas especificando el ID del ticket de Notion, si es urgente (`is_hotfix`) y seleccionando el proveedor de Inteligencia Artificial (Claude, Gemini o Codex/GPT) junto con el modelo deseado.

---

## ⚙️ Fases del Flujo de Trabajo

### Fase 1: Validación y Prevención de Colisiones (`validate`)
1. **Parseo de datos:** Identifica el `TICKET_ID`, si el ticket es un `Hotfix` (rama base `main`) o una corrección estándar (rama base `dev`).
2. **Verificación de PRs duplicados:** Busca a través del CLI de GitHub (`gh pr list`) si ya existe un Pull Request abierto que mencione el ID del ticket.
3. Si existe colisión, detiene el flujo y lanza la fase de **Notificación de Colisión (`handle-collision`)**, actualizando el ticket en Notion a `"Potential PR Collision"`.

### Fase 2: Preparación del Entorno (`resolve`)
Si no hay colisiones, arranca el proceso de resolución:
1. Hace checkout a la rama base (`main` o `dev`) y crea una rama nueva con el formato `Hotfix/ticket-ID` o `Fix/ticket-ID`.
2. Instala **Node.js 22** y purga dependencias con `npm ci`.
3. Según la configuración (o el proveedor por defecto), instala globalmente la CLI correspondiente (`@anthropic-ai/claude-code`, `@google/gemini-cli`, o `@openai/codex`).

### Fase 3: Clasificación Inteligente del Ticket (Triage)
El agente utiliza el LLM en modo rápido para determinar el propósito real del ticket leyendo los datos desde Notion.
- **Prompt:** Lee los detalles del ticket y lo clasifica estrictamente en `"BUG"` (Error real) o `"NOT_BUG"` (Dudas de soporte, peticiones, etc.).
- Si determina que es `NOT_BUG`, actualiza en Notion el estado a `"Not a Bug"` y *aborta* la ejecución.

### Fase 4: Recopilación de Contexto Visual y Textual
Dado que el problema se detectó como un BUG real:
1. **Extracción Textual:** Hace consultas directas a la API de Notion descargando la descripción, iterando sobre los párrafos, listas y encabezados del ticket.
2. **Análisis Visual (Vision API):** Extrae todas las URLs de las imágenes que se adjuntaron en el reporte del Notion. Empleando la IA visual del proveedor elegido (ej. Claude-3.5-Haiku, Gemini-2.5-Flash, GPT-4o-mini), *analiza cada captura de pantalla para identificar fallos de interfaz de usuario, errores de visualización o pop-ups de error*, generando un resumen en texto de lo que observó.

### Fase 5: Ejecución del Agente Principal
El Agente de escritura de código entra en acción.
- Agrupa la solicitud con la plantilla del sistema base (`.github/prompts/auto-resolve-system.md`).
- Combina la descripción de texto de Notion + el sumario extraído de las capturas de pantalla + las instrucciones para ejecutar el fix.
- El modelo inicia su ciclo recursivo de iteración donde navega por el repositorio localmente, busca el fallo, lo parchea y verifica sintaxis.

### Fase 6: Validaciones y Seguridad Estricta
Una vez que el Agente dice que terminó:
1. Ejecuta un escaneo de seguridad (script `.github/scripts/security-scan.sh`).
2. Obtiene los ficheros alterados por el agente (exclusivamente esos) para realizar una **Validación estricta**:
   - `npx tsc --noEmit` para comprobar tipos a nivel global.
   - `npx eslint` sobre los ficheros tocados para asegurar estándares de calidad de código.

### Fase 7: Consolidación y PR (Pull Request) Automático
Si la reparación superó todas las pruebas:
1. **Detección Automática de Etiquetas (Labels):** Analiza en qué carpetas están los ficheros editados (ej. `learner-portal`, `backend-services`, `shared-ui`, `auth`, etc.) para asignar etiquetas al PR pertinentemente. 
2. **Commit y Push:** Fuerza sus cambios a la rama temporal bajo la identidad de la cuenta de `github-actions[bot]`.
3. **Drafting del Pull Request:** Extrae un formato ordenado de "Resumen generado por el agente" de sus *logs* y lo coloca como descripción en el PR, detallando todos los pormenores detectados. 
4. Asigna automáticamente validadores reales de la plantilla de trabajo (`peteycosta, SpenceBatt`).
5. **Cierre de Ciclo en Notion:** Modifica el documento de la incidencia en Notion cambiando su estatus en tiempo real a `"👀 PR Review & QA"` y enlazando la URL real de GitHub para su fácil evaluación humana.

---

> [!WARNING]
> **Gestión de fallos globales**
> Existe un sub-trabajo de tolerancia (Job: `notify-failure`) que rastrea toda la tubería anterior. Si en cualquier punto el Agente revienta, el linter fracasa repetidamente o la API de Notion se cae, el contenedor principal transita su estado a **Fallo**, comunicándose con la base de datos de Notion para reclasificar el ticket como `"🛑 Blocked"` (y `"AI Failure"`), devolviendo el registro del *Run Log* para análisis humano sin quedarse eternamente estancado.
