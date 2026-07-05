# Changelog

## [1.1.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.0.0...v1.1.0) (2026-07-05)


### Features

* enhance search functionality and improve PostgreSQL container setup in tests ([d74d58f](https://github.com/AtaCanYmc/ResuMesh/commit/d74d58fe107e1274fdf88808a5679e53de612bfa))
* implement admin login and dashboard components with authentication context ([01d12e5](https://github.com/AtaCanYmc/ResuMesh/commit/01d12e5e957fe4fd27ee4e69d82e0b72d4d602e1))
* refactor database dependency management and repository interfaces ([c323ba7](https://github.com/AtaCanYmc/ResuMesh/commit/c323ba75277f57ecf5f24a2daf3dba9ee47dbaa9))
* refactor database repository interfaces and implement Alembic configuration ([b0e8b4f](https://github.com/AtaCanYmc/ResuMesh/commit/b0e8b4fe3448f455f36ba78f63b3c39d49de0880))
* refactor repositories and update CV generation service to use new interfaces ([082b869](https://github.com/AtaCanYmc/ResuMesh/commit/082b8697d95b1cb4e88b8231b32c65132ff8295d))

## 1.0.0 (2026-07-05)


### Features

* add admin authentication with JWT, implement admin log management, and configure rate limiting ([6e1550a](https://github.com/AtaCanYmc/ResuMesh/commit/6e1550a4ae7da6c92b3412a8898526a5f55b8d5d))
* add article and certificate models, update project structure, and implement ingestion service for GitHub and Dev.to ([d88a27a](https://github.com/AtaCanYmc/ResuMesh/commit/d88a27a7ab5a8b2d2e15f53f30dd8913381868b3))
* add contributing guidelines and update README for clarity ([e78801a](https://github.com/AtaCanYmc/ResuMesh/commit/e78801acd081b108a69aa05215efc632aba23375))
* add Docker configuration for backend, frontend, and database services ([9f45eb2](https://github.com/AtaCanYmc/ResuMesh/commit/9f45eb2e1c1830042004f4392296f6fe6bda79e2))
* add environment variable for backend API URL and update SearchBar to use it ([09e1df3](https://github.com/AtaCanYmc/ResuMesh/commit/09e1df39612a8c65599d55672e03210f6fbd5227))
* add Flake8 configuration for code style enforcement ([5c82105](https://github.com/AtaCanYmc/ResuMesh/commit/5c82105f9051dadfd25e1899181676c8a64549cb))
* add global search functionality across projects, articles, experiences, and certificates with corresponding API endpoint ([8872ef2](https://github.com/AtaCanYmc/ResuMesh/commit/8872ef2dbb695b8a3cd682f53c85e696b128fd58))
* add logging functionality with MongoDB and PostgreSQL support, create admin log management endpoints, and update ingestion service for enhanced error handling ([24017c7](https://github.com/AtaCanYmc/ResuMesh/commit/24017c7d448a8ad74a4d01363e197112f69bda06))
* add testing setup with pytest, create mock provider for projects, articles, experiences, and certificates, and implement CI workflow for automated testing ([ca04bdd](https://github.com/AtaCanYmc/ResuMesh/commit/ca04bdd584d8ff5d40528d2b7901fb0b136aef7b))
* change release type from node to simple in release-please configuration ([f5d67f8](https://github.com/AtaCanYmc/ResuMesh/commit/f5d67f8b9c16161bea54ea5cde9d79e3a1f73f01))
* configure Dependabot for automated dependency updates and add release-please workflow ([91c0d6a](https://github.com/AtaCanYmc/ResuMesh/commit/91c0d6abbf98642c3f7f0c02e16465616466a3f2))
* implement admin dashboard with log fetching and update API routes ([6af72d8](https://github.com/AtaCanYmc/ResuMesh/commit/6af72d8a4f6689c6d250418af04d9b618723450f))
* implement CV generation endpoint with LLM integration and job description scraping ([56cf848](https://github.com/AtaCanYmc/ResuMesh/commit/56cf848c0393a17456af870e7e6e70912b5acd26))
* implement global search functionality with enhanced response structure and support for multiple item types ([2caf74e](https://github.com/AtaCanYmc/ResuMesh/commit/2caf74e73655facd7fc69e7468df406ee64c3e4b))
* implement Jinja2 template service for CV generation and refactor prompt handling in providers ([78d6415](https://github.com/AtaCanYmc/ResuMesh/commit/78d6415805bbd82114e508089df2dedfca176acd))
* migrate to Tailwind CSS with Vite integration and update dependencies ([0bcd5ec](https://github.com/AtaCanYmc/ResuMesh/commit/0bcd5ec7ec1de441cc6478b4e9e398f0b26fcb4c))
* rename StackEcho to ResuMesh across the application ([f83a805](https://github.com/AtaCanYmc/ResuMesh/commit/f83a805c39a736de4b425e440eb19cb8ce22c126))
* update CI configuration for backend directory structure and testing ([b235498](https://github.com/AtaCanYmc/ResuMesh/commit/b235498d0465a0c2066b62cfaf19d01fe33da531))
* update test configuration to set PYTHONPATH for pytest execution ([66f9723](https://github.com/AtaCanYmc/ResuMesh/commit/66f9723c4e50c5e611fba60cdf5b3c92e140440d))


### Bug Fixes

* correct PostgreSQL connection string variable name in .env.example ([8b2a56b](https://github.com/AtaCanYmc/ResuMesh/commit/8b2a56bf043687b30c50a440aaac0958a6981e48))
