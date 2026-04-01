# PRD: Auto-Resolve AI Agent (MVP Privado)

## 📌 1. Objetivo del Proyecto
Reconstruir el flujo de automatización "Auto-Resolve Bug" desde cero en un entorno privado (fuera de la empresa actual). El objetivo principal de este MVP (Minimum Viable Product) es servir como **Demostración de Ventas (Proof of Concept)** para grabar el video (Loom) y usarlo como Lead Magnet o portafolio B2B.

---

## 🛠️ 2. Selección de Plataforma (Issue Tracker)
Puesto que buscamos una integración 100% gratuita y efectiva para el MVP, aquí está la evaluación:

1. **GitHub Issues (Nativo) - *¡Recomendación #1 para MVP rápido!***
   - **Costo:** $0.
   - **Pros:** No requieres webhooks externos. GitHub Actions se dispara nativamente cuando creas un issue con el label `bug`.
   - **Contras:** Menos "empresarial" para el demo, pero perfecta para arrancar hoy mismo.
2. **Jira Cloud (Free Tier) - *¡Recomendación #1 para Ventas B2B!***
   - **Costo:** Gratis hasta 10 usuarios.
   - **Pros:** Es el estándar de la industria. Si en tu demo muestras que se conecta directo con Jira, las agencias Dev Shops enloquecerán de emoción porque es lo que ellos usan. Tiene webhooks nativos muy potentes.
   - **Contras:** La API es un poco burocrática de configurar inicialmente.
3. **ClickUp (Free Tier)**
   - **Costo:** Gratis.
   - **Pros:** Visualmente atractivo, tiene automatizaciones.
   - **Contras:** Los Webhooks salientes a veces requieren planes de pago o usar herramientas puente como Make/Zapier, lo cual añade fricción.
4. **Notion**
   - **Costo:** Gratis.
   - **Contras:** Notion no tiene Webhooks nativos directos (Outbound Webhooks) desde sus bases de datos sin integraciones de terceros. Requerirías que GitHub Action haga *polling* (preguntar cada 5 mins si hay tickets nuevos) lo cual gasta minutos de Action, o usar Zapier/Make. 

**Veredicto para el Demo:** Configuralo en **Jira Cloud (Gratis)** para máxima credibilidad B2B. Jira enviará un webhook (POST) a tu GitHub cuando un ticket pase a estado `In Progress` o se asigne una etiqueta específica.

---

## 🏗️ 3. Arquitectura del MVP
El MVP se simplificará para que sea robusto pero fácil de mantener por ti.

1. **Trigger Base:** Webhook desde Jira hacia GitHub (`repository_dispatch` trigger).
2. **El "Dummy App":** Un repositorio en React o Next.js básico (Ej. una landing page intencionalmente rota) que servirá como el "paciente" que el Agente va a curar en vivo.
3. **Orquestador (El Auto-Resolve Action):** 
   - Parseo del `TICKET_ID` que manda Jira.
   - Checkout de la rama `main` y creación de `fix/TICKET_ID`.
   - Script interactuando con la API de **Gemini o Claude**.
4. **Provedor LLM:** Usar Gemini (que tiene una capa gratuita generosa para experimentación) o invertir $5 USD en créditos de Anthropic para usar Claude 3.5 Sonnet, que es el mejor para escribir código en este momento.

---

## 🚀 4. Plan de Ejecución (Paso a Paso)

### Fase 1: Setup del Entorno
- [ ] Crear cuenta gratuita en Atlassian (Jira Software).
- [ ] Crear un proyecto Kanban simple llamado `Autoresolve Demo (AD)`.
- [ ] Crear un repositorio público/privado en GitHub con una app pequeñita (ej. "Todo App" o "Landing Page") que tenga bugs visuales obvios.

### Fase 2: Conexión Jira -> GitHub
- [ ] En GitHub: Crear un Personal Access Token (PAT) con permisos de `repo`.
- [ ] En Jira: Configurar una regla de Automatización (Automation Rules) para que cuando se cree un ticket de tipo `Bug`, haga una petición HTTP Webhook (POST) a `https://api.github.com/repos/TU_USUARIO/TU_REPO/dispatches` mandando el Payload con el título y descripción.

### Fase 3: Scripting del Agente
- [ ] Crear `.github/workflows/auto-resolve.yml` que escuche el `repository_dispatch`.
- [ ] Implementar un script en Node.js o Python (dentro del repo) que recoja el payload del issue y llame a la LLM (ej. Gemini o Claude API).
- [ ] El script sobreescribe el archivo con el error en tu app de prueba localmente en el runner.

### Fase 4: Cierre del PR
- [ ] Configurar el Action para que haga commit de los cambios (usando `git config user.name "AI Agent"`).
- [ ] Crear el Pull Request usando GitHub CLI (`gh pr create`). (Extra: Usar un webhook de vuelta a Jira para cambiar el ticket a `Review`).

---
*(Nota: Este documento está vivo e iremos marcando los pasos conforme avancemos en tu setup local)*
