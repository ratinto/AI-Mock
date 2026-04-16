# AntriView AI

Premium mock interview preparation web app (portfolio/academic project).

## Features
- **Authentication (Demo)**:
  - Sign up + sign in using email (demo flow).
  - Session is stored in `sessionStorage` and user data in `localStorage`.
  - Code: `src/application/useCases/auth.ts`, `src/infrastructure/repositories/*`.
- **Dynamic Dashboard**:
  - Overview of tracks (DSA/HR/Dev), progress %, and quick access to features.
  - Sidebar navigation (Overview, Persona Lab, Resume AI, History, About Us, Settings).
  - Code: `src/components/Dashboard.tsx`.
- **Interview Flow (End-to-end)**:
  - Setup interview parameters → timed mock interview → report.
  - Session completion updates history + stats and reflects back on the dashboard.
  - Code: `src/components/InterviewSetup.tsx`, `src/components/InterviewRoom.tsx`, `src/components/Report.tsx`,
    and `src/application/useCases/sessions.ts`.
- **Webcam + Voice UX (Browser APIs)**:
  - Webcam preview uses MediaDevices (`getUserMedia`) in the interview room.
  - A Web Speech API helper exists for future STT (`src/lib/speech.ts`); current transcript is simulated in UI.
- **AI Persona Selection (UI)**:
  - Choose interviewer style/persona to simulate different interview dynamics (UI-driven).
  - Code: `src/components/PersonaLab.tsx`.
- **Resume AI Analyzer (Demo)**:
  - File upload + analyze action is validated (no analysis without an uploaded resume).
  - Insights preview is shown only after analysis completes (demo content).
  - Code: `src/components/ResumeAI.tsx`.
- **History + Skill Analytics**:
  - Session history feed, streak display, and skill breakdown bars.
  - Code: `src/components/History.tsx`, user model `src/domain/user.ts`.
- **Settings (Modular UI)**:
  - Modular “Account Settings” UI with validation, dirty-state, reset, and save.
  - Code: `src/components/Profile.tsx`, `src/application/useCases/userProfile.ts`.
- **About Us Page**:
  - Portfolio-ready About page accessible from navbar (home) and dashboard sidebar.
  - Code: `src/components/AboutUs.tsx`, `src/components/Navbar.tsx`, `src/App.tsx`.
- **Premium UI / Glassmorphism**:
  - CSS variables, gradients, and “glass” cards for a modern dashboard aesthetic.
  - Code: `src/index.css`, `src/App.css`.

## Tech Stack
- React + TypeScript
- Vite
- Lucide React
- CSS Variables (Glassmorphism)
- Browser Storage (localStorage/sessionStorage)

## SDSE / System Design Concepts Used
- **Layered / Clean Architecture (frontend-friendly)**:
  - **Domain**: core types + ports (`src/domain/*`)
  - **Application**: use cases (`src/application/useCases/*`)
  - **Infrastructure**: repository implementations (`src/infrastructure/*`)
  - **Presentation**: UI (`src/components/*`)
- **Separation of Concerns (SoC)**:
  - UI components call use cases, use cases depend on ports, repositories handle storage.
- **Dependency Injection (DI)**:
  - Services are composed once in `src/app/services.ts` and provided via React Context (`src/app/ServicesProvider.tsx`).
- **Repository Pattern**:
  - `UserRepository` / `SessionRepository` are abstractions; browser storage repositories implement them.
- **SOLID (where it fits)**:
  - SRP: small use cases (`auth`, `sessions`, `userProfile`)
  - DIP: application layer depends on interfaces (ports), not concrete storage
  - ISP: small focused ports (repositories)
- **DRY + Reuse**:
  - Shared domain models, repositories, and modular UI patterns (e.g., settings fields/sections).
- **KISS**:
  - Simple SPA navigation and local persistence to keep the project easy to run and evaluate.
- **Caching (infrastructure-ready)**:
  - Simple TTL cache utility + hook to support future API-backed data (`src/lib/cache.ts`, `src/hooks/useApiCache.ts`).
- **Security notes (demo vs production)**:
  - No API keys in frontend. `src/lib/gemini.ts` is intentionally a placeholder that requires a backend/proxy.
  - Production version should use server auth + token sessions and avoid storing sensitive secrets in browser storage.

## Quickstart
```bash
npm install
npm run dev
```

## Project Structure (high level)
- `src/components/`: UI pages/components (Dashboard, InterviewRoom, ResumeAI, Profile, etc.)
- `src/application/useCases/`: application logic (auth, sessions, profile)
- `src/domain/`: core types + ports (repositories)
- `src/infrastructure/`: localStorage/sessionStorage repository implementations
- `docs/`: LaTeX system design document
- `diagrams/`: UML/ER diagrams used in documentation

## Documentation
- **System Design Document (LaTeX)**: `docs/system_design_document.tex`
- **Diagrams**: `diagrams/` (Use Case, Class, Activity, Sequence, ER)

---
© 2026 AntriView AI
