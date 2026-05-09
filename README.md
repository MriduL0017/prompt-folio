# PromptFolio

PromptFolio is a microservices-lite architecture designed to serve as an interactive, AI-powered professional portfolio. It uses Google's Gemini API to chat with users about the candidate's professional experience, ensuring all responses are strictly grounded in the provided JSON data to prevent hallucinations.

## 🏗️ Architecture Overview

This project is built using a "Scale-to-Zero" serverless architecture deployed on Google Cloud Run to eliminate infrastructure costs while maintaining a multi-language microservice environment.

1. **Frontend Client (React / Vite):** A lightweight "thin client" styled as a sleek terminal UI. Captures user input and renders markdown-formatted AI responses.
2. **AI Gateway (Python / FastAPI):** The orchestrator. Fetches the system of record data, dynamically constructs context-aware system prompts, and interfaces with the Google Gemini API to serve responses.
3. **Core Data Service (Java / Spring Boot 3):** The system of record. Serves highly structured JSON metadata containing professional experience, enterprise refactoring case studies, and system architecture focus. *(Compiled natively via GraalVM for <100ms cold starts).*

## 🚀 Tech Stack
* **Frontend:** React, Vite, Tailwind/CSS
* **AI Orchestration:** Python, FastAPI, Google Generative AI (Gemini)
* **Data Layer:** Java, Spring Boot, GraalVM
* **Deployment:** Google Cloud Run (Docker), Vercel

## 💻 Local Setup

### Prerequisites
- Docker and Docker Compose (recommended)
- OR: Java 17, Node.js/npm, Python 3.11+

### Running with Docker Compose (Easiest)

1. Navigate to the `promptfolio-ai-gateway` directory and copy the `.env.example` file to `.env`:
   ```bash
   cp promptfolio-ai-gateway/.env.example promptfolio-ai-gateway/.env
   ```
2. Add your `GEMINI_API_KEY` to the `.env` file.
3. From the root of the project, run:
   ```bash
   docker compose up --build
   ```
4. Access the application at `http://localhost:5173`.

### Running Locally (Without Docker)

You can run each service individually in its own terminal.

**1. Start the Java Data Service:**
```bash
cd promptfolio-data-service
mvn spring-boot:run
```
*(Runs on `http://localhost:8080`)*

**2. Start the Python AI Gateway:**
```bash
cd promptfolio-ai-gateway
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```
*(Runs on `http://localhost:8000`)*

**3. Start the React Frontend:**
```bash
cd promptfolio-ui
npm install
npm run dev
```
*(Runs on `http://localhost:5173`)*

## Customizing Your Portfolio

To update the AI with your own experience, edit the `src/main/resources/profile_data.json` file inside the `promptfolio-data-service`. The AI Gateway will automatically fetch this new data on the next request.

You can also update your photo, name, and links in the `promptfolio-ui/src/App.jsx` file.

## 🧠 Why this Architecture?
As a backend-focused engineer, I built PromptFolio to demonstrate how to handle inter-service communication securely. Instead of exposing personal data in a public repository, the actual profile JSON is injected as a secure environment variable/secret into the backend runtime, proving an understanding of enterprise secret management and decoupled data pipelines.