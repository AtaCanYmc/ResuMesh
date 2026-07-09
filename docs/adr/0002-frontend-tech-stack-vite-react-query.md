# 2. Frontend Tech Stack: Vite and React Query

Date: 2026-07-09

## Status

Accepted

## Context

The ResuMesh frontend requires a modern, fast, and scalable technology stack. We needed to choose a build tool and a data-fetching strategy. The frontend frequently interacts with the backend API to fetch dynamic content like projects, articles, and logs.

## Decision

We chose **React** built with **Vite** as our core frontend framework.
- **Vite** provides an extremely fast development server with instant Hot Module Replacement (HMR) and optimized production builds.
- For data fetching, we chose **React Query (@tanstack/react-query)** instead of standard `useEffect` hooks or Redux. React Query handles caching, background updates, loading states, and error handling out-of-the-box.

## Consequences

- **Pros:** Lightning-fast developer experience, simplified state management for server data, robust caching out of the box.
- **Cons:** Additional learning curve for contributors who are only familiar with traditional Redux or manual `fetch`/`useEffect` patterns.
