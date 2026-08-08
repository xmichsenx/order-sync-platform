# Order Sync Platform

Fault-tolerant order synchronization platform with retries, idempotency, replay and operational visibility.

## Stack

- Backend: Python, FastAPI, uv, pytest, Ruff
- Frontend: TypeScript, React, Vite, pnpm, Vitest, ESLint

## Run locally

Backend:

```sh
cd backend
uv sync
uv run uvicorn app.main:app --reload
```

Frontend:

```sh
cd frontend
pnpm install
pnpm dev
```

## Test

Backend:

```sh
cd backend
uv run ruff check .
uv run pytest
```

Frontend:

```sh
cd frontend
pnpm lint
pnpm typecheck
pnpm test
```
