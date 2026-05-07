# PromptFolio

PromptFolio is a microservices-lite architecture designed to serve as an interactive, AI-powered professional portfolio. It uses Google's Gemini API to chat with users about the candidate's professional experience, ensuring all responses are strictly grounded in the provided JSON data to prevent hallucinations.

## Architecture

The project consists of three decoupled layers:

1. **Core Data Service (`promptfolio-data-service`)**:
   - Built with Java, Spring Boot 3, and GraalVM.
   - Acts as the system of record, serving structured JSON containing professional metadata (`profile_data.json`).
2. **AI Gateway (`promptfolio-ai-gateway`)**:
   - Built with Python and FastAPI.
   - Orchestrator layer that fetches data from the Java service, constructs a system prompt, and interfaces with the Google Gemini API.
3. **Frontend Client (`promptfolio-ui`)**:
   - Built with React and Vite.
   - A minimalist, premium text-based terminal UI that captures user input and displays the AI's response.

## Getting Started

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
