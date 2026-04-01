# Auto-Resolve AI Agent (MVP)

A fully autonomous AI agent that resolves bugs reported in Jira directly within a GitHub Actions pipeline. The objective of this MVP is to serve as a **Proof of Concept (PoC)** to demonstrate AI-driven repository self-healing for B2B sales and portfolio demonstrations.

## 📌 Project Objective

Rebuild the "Auto-Resolve Bug" automation flow from scratch. This project demonstrates how an AI agent can automatically respond to a bug ticket, diagnose the issue in the codebase, write the fix, and submit a Pull Request—all without human intervention during the resolution phase.

## 🏗️ Architecture

The MVP encompasses the following architecture:

1. **Trigger Base:** Webhook originating from Jira Cloud towards GitHub via a `repository_dispatch` event.
2. **The "Dummy App":** A React/Vite application (included in this repository) acting as the "patient" that contains intentional bugs for the agent to fix.
3. **Orchestrator (Auto-Resolve Action):** A GitHub Action that:
   - Parses the Jira `TICKET_ID` from the webhook payload.
   - Creates a new branch (e.g., `fix/TICKET_ID`) from `main`.
   - Executes the agent script to interact with the LLM.
4. **LLM Provider:** Generative AI models like **Gemini** or **Claude 3.5 Sonnet** are used to analyze the code and write the actual fix.

## 🚀 Execution Flow / Demo Step-by-Step

1. **Bug Tracking**: A `Bug` ticket is created or transitioned to `In Progress` in Jira.
2. **Webhook Dispatch**: Jira automatically fires a Webhook to the GitHub repository.
3. **AI Agent Initialization**: The GitHub Action `.github/workflows/auto-resolve.yml` runs, checking out the code and setting up the environment.
4. **Code Correction**: The Node.js/Python agent script queries the LLM with the issue description, and overwrites the faulty files locally on the GitHub Action runner.
5. **Pull Request Creation**: The agent commits the changes as `"AI Agent"` and creates a final Pull Request via GitHub CLI (`gh pr create`), ready for human review.

---
*For more detailed requirements and planning, refer to the [PRD - Auto-Resolve AI Agent (MVP)](./PRD%20-%20Auto-Resolve%20AI%20Agent%20(MVP).md) document.*
