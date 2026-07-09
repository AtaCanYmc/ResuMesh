# Changelog

## [1.6.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.5.0...v1.6.0) (2026-07-09)


### Features

* add SEO routes for sitemap and robots.txt; implement proxy configuration in Vite ([2978b93](https://github.com/AtaCanYmc/ResuMesh/commit/2978b931b3007d8fdec6d933939f492bf42263ab))
* add Storybook configuration and components; include mock data seeding and update requirements ([d563d3e](https://github.com/AtaCanYmc/ResuMesh/commit/d563d3ecacb310584a2accfa7e3e1d767f3f5713))
* add Storybook configuration and components; include mock data seeding and update requirements ([b93a358](https://github.com/AtaCanYmc/ResuMesh/commit/b93a35843ff9dfb15ea1e789a13e244f0ded2659))
* enhance security by sanitizing CV markdown input and validating username formats; update Docker configuration for unprivileged user ([9429f50](https://github.com/AtaCanYmc/ResuMesh/commit/9429f50febda302c674691ef935613b0446e33f2))
* enhance SEO metadata and structured data for improved search visibility; update title and description ([4255e27](https://github.com/AtaCanYmc/ResuMesh/commit/4255e27c0d94ab3a8f630e68eb58908c448c0753))
* implement update and delete functionality for articles, certificates, experiences, and projects; add corresponding update schemas ([db707dc](https://github.com/AtaCanYmc/ResuMesh/commit/db707dc6d5685675d92daeee15fae21d7355dd8a))

## [1.5.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.4.0...v1.5.0) (2026-07-09)


### Features

* add admin layout and pages for managing projects, articles, experiences, and system logs ([e78e0d6](https://github.com/AtaCanYmc/ResuMesh/commit/e78e0d61b840eddc9e87b2f49449e3fe50bc6210))
* add admin pages for managing CVs, articles, certificates, and experiences with LinkedIn import functionality ([7ba032b](https://github.com/AtaCanYmc/ResuMesh/commit/7ba032b40aac5e0762bd5a79c1e1003fcf90b354))
* add CareerTimeline and RecentArticles components, enhance Home layout with new sections ([00a11a2](https://github.com/AtaCanYmc/ResuMesh/commit/00a11a23b9d42c8abedd885dedc0e868a6a2a981))
* add data refresh functionality to AdminOverview; enhance AdminPageHeader with customizable action icon and improve Modal styling ([0102daf](https://github.com/AtaCanYmc/ResuMesh/commit/0102daf0c66188fac949728f617fd63374978373))
* add Footer component and update MainLayout to include it; enhance content configuration with footer details ([d43111d](https://github.com/AtaCanYmc/ResuMesh/commit/d43111d3d79df8065ba9c43625c19a85dedab87a))
* add form modals for managing articles, certificates, experiences, and projects; implement edit and add functionality with validation ([ae9547b](https://github.com/AtaCanYmc/ResuMesh/commit/ae9547b97df4cefbac3c13eea0a31a5f00495f64))
* add HERO_DATA, SOCIAL_LINKS, METRICS_DATA, FEATURED_PROJECTS, and EXPERIENCES_DATA; enhance MainLayout with collapsible sidebar ([dae3605](https://github.com/AtaCanYmc/ResuMesh/commit/dae3605db43ff307a15149ddec2a5eee0f0bf263))
* add multilingual support for content configuration; update HeroSection and Home components to use dynamic language loading ([1fdabd2](https://github.com/AtaCanYmc/ResuMesh/commit/1fdabd28d90f3bbce0cac60c4ff707a80e084976))
* add multilingual support to various components; update text to use translation hooks for dynamic language rendering ([c952143](https://github.com/AtaCanYmc/ResuMesh/commit/c952143c73d7c26ef8f99ddcdc942626ad71c506))
* add resumes directory to .gitignore to prevent tracking of resume files ([e0ab779](https://github.com/AtaCanYmc/ResuMesh/commit/e0ab77977d78900906c5c2e4ebe6e3bd26ad369f))
* enhance AdminAiCv and HeroSection components with dynamic content from configuration; update localization and add avatar support ([b83248a](https://github.com/AtaCanYmc/ResuMesh/commit/b83248a025d20ae440d55c243647ad1b73199272))
* enhance authentication flow with rate limiting and role-based access control ([3f82a9b](https://github.com/AtaCanYmc/ResuMesh/commit/3f82a9b5f2770ac1bda08542af49c9be8809097e))
* enhance Footer component with expandable About section and transition animations ([e82d0da](https://github.com/AtaCanYmc/ResuMesh/commit/e82d0da57dff39e4f8b1a6b8845e6506fb8fc00a))
* enhance InfiniteMarquee component with improved structure and accessibility ([d7e0f78](https://github.com/AtaCanYmc/ResuMesh/commit/d7e0f78e78da456c589b78c8d231cac56c2b6137))
* enhance UI with EmptyState component and improve layout responsiveness ([4a6fa66](https://github.com/AtaCanYmc/ResuMesh/commit/4a6fa6679069578228a13345ce968926c26a0a07))
* enhance UI with SpotlightCard and MagneticButton components, add InfiniteMarquee for tech stack display ([e10575b](https://github.com/AtaCanYmc/ResuMesh/commit/e10575b8681e6a17ad9c26466cccd292e6ebbbe5))
* implement code-splitting for home components; enhance performance with lazy loading and improve accessibility for reduced motion preferences ([82e7e74](https://github.com/AtaCanYmc/ResuMesh/commit/82e7e74c52525d180163cec26cf92c75ce7e225a))
* implement internationalization with i18next and update UI text for localization ([fb77636](https://github.com/AtaCanYmc/ResuMesh/commit/fb776369b51df9e2ba6c657231f4021d3608bdb8))
* implement scraper service interface and exception handling ([626303d](https://github.com/AtaCanYmc/ResuMesh/commit/626303d5bcc7964024a59d15b0c5782f2ebcdbcd))
* refactor components to use hooks for data fetching; add skeleton loaders for improved UX ([a5d535c](https://github.com/AtaCanYmc/ResuMesh/commit/a5d535c32da65c9156cfc76205a8baf758d4bf71))
* refactor GitHub repository fetching to use GitHubScraperService ([2830cc7](https://github.com/AtaCanYmc/ResuMesh/commit/2830cc7950780da3120e9814b2f63d82b4bede4a))
* update default admin password in seed_admin.py and modify greeting text in translation.json for improved localization ([0c7c0c0](https://github.com/AtaCanYmc/ResuMesh/commit/0c7c0c0fefa17700fd833097c73e96b8bbbba775))
* update footer email address and enhance FeaturedProjects section with improved layout ([f91a7f2](https://github.com/AtaCanYmc/ResuMesh/commit/f91a7f2a1193c5a00cab0eeb7a5202d4458c28d3))
* update README with installation instructions and project overview enhancements ([ddc1d7b](https://github.com/AtaCanYmc/ResuMesh/commit/ddc1d7b74027de0dc46457edeff330f2e71400b3))
* update useProjects and useArticles hooks to accept a limit parameter; modify FeaturedProjects and RecentArticles components to fetch a limited number of items ([634da74](https://github.com/AtaCanYmc/ResuMesh/commit/634da74144348edf1ca99588f11a4f7a7a6749e1))


### Bug Fixes

* update import path for GitHubScraperService in test_ingestion.py ([bd24aa9](https://github.com/AtaCanYmc/ResuMesh/commit/bd24aa97e8815652f571edb862bfef89c10af46c))

## [1.4.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.3.0...v1.4.0) (2026-07-06)


### Features

* add SEO component and integrate it into multiple pages for improved metadata handling ([4c0ff5c](https://github.com/AtaCanYmc/ResuMesh/commit/4c0ff5cc803705975e3231fb24257d7769362823))
* add theme toggle functionality and implement focus trap for mobile menu ([fc1cce7](https://github.com/AtaCanYmc/ResuMesh/commit/fc1cce70d589f754e204977ca6d74e45ccd90a86))
* enhance ContentCard with skeleton loading and improve UI interactions ([58fd671](https://github.com/AtaCanYmc/ResuMesh/commit/58fd6719564f0b66c676a326bb06808c477014ca))
* restructure Home component and add FeaturedProjects and QuickMetrics components ([64b0609](https://github.com/AtaCanYmc/ResuMesh/commit/64b0609df33d24e8d057d3b67681fae3257d460a))

## [1.3.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.2.0...v1.3.0) (2026-07-06)


### Features

* add admin endpoint to refresh data from configured platforms ([b2bab30](https://github.com/AtaCanYmc/ResuMesh/commit/b2bab30b1cb6195cdaee9ffb9c42a73e76b71044))
* add articles, experiences, and certificates endpoints ([98e2476](https://github.com/AtaCanYmc/ResuMesh/commit/98e247631b163fd783fe751165130807b985a720))
* add GeneratedCV model and database schema for AI CV generation; update README with migration instructions ([baefd09](https://github.com/AtaCanYmc/ResuMesh/commit/baefd096ceb29313697edc79b0ae2d0c38b731ee))
* add LinkedIn PDF import functionality and sorting options in Projects component ([31ab037](https://github.com/AtaCanYmc/ResuMesh/commit/31ab03789cd02652b69d36184d9991cf3cb16dda))
* add LinkedIn PDF import functionality to admin panel; implement PDF parsing and structured data storage ([6fcd83a](https://github.com/AtaCanYmc/ResuMesh/commit/6fcd83a751ec31f539ee1549303ce234d4b04ecd))
* add modal functionality for article and project details in Articles and Projects components ([6b5b360](https://github.com/AtaCanYmc/ResuMesh/commit/6b5b360e195bd1b966e0894531db34039a0c3f5f))
* add scraping services for GitHub, Medium, and Dev.to; include example scripts and update README ([749e17e](https://github.com/AtaCanYmc/ResuMesh/commit/749e17eeaba27d3fdbbcc3c6a61cd32eff0c3c38))
* implement form validation and error handling in AdminLogin component ([66c1c62](https://github.com/AtaCanYmc/ResuMesh/commit/66c1c62a5ddcd7b09b7163555faa521cb79ad510))
* implement lazy loading for pages and add a page loader component ([07ec788](https://github.com/AtaCanYmc/ResuMesh/commit/07ec7889a4c954837c23fe6e0c53cb8681b80301))
* load environment variables in scraper modules for improved configuration ([a7c23a2](https://github.com/AtaCanYmc/ResuMesh/commit/a7c23a269289a49a8b7ad1919a0b0f11cd831394))


### Bug Fixes

* add additional localhost origins for CORS configuration ([692a7be](https://github.com/AtaCanYmc/ResuMesh/commit/692a7be4c937c4f3195d6b24ffd78cf11b7d49b2))
* add trailing slashes to API endpoint URLs in Articles, Certificates, Experiences, Projects, and SearchBar components ([a6c51c1](https://github.com/AtaCanYmc/ResuMesh/commit/a6c51c12ae07f7c0713b185dd13c834f7793aebb))
* downgrade bcrypt version to 4.0.1 for compatibility ([3716950](https://github.com/AtaCanYmc/ResuMesh/commit/37169506569698903e4ad0cdf01ca6123d59a9b3))
* handle missing experiences and certificates in structured data ([0ecb75b](https://github.com/AtaCanYmc/ResuMesh/commit/0ecb75bec146c42072e735a397aab7d8d5ffcf71))
* make issuing_organization optional in CertificateBase model ([40c2869](https://github.com/AtaCanYmc/ResuMesh/commit/40c28695d327e20ded3bbba85b937ac2af3b4b1f))
* standardize platform and reading time property names in Articles component ([df9f9d8](https://github.com/AtaCanYmc/ResuMesh/commit/df9f9d833babc8791650201bf081aa7747bb5ed6))
* update API endpoints to include versioning in Articles, Certificates, and Experiences components ([30b4af1](https://github.com/AtaCanYmc/ResuMesh/commit/30b4af120f8cf504484794ddf31c13e61ede6fd0))
* update docker-compose to include env_file and remove sensitive environment variables ([7c563d9](https://github.com/AtaCanYmc/ResuMesh/commit/7c563d9eaf7c7e2d517a0beefd0bd673f8921a5f))
* update import for AsyncClientOptions in supabase_provider.py ([f736acc](https://github.com/AtaCanYmc/ResuMesh/commit/f736acc81499b3a65a52e14ba7bb99ea21fc7953))
* update import for AsyncClientOptions in supabase_provider.py ([2b357c0](https://github.com/AtaCanYmc/ResuMesh/commit/2b357c03a633318e23a7c2b741b043b64d3beeb2))
* update query ordering to use created_at instead of timestamp ([bace5db](https://github.com/AtaCanYmc/ResuMesh/commit/bace5db6aeb7d5f9ddd6facba4caf563c4a76bcd))

## [1.2.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.1.0...v1.2.0) (2026-07-05)


### Features

* add Docker run configuration for docker-compose deployment ([49884fd](https://github.com/AtaCanYmc/ResuMesh/commit/49884fdb7f0da699407bfbe47ebdbedb09bb0bbd))
* add profiles for PostgreSQL and MongoDB services in docker-compose.yml ([6637aae](https://github.com/AtaCanYmc/ResuMesh/commit/6637aaef01ec38b331da0bd232650a32372756c3))
* enhance admin dashboard with AI CV generator and log management; add articles, certificates, and experiences sections with filtering ([521aac1](https://github.com/AtaCanYmc/ResuMesh/commit/521aac1de77e24b4a958e9e1d8cd53ac8a428e6f))
* implement Supabase client for asynchronous operations and add CRUD methods for projects, articles, experiences, and certificates ([d845792](https://github.com/AtaCanYmc/ResuMesh/commit/d8457929b6bf431ebbd5a3547d0689483265015a))
* restructure app layout and add new pages for Home, Experiences, Projects, Articles, and Certificates ([9d5f273](https://github.com/AtaCanYmc/ResuMesh/commit/9d5f273203eacc3da2123904ce775586119c22a7))
* update README to include Docker Compose profiles for database configurations ([795e419](https://github.com/AtaCanYmc/ResuMesh/commit/795e419d9942d623fef50626e0cb0fc64bd36429))
* update README with project structure, local development setup, and contribution guidelines ([8ef646d](https://github.com/AtaCanYmc/ResuMesh/commit/8ef646d9c1b7c28bf171d9eaa7dbd7b14fe37bb1))


### Bug Fixes

* downgrade langchain-community package version to 0.2.12 in requirements.txt ([c672ce1](https://github.com/AtaCanYmc/ResuMesh/commit/c672ce1f6c37a6514bc0772d7587bde0b1f6980c))
* replace Github icon with Code icon in Projects component ([fb987b7](https://github.com/AtaCanYmc/ResuMesh/commit/fb987b75fa389dcfeb8e723d6d7008368e809a59))
* update Docker commands in README and remove version from docker-compose.yml ([2e56001](https://github.com/AtaCanYmc/ResuMesh/commit/2e5600144200128ddb20dc89e2d36272b82ae2bd))
* update langchain package versions in requirements.txt ([6465efb](https://github.com/AtaCanYmc/ResuMesh/commit/6465efbe790e7f916a496b117f9286fd435682b8))
* update postgres integration test to use synchronous engine and configure app's database session ([8b3e37f](https://github.com/AtaCanYmc/ResuMesh/commit/8b3e37fd75f20bb8bbb37054a6fae05335912ab4))
* update postgres integration test to use synchronous engine for table creation ([da9ed85](https://github.com/AtaCanYmc/ResuMesh/commit/da9ed8516dda06b3cbc715a4b987093832b291b9))
* update supabase package version in requirements.txt to 2.5.1 ([e8b5efd](https://github.com/AtaCanYmc/ResuMesh/commit/e8b5efd760200fad79b32f9d5837b618835411ff))

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
