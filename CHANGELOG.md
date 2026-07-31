# Changelog

## [1.12.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.11.0...v1.12.0) (2026-07-31)


### Features

* add 'Created At' column to AdminProjects table for better project tracking ([4c8c679](https://github.com/AtaCanYmc/ResuMesh/commit/4c8c6790454fe1b690c2abada74a73f7e21c73e9))
* add admin management for packages, posts, and videos; update routing and UI components ([7c4803c](https://github.com/AtaCanYmc/ResuMesh/commit/7c4803c4fdcf48cd6ea9a350e0d362de6f7cd2d8))
* add admin settings page with toggle options for portfolio visib… ([1ed751d](https://github.com/AtaCanYmc/ResuMesh/commit/1ed751d1a8c0cd240e369dead649681a873de6b2))
* add admin settings page with toggle options for portfolio visibility ([773e4fc](https://github.com/AtaCanYmc/ResuMesh/commit/773e4fc8ae26a312ad1f22282792e374d717eb0b))
* add AI provider configuration to app settings with support for OpenAI, Groq, and Ollama ([bebc518](https://github.com/AtaCanYmc/ResuMesh/commit/bebc518a7e710a0e7f22848af42b4cf6ada42ca2))
* add caching headers for app settings and update visibility checks in certificates, experiences, and projects components ([eeae200](https://github.com/AtaCanYmc/ResuMesh/commit/eeae20061877da893ef305f82532c86a9667264b))
* add endpoint to retrieve avatar URL and update image source logic ([3d967e1](https://github.com/AtaCanYmc/ResuMesh/commit/3d967e19751f3a29d26e749003b5055a93512e5f))
* add environment configuration and new interfaces for app settings ([6c4b5f1](https://github.com/AtaCanYmc/ResuMesh/commit/6c4b5f1eeda1aafd9730aa5717c39743eb6405bb))
* add github_url handling in project data processing ([d839e0c](https://github.com/AtaCanYmc/ResuMesh/commit/d839e0c73ad3c685b6e995efc5bd97a296f86ccd))
* add name and title properties to ProjectBase with automatic synchronization and additional properties for stars, watchers, forks, and url ([c2efb5e](https://github.com/AtaCanYmc/ResuMesh/commit/c2efb5e72f13fdc65c39d345778f8ffc2efe3cd0))
* add new models for Package, Post, and Video; update Project model ([e92c85e](https://github.com/AtaCanYmc/ResuMesh/commit/e92c85e6eca8b5e90714ec322a5518c1e49c4b8f))
* add new models for Package, Post, and Video; update Project model ([bdf3180](https://github.com/AtaCanYmc/ResuMesh/commit/bdf3180888bec6e8067b0a3b6a5c1aa005cdcc02))
* add Packages page with filtering and sorting functionality ([ac3cad9](https://github.com/AtaCanYmc/ResuMesh/commit/ac3cad92cb2311f95d3b5040ab1e40a9b5c4e7e8))
* add pre-commit configuration for code quality checks ([5c499eb](https://github.com/AtaCanYmc/ResuMesh/commit/5c499ebf266de946aa1415c87baffa0f0de523e1))
* add sections database table, model, alembic migration, DTOs, repository, and API routers ([6942312](https://github.com/AtaCanYmc/ResuMesh/commit/6942312c660a0a4219cea1996129f63060bb8f07))
* add social_links database table and API endpoints ([23cde69](https://github.com/AtaCanYmc/ResuMesh/commit/23cde694dca865c657dbfe32ffaf782a2b58347c))
* add social_links database table and API endpoints ([5f95107](https://github.com/AtaCanYmc/ResuMesh/commit/5f9510789e56a02f5b70ca796bcdf86ae8eaac85))
* add SQLAlchemy repositories for Package, Post, and Video; update requirements and ArticlePlatform enum ([1138c96](https://github.com/AtaCanYmc/ResuMesh/commit/1138c96f2e3dfc73395db11ba8531904b4bddccc))
* add SQLAlchemy repositories for packages, posts, and videos; update main application routes ([3464309](https://github.com/AtaCanYmc/ResuMesh/commit/346430921be72f1b822018a06de60ab5459fcf42))
* add stars and forks display to FeaturedProjects and ensure name is populated from title in project responses ([92587f2](https://github.com/AtaCanYmc/ResuMesh/commit/92587f216d1f92b89bc508b368ac58c170180098))
* add stars, watchers, forks, and url properties to ProjectBase with automatic synchronization ([8b20313](https://github.com/AtaCanYmc/ResuMesh/commit/8b2031385afaee0258a8ee81b94b61cb651fe03d))
* add Supabase migration SQL and update init_schema.sql for social_links and sections tables ([3706c54](https://github.com/AtaCanYmc/ResuMesh/commit/3706c5407c8f6d2985560178f1ced7a26c84b24f))
* add Supabase Storage management page and API endpoints in admin workspace ([6db32b7](https://github.com/AtaCanYmc/ResuMesh/commit/6db32b74474543305780df2e9ec1183c2b2cb71b))
* add support for sections field to accept both dict and list types in app settings model ([1d75547](https://github.com/AtaCanYmc/ResuMesh/commit/1d75547922a053a460cbe2e8c112c9ecb2c3b3fd))
* add system configuration tab for LLM and platform integrations ([54c5a63](https://github.com/AtaCanYmc/ResuMesh/commit/54c5a63973d8b8a643986bbb4b3735d117b351fb))
* add title property to ProjectBase and update test data for project creation ([c259ef3](https://github.com/AtaCanYmc/ResuMesh/commit/c259ef30abf047564bdfd4bde5839c2a8a54d79b))
* add toggle switches for new sections in AdminAppSettings ([a7c970d](https://github.com/AtaCanYmc/ResuMesh/commit/a7c970d6d1e14668d1ce0585a03e0af24478618c))
* configure build system and project metadata in pyproject.toml ([889754b](https://github.com/AtaCanYmc/ResuMesh/commit/889754bcc546d850b71214c522795737747b66fe))
* configure build system and project metadata in pyproject.toml ([dd7a78d](https://github.com/AtaCanYmc/ResuMesh/commit/dd7a78dc6366f07d8b3f58389436b7a93c35c40e))
* convert education and skill repository methods to async for improved performance ([8b2502d](https://github.com/AtaCanYmc/ResuMesh/commit/8b2502d3806d93af3afc8505a0d31ee5b95d3cac))
* convert education and skill repository methods to async for improved performance ([d33467a](https://github.com/AtaCanYmc/ResuMesh/commit/d33467a3e3971df87c8452e88e4ee837385a5047))
* convert package and post methods to async for improved performance ([795f963](https://github.com/AtaCanYmc/ResuMesh/commit/795f9637048f9786d360775057fdac3876fe1f6a))
* convert package and post methods to async for improved performance ([b5d7570](https://github.com/AtaCanYmc/ResuMesh/commit/b5d75701843feb3dd719d26d6264f5f894917fcd))
* convert repository methods to async for improved performance ([ed90645](https://github.com/AtaCanYmc/ResuMesh/commit/ed90645f2c7af4bf6b0ae6a921ab0f4571e16948))
* enhance admin app settings with new tabs for visibility, socials, and localized content ([8f5d06d](https://github.com/AtaCanYmc/ResuMesh/commit/8f5d06d720382751eee437b9ebb726f5baf5dbb8))
* enhance admin frontend settings UI with dynamic social links active/disabled toggling ([c26b468](https://github.com/AtaCanYmc/ResuMesh/commit/c26b4685edf45e6b390233aa27d1d37a801879bd))
* enhance app settings with new content fields and default values for socials, footer, marquee, and multilingual support ([d3bb22b](https://github.com/AtaCanYmc/ResuMesh/commit/d3bb22b8931b5188d026685b5e850134aa104aa8))
* enhance data fetching and model structure for GitHub repositories ([00dfe43](https://github.com/AtaCanYmc/ResuMesh/commit/00dfe43ddff15e34849c75e9491ac8eafe069bf1))
* enhance dependency installation process with retry configurations in CI ([e9ff7dc](https://github.com/AtaCanYmc/ResuMesh/commit/e9ff7dc62a8d667dfa85464a3b76fb98c3ae27e8))
* ensure project name is populated from title if missing in project responses ([f5998fc](https://github.com/AtaCanYmc/ResuMesh/commit/f5998fc1409ba373c11ee445222792b46a0e30e5))
* implement LinkedIn PDF parser for extracting and processing profile data ([38805e3](https://github.com/AtaCanYmc/ResuMesh/commit/38805e3ada89a10fb59549e186f8baaaabc42372))
* implement profile picture (avatar) storage and upload via Supabase Storage ([042da03](https://github.com/AtaCanYmc/ResuMesh/commit/042da035148a1d1d07f0c5a15ebf2031ca41539f))
* make social links dynamic in frontend using useSocialLinks hook and backend API endpoint ([115dbc3](https://github.com/AtaCanYmc/ResuMesh/commit/115dbc363f45899461efc89a65d368763630b39b))
* refactor AdminAppSettings to remove AI/LLM configuration and update state management ([749c313](https://github.com/AtaCanYmc/ResuMesh/commit/749c31324f55cf6e080ca87a3280c2525837a5a9))
* refactor API calls to use environment variables for admin endpoints ([a6c1c2a](https://github.com/AtaCanYmc/ResuMesh/commit/a6c1c2a37dcd6d5bfb7bf1e4ae70425040f45f61))
* refactor app settings model to use key-value store and update related API logic ([d41fd0b](https://github.com/AtaCanYmc/ResuMesh/commit/d41fd0b19ae9b7cc116bd1a4ba24bba3168cd37d))
* refactor LLM integration to use LLMClient; update related services and factory methods ([5e16174](https://github.com/AtaCanYmc/ResuMesh/commit/5e161747df4ec020135781602d4ecbd26b2887f2))
* refactor scraper method signatures for consistency and readability ([7bc0379](https://github.com/AtaCanYmc/ResuMesh/commit/7bc03792a1f786a93dfd34ce01bb2eab76f41b73))
* remove career router from API v1 ([ed574c3](https://github.com/AtaCanYmc/ResuMesh/commit/ed574c318a171baf2a363611e07e3f79752088b1))
* remove id field from app settings model to simplify structure ([8c8501d](https://github.com/AtaCanYmc/ResuMesh/commit/8c8501d48ebcdbb45cb27ff49841518b22f7ab95))
* remove redundant import of Optional in project.py ([f625fb1](https://github.com/AtaCanYmc/ResuMesh/commit/f625fb1a879729c3a67de877a8397ca24f74cad4))
* rename state variables for consistency in AdminCertificates, AdminEducations, and AdminProjects ([188286b](https://github.com/AtaCanYmc/ResuMesh/commit/188286b334910e1b2ebcb350e73ef08946a65d3e))
* rename title to name in Project interface and update related components ([5e9f0fa](https://github.com/AtaCanYmc/ResuMesh/commit/5e9f0fab9fc9b067bb2fb8da7424b73f26fbda9b))
* rename title to name in Project schema and update related logic ([5710384](https://github.com/AtaCanYmc/ResuMesh/commit/57103844df1f9ae23bb305ac635100f231fad0d7))
* replace 'github_url' with 'url' in project data structure and related components ([656b1c8](https://github.com/AtaCanYmc/ResuMesh/commit/656b1c8d7f883749b4afb865b15d3dd35a446863))
* replace beautifulsoup4 and Jinja2 with resumesh-llm in requirements ([2194dbc](https://github.com/AtaCanYmc/ResuMesh/commit/2194dbca87644214e76386acaec9293f3dd6747c))
* restrict allowed methods to GET in CORS middleware ([0ac9cae](https://github.com/AtaCanYmc/ResuMesh/commit/0ac9cae1e821a81be157292888e2b57af737f091))
* set default platform to "all" in PackageRefreshRequest and update platform handling logic ([51a8ef7](https://github.com/AtaCanYmc/ResuMesh/commit/51a8ef77a8a89917b3906a2709d628315a6c57a3))
* streamline project data handling by removing redundant title, stars, watchers, forks, and url assignments ([1817128](https://github.com/AtaCanYmc/ResuMesh/commit/18171284a9232bbbda630b2b970fe014f840d6af))
* sync DB sections and social_links to static JSON at build time and consume zero-runtime-http in frontend ([6499a71](https://github.com/AtaCanYmc/ResuMesh/commit/6499a71ffdb2c7f9f01baa40d8ac523db9d6aff6))
* update avatar, package, post, and video methods to use JSON mode for model dumping ([4540789](https://github.com/AtaCanYmc/ResuMesh/commit/454078920d33c60a1804ef7aa3783f55faebdfdf))
* update ContentConfig and SocialLinkItem interfaces for improved structure and type flexibility ([a2fd7c9](https://github.com/AtaCanYmc/ResuMesh/commit/a2fd7c9b39d175b26b3aec34fa1c9c20778f1cc8))
* update CORS middleware to allow all methods and add Supabase development guide ([be7ff11](https://github.com/AtaCanYmc/ResuMesh/commit/be7ff11d097a86144f007e4f89339694dc6505b7))
* update import statements to include get_db for improved database access ([9b6403e](https://github.com/AtaCanYmc/ResuMesh/commit/9b6403ee439409b4f15acf2eadd610b325d51a9e))
* update package refresh logic to support all platforms and remove unused variables ([e1ac782](https://github.com/AtaCanYmc/ResuMesh/commit/e1ac7821856f41675a937dab992049c2766a09f5))
* update project data handling and clean up imports in ingestion_service and project modules ([abf5d75](https://github.com/AtaCanYmc/ResuMesh/commit/abf5d758440e98e5334236b8109d1ee4e53ee3a6))
* update project sorting and display to prioritize name over title ([1cbc51f](https://github.com/AtaCanYmc/ResuMesh/commit/1cbc51fa4a47019cacc277658da7b7f881beee0b))
* update resumesh-scrapers dependency to version 0.8.0 ([38b2923](https://github.com/AtaCanYmc/ResuMesh/commit/38b2923dead329348bf9c79c8eac4da19a6af593))
* update resumesh-scrapers dependency to version 0.8.0 ([a7e7c40](https://github.com/AtaCanYmc/ResuMesh/commit/a7e7c40da74d6711c94a4639eaad9beccab4218f))
* update resumesh-scrapers dependency to version 0.8.0 ([0b9d28a](https://github.com/AtaCanYmc/ResuMesh/commit/0b9d28a2ca668b09dddcc4ddf5f2a4e62f6e4a21))
* update resumesh-scrapers version to 0.6.0 in requirements ([72cb98c](https://github.com/AtaCanYmc/ResuMesh/commit/72cb98c8a406b05a60038ad92a50fd56eba5f34d))
* update resumesh-scrapers version to 0.6.0 in requirements ([f27b7e9](https://github.com/AtaCanYmc/ResuMesh/commit/f27b7e94872664d0fa74055e20df99e7d09b2954))
* update routing configuration in vercel.json for improved asset handling ([707f612](https://github.com/AtaCanYmc/ResuMesh/commit/707f612f0751a198c7d3cdae489fa07251810d30))
* update sections field in app settings model to support both dict and list types ([b5b9585](https://github.com/AtaCanYmc/ResuMesh/commit/b5b958560901d738ee0d2291a16fd3ef09a198d6))
* update storage listing methods to accept an empty string for listing files ([a2500a6](https://github.com/AtaCanYmc/ResuMesh/commit/a2500a6985846faf6397a3b04b368be257d13c28))
* update styling for admin app settings and reactive resume components ([6587527](https://github.com/AtaCanYmc/ResuMesh/commit/6587527c7fcc0af9558197d4b6b6aebafe677600))


### Bug Fixes

* correct component export syntax in AdminLogin ([c493da4](https://github.com/AtaCanYmc/ResuMesh/commit/c493da4c2ce822249b121d0f54288e378b80d123))
* resolve ResponseValidationError by ensuring UUID generation in create_social_link and update Pydantic ConfigDict ([10e9f28](https://github.com/AtaCanYmc/ResuMesh/commit/10e9f28f571b23a9b6241f65a69c18c66cedc4b8))
* resolve test failures in test_sections and test_social_links by registering mock repos in conftest and updating Pydantic ConfigDicts ([f3a76de](https://github.com/AtaCanYmc/ResuMesh/commit/f3a76de0f8fb86cf3f33f59d9c6158ee2e707783))
* resolve unresolved config imports in admin frontend useHomeData.ts ([4ca616b](https://github.com/AtaCanYmc/ResuMesh/commit/4ca616b2b9b9a64be161c4609a896440caa65c18))

## [1.11.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.10.0...v1.11.0) (2026-07-23)


### Features

* add detailed logging inside get_current_admin auth dependency ([3ed8fdc](https://github.com/AtaCanYmc/ResuMesh/commit/3ed8fdc5f1146da9749eb15895c434c511b02aa0))
* enable autocapture for PostHog analytics in main.tsx ([fb92b18](https://github.com/AtaCanYmc/ResuMesh/commit/fb92b1815dfcd27e668f889abd0fac303b590518))
* enhance error logging for JWT authentication failures ([6405c06](https://github.com/AtaCanYmc/ResuMesh/commit/6405c063b61f2c9b0d98b20c311b37f59b531e09))
* enhance README with architectural features and key decisions for backend API ([2151fa5](https://github.com/AtaCanYmc/ResuMesh/commit/2151fa5fffc6f162f2fd8e0173a2cf0859759f40))
* implement repository pattern for education and skill management ([d020018](https://github.com/AtaCanYmc/ResuMesh/commit/d02001821c0a7ef86faf463ba41cbed9df08da9f))
* implement SQLAlchemy repositories for education, experience, article, and system log ([558127a](https://github.com/AtaCanYmc/ResuMesh/commit/558127a0fbec7fc59f9e426aa5dc16bde93ddb39))
* improve JWT authentication handling and error logging ([d944292](https://github.com/AtaCanYmc/ResuMesh/commit/d9442921076d6c17abeb6de0d334e553a6fc7830))
* refactor authentication to use Supabase JWT and update admin us… ([a61ad62](https://github.com/AtaCanYmc/ResuMesh/commit/a61ad62640e630bf08180970d0cab1e419c68da1))
* refactor authentication to use Supabase JWT and update admin user handling ([b900600](https://github.com/AtaCanYmc/ResuMesh/commit/b9006001b6cd6fb4179e6312d8fce17b8fc43781))
* remove admin role check requirement from auth service ([59c80fc](https://github.com/AtaCanYmc/ResuMesh/commit/59c80fc93d249fcff0b863dcf047b15a3985909e))
* remove IUserRepository and related user repository logic ([22ce804](https://github.com/AtaCanYmc/ResuMesh/commit/22ce80426f85796c4dc49f7d19c26836ec5a5d6d))
* remove PostHog telemetry integration and related configurations ([a1c1189](https://github.com/AtaCanYmc/ResuMesh/commit/a1c1189366a604a471e6ae28d638d056e8f73ebc))
* remove unused education and skill CRUD operations ([360d644](https://github.com/AtaCanYmc/ResuMesh/commit/360d64431aa9c2b5063463d9e7c2bffe9b07150f))
* remove unused files ([a8e1617](https://github.com/AtaCanYmc/ResuMesh/commit/a8e1617d9d9e5590fa9bac660ee2d9c0dc2a7110))
* remove unused files ([c52821a](https://github.com/AtaCanYmc/ResuMesh/commit/c52821a0bbca6006b1855503f7cb14c86f319ee3))
* rename sqlalchemy_provider.py to education.py and remove unused skill repository ([a8347da](https://github.com/AtaCanYmc/ResuMesh/commit/a8347da857f8985c4bbe08afda0b7f9d09db61fa))
* replace os.getenv with settings for environment variable access ([0321129](https://github.com/AtaCanYmc/ResuMesh/commit/0321129bb3b7b7ff57179f7e960d7f1887dab189))
* set PYTHONUNBUFFERED environment variable in Dockerfile ([91cd8f0](https://github.com/AtaCanYmc/ResuMesh/commit/91cd8f0560657b6e6618f28f52de0e6c3547330c))
* simplify Vercel rewrites for improved routing ([fbc95cc](https://github.com/AtaCanYmc/ResuMesh/commit/fbc95cc372cde3cb0d97411f5e29d65681575e2f))
* update CORS settings and mock environment variables in tests ([c8b8a15](https://github.com/AtaCanYmc/ResuMesh/commit/c8b8a150fa9befdc128a116b206b6431ea5bfc31))
* update location from Istanbul to İzmir in llm.txt ([eedd0fa](https://github.com/AtaCanYmc/ResuMesh/commit/eedd0fa2e87dd7d0c9ad77f64823e4266db158fa))


### Bug Fixes

* load SUPABASE_JWT_SECRET from pydantic settings instead of raw os.getenv ([d8daff2](https://github.com/AtaCanYmc/ResuMesh/commit/d8daff2abae370eefbd5642104e3fac024ed5d55))

## [1.10.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.9.0...v1.10.0) (2026-07-22)


### Features

* add comprehensive README for ResuMesh administrative workspace and restructure existing documentation ([c032572](https://github.com/AtaCanYmc/ResuMesh/commit/c03257292765b2057f110bc2d544f33e16512e01))
* add created_at field to project model and scraper data ([efe53a3](https://github.com/AtaCanYmc/ResuMesh/commit/efe53a343e43e3e7380cf02e9191ab2d99ea0be7))
* add created_at field to project model and scraper data ([0970ba4](https://github.com/AtaCanYmc/ResuMesh/commit/0970ba4e82b5fa5248c61985b53fdd59695b1d92))
* add Docker troubleshooting guide for common build errors ([64807d1](https://github.com/AtaCanYmc/ResuMesh/commit/64807d1337feadf2964f5386424576dd7831d72f))
* add initial project setup with configuration files, components, and testing utilities ([0332756](https://github.com/AtaCanYmc/ResuMesh/commit/0332756614d0b6c70a00adb8c6486846fd8c99cf))
* add refresh functionality for articles and projects in admin panel ([566981c](https://github.com/AtaCanYmc/ResuMesh/commit/566981c070b5de6174b76458792e7353173a26b0))
* add resume version history and AI analysis features with statistics display ([cd652fa](https://github.com/AtaCanYmc/ResuMesh/commit/cd652fa5d6774622f8a8cbc70e8ec0c16b0b1c42))
* add rxresume-python package for Reactive Resume integration ([400054f](https://github.com/AtaCanYmc/ResuMesh/commit/400054f6ac2845caa44f5739cb0af26ad3a01920))
* clean up requirements.txt by removing unused dependencies and reordering sections ([9b652bb](https://github.com/AtaCanYmc/ResuMesh/commit/9b652bb49ceb1dcb4b1b3f0d70d0d78e44242ea8))
* conditionally enable PostHog telemetry based on environment mode ([0870e61](https://github.com/AtaCanYmc/ResuMesh/commit/0870e61b842c8cb6fb9b3ee9b624ff2f6d62e52d))
* conditionally enable PostHog telemetry based on environment mode ([ba8b620](https://github.com/AtaCanYmc/ResuMesh/commit/ba8b620ce6ffb9ceb81943ba63659d65c7ac08d0))
* configure manual chunking for vendor libraries in Vite build ([63d19f8](https://github.com/AtaCanYmc/ResuMesh/commit/63d19f872bdf11565e673e534448aed8696d96cd))
* disable PostHog telemetry in development environment ([bf119ef](https://github.com/AtaCanYmc/ResuMesh/commit/bf119efdd207a062363d47a1088118c264f39661))
* enhance PDF download functionality with new window support and error handling ([fc546e3](https://github.com/AtaCanYmc/ResuMesh/commit/fc546e3d3b151378a0122e73701684563fbb9a1e))
* implement conditional upsert for projects and articles in Supabase ([ce6c699](https://github.com/AtaCanYmc/ResuMesh/commit/ce6c69906d1de73cb1e25af1f46fc7ca1f16ab9d))
* implement Reactive Resume API endpoints for resumes, applications, agent threads, and AI providers ([c6120d4](https://github.com/AtaCanYmc/ResuMesh/commit/c6120d4487dcd14451a2fc33ad714f7e41603314))
* implement Reactive Resume management with resume listing, syncing, and PDF export functionality ([2b93d21](https://github.com/AtaCanYmc/ResuMesh/commit/2b93d2131b09e43d70bc85fd4c961d4d534361a8))
* integrate PostHog telemetry for CV download events ([53f05f4](https://github.com/AtaCanYmc/ResuMesh/commit/53f05f47c5f1efd33a32405e8c2328ab8e05b1d5))
* integrate PostHog telemetry for CV download events ([19a3cfa](https://github.com/AtaCanYmc/ResuMesh/commit/19a3cfa6740e976fc8df06a4e1ef3599aea855ae))
* integrate PostHog telemetry for CV upload and download events ([6cf0681](https://github.com/AtaCanYmc/ResuMesh/commit/6cf0681bf9c00d607324e6c3920d0d4340e02fe4))
* integrate Reactive Resume SDK for resume mapping and API intera… ([043854f](https://github.com/AtaCanYmc/ResuMesh/commit/043854f3a877bf2fc49739332d30a9c6b18ab557))
* integrate Reactive Resume SDK for resume mapping and API interactions ([255be80](https://github.com/AtaCanYmc/ResuMesh/commit/255be805cfd007c8bed84172653b6c8d7e390d9b))
* integrate Supabase authentication and update environment config… ([7b9d696](https://github.com/AtaCanYmc/ResuMesh/commit/7b9d69667573d1ed9159c6b626ef1adce4e16d47))
* integrate Supabase authentication and update environment configurations ([2ba9e00](https://github.com/AtaCanYmc/ResuMesh/commit/2ba9e00126c1fe70e3f40d3de04cd21dc1ad705c))
* integrate telemetry events for CV, articles, certificates, experiences, educations, and skills management ([fe8c1e4](https://github.com/AtaCanYmc/ResuMesh/commit/fe8c1e4778b8ce9e39d55e83103d9a827e845634))
* refactor ingestion service to use dynamic upsert method for providers ([afe39a6](https://github.com/AtaCanYmc/ResuMesh/commit/afe39a607650aadad44bc58fd1dcda6e02e65500))
* refactor scraper imports to use resumesh-scrapers package and update requirements ([b215fb2](https://github.com/AtaCanYmc/ResuMesh/commit/b215fb2c0fe9b32bdc4b1364bf32dd58c9ef332f))
* refactor scraper imports to use resumesh-scrapers package and update requirements ([2f5932f](https://github.com/AtaCanYmc/ResuMesh/commit/2f5932f5e8626b1fcc4f657b342c6992db97ad2a))
* remove Playwright browser installation from Dockerfile ([be25d23](https://github.com/AtaCanYmc/ResuMesh/commit/be25d238f2f66a43c120daf26c9ac35b99bea526))
* remove Playwright browser installation from Dockerfile ([8d2157a](https://github.com/AtaCanYmc/ResuMesh/commit/8d2157a4d2f327e60ef67eef473ef5da7120563b))
* remove unused lifespan context manager and apscheduler dependency ([b8cefdc](https://github.com/AtaCanYmc/ResuMesh/commit/b8cefdc3e8188e87c035bc4395a8957d0d41b5c3))
* remove unused lifespan context manager and apscheduler dependency ([233f8dc](https://github.com/AtaCanYmc/ResuMesh/commit/233f8dce0a344e0bc733fc27329765bc58f6489b))
* restructure admin backend with new API endpoints and configuration files ([3507749](https://github.com/AtaCanYmc/ResuMesh/commit/3507749b86b9bfcd149bde9b29444081d2759fff))
* update column accessor keys for certificates, educations, projects, and skills ([efc8ace](https://github.com/AtaCanYmc/ResuMesh/commit/efc8ace8faa50d91fe0b1f342c9209cd9dc435f0))
* update CV generation to return structured resume data and improve template prompts ([82bb888](https://github.com/AtaCanYmc/ResuMesh/commit/82bb8888e4c42fcdac9ffb679121f31ccc93d0b5))
* update location from Istanbul to İzmir in llm.txt ([51071ca](https://github.com/AtaCanYmc/ResuMesh/commit/51071ca6acbb55f44638c147a21d6c69d74597a8))
* update PostgreSQL connection strings and refactor database provider handling ([834002f](https://github.com/AtaCanYmc/ResuMesh/commit/834002f1596c79f110299ef5bfd1f4dab72f2a0e))
* update README for private admin backend and dashboard, enhancing clarity and setup instructions ([88831ef](https://github.com/AtaCanYmc/ResuMesh/commit/88831ef07f2d17d0c7f8cf859c0e8801d476a9ea))
* update render.yaml to configure admin and public backend services with new environment variables ([a17c32b](https://github.com/AtaCanYmc/ResuMesh/commit/a17c32bad54b6b6d80e56cb4589aaaa7626fe2ce))
* update rxresume-python package to version 0.5.0 ([f3a409c](https://github.com/AtaCanYmc/ResuMesh/commit/f3a409c98f22ed529c2dc3da24cf28cec19cb568))


### Bug Fixes

* ensure request URL is converted to string in telemetry service ([1add67c](https://github.com/AtaCanYmc/ResuMesh/commit/1add67cbe940d4b5ad3a24d3fc003a64da6ecd9f))
* ensure request URL is converted to string in telemetry service ([a888cb7](https://github.com/AtaCanYmc/ResuMesh/commit/a888cb7e23942961baa60b205840e5be147b944e))
* update accessor key for published date in AdminArticles component ([d0c5368](https://github.com/AtaCanYmc/ResuMesh/commit/d0c5368a280f69e7dac0479a84f35eb89a55e10d))
* update model_dump calls to use json mode for project, article, experience, and certificate updates ([662c5ca](https://github.com/AtaCanYmc/ResuMesh/commit/662c5ca1400ec7296b2f4a6cd9a40bfa46591f90))

## [1.9.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.8.0...v1.9.0) (2026-07-11)


### Features

* add admin dependency to CRUD operations for articles, certificates, educations, experiences, projects, and skills ([6bd9672](https://github.com/AtaCanYmc/ResuMesh/commit/6bd96729c8a82a1382b5fa25c076458d2a70fc6a))
* add admin workspace toggle to manage resource usage in production environments ([1fd3acc](https://github.com/AtaCanYmc/ResuMesh/commit/1fd3acc71db0d369b5442c8c47dbc56fc165f3c5))
* add auto-deploy pipeline to GitHub Actions and document admin workspace flag ([12c876e](https://github.com/AtaCanYmc/ResuMesh/commit/12c876e9515a7451cf2a7a46553803af7b8dd11e))
* add CORS support and enhance error handling in project loading ([8246d0e](https://github.com/AtaCanYmc/ResuMesh/commit/8246d0ebd1e4e43404dc0f57072db5f0b8f34b2b))
* add cron jobs toggle to enable/disable nightly data sync scheduler ([44c4e95](https://github.com/AtaCanYmc/ResuMesh/commit/44c4e95e469280a47241652f96e142e94dafba79))
* add Docker Compose configuration for local PostgreSQL database setup ([49d778b](https://github.com/AtaCanYmc/ResuMesh/commit/49d778b9559ecfd128395c9637e9246494a99688))
* add environment-based CORS origin filtering for development ([e320dac](https://github.com/AtaCanYmc/ResuMesh/commit/e320dacd485a156878e97d0e87b28e25978f4498))
* add local PostgreSQL Docker Compose configuration and quickstart guides to README ([02a95b3](https://github.com/AtaCanYmc/ResuMesh/commit/02a95b3f5a11294134df400c5dd26a3a010b5e70))
* add logging for scheduler shutdown and implement health check endpoint ([96a526d](https://github.com/AtaCanYmc/ResuMesh/commit/96a526d1faa10e688f60faacc778358ee320f015))
* add OpenAPI documentation endpoints and corresponding tests ([6f202fa](https://github.com/AtaCanYmc/ResuMesh/commit/6f202fa3bbf1f731ad4e3c15cfa55782eb87a9d7))
* add OpenAPI documentation endpoints and corresponding tests ([035d09d](https://github.com/AtaCanYmc/ResuMesh/commit/035d09d798194a5a953d90f392de01ba1016daa9))
* add render configuration for resumesh backend with database and environment variables ([9bd75fb](https://github.com/AtaCanYmc/ResuMesh/commit/9bd75fb40d065b51fbf9a6b18673576deed1d5b1))
* add response interceptor to handle unauthorized access and update admin user role in seed script ([8763b0c](https://github.com/AtaCanYmc/ResuMesh/commit/8763b0c813983ce5458cd81eef3028f4c894813c))
* add resume download functionality with loading state and fallback support ([2840c75](https://github.com/AtaCanYmc/ResuMesh/commit/2840c755b169bd0b6309bbeec02933949e60efa3))
* add tests for admin permission requirements on CRUD endpoints ([9ab8490](https://github.com/AtaCanYmc/ResuMesh/commit/9ab84904298010e50b634c0040fca93716f5b213))
* add tests for AuthContext, ProtectedRoute, and ThemeContext components ([e12b955](https://github.com/AtaCanYmc/ResuMesh/commit/e12b955c668bd7a042f091fdfd6525d7db970ef7))
* enhance API root and health check responses with additional metadata ([10e2dc5](https://github.com/AtaCanYmc/ResuMesh/commit/10e2dc588e92a1c773c3165f9dadc3f56c895cd0))
* enhance footer to support dynamic language display for hero attribution ([af07445](https://github.com/AtaCanYmc/ResuMesh/commit/af07445baea179166a6bb7ef9493bc4050496e20))
* enhance global search functionality with query alias and validation ([650a051](https://github.com/AtaCanYmc/ResuMesh/commit/650a05163c1fe20a6e1533ad3da50d05a8e4a937))
* enhance MainLayout with dynamic content configuration and improved sidebar layout ([0a402c3](https://github.com/AtaCanYmc/ResuMesh/commit/0a402c3f843964659ece76fd015dce2b128c514e))
* enhance useHomeData hook with keepPreviousData for improved loading experience ([53da095](https://github.com/AtaCanYmc/ResuMesh/commit/53da095389257d2e46786acef3457f3afcb2b48b))
* implement cookie-based authentication and add logout/verify endpoints ([e91ea7b](https://github.com/AtaCanYmc/ResuMesh/commit/e91ea7bff242dcbf49331affcb6a4b3092644fca))
* implement CV upload, listing, and download functionality with Supabase storage ([49c9553](https://github.com/AtaCanYmc/ResuMesh/commit/49c9553dec933f1fcb43b345dd20d3ebb1248e1f))
* implement resume linking functionality with dynamic path generation ([499fdcc](https://github.com/AtaCanYmc/ResuMesh/commit/499fdcc14edb507ce60ef884df3399f17fd3d991))
* replace loading indicators with skeleton components for improved UX ([83b4885](https://github.com/AtaCanYmc/ResuMesh/commit/83b4885f4bf48091bcef97d3242e6db7c3566258))
* update deployment documentation and Dockerfile for improved memory management and Playwright setup ([ee6e41d](https://github.com/AtaCanYmc/ResuMesh/commit/ee6e41d5a63c5402ab9605cd3eb9b8a07e366df4))
* update Docker configuration and add health check tests ([16ceef7](https://github.com/AtaCanYmc/ResuMesh/commit/16ceef78018cbd06269e90e31846b6b1bf51d1cf))
* update favicon link to use .ico format for better compatibility ([1682c08](https://github.com/AtaCanYmc/ResuMesh/commit/1682c08dccf8a3ad9e2adcbb5c45b00ed6c9f416))
* update favicon link to use .ico format for better compatibility ([927e0a5](https://github.com/AtaCanYmc/ResuMesh/commit/927e0a5469e06da1985dd2b40adbff4fafca8b2f))
* update footer email address for improved contact accuracy ([d6bbb83](https://github.com/AtaCanYmc/ResuMesh/commit/d6bbb837e682ff30b7d0bfcb38f6b83329b3cfc7))
* update hero name reference to use fullName for improved clarity ([647e0d6](https://github.com/AtaCanYmc/ResuMesh/commit/647e0d674a01149b873f598c78be1b81a01c905a))
* update README for improved quick start instructions and component documentation ([7908e8f](https://github.com/AtaCanYmc/ResuMesh/commit/7908e8fb51febe97ffa0cd2b4aa10a797b3056ef))
* update README with new landing page screenshot ([3b693a9](https://github.com/AtaCanYmc/ResuMesh/commit/3b693a9b3cfba8b06693cacfc39b1eae7c12cf1e))
* update resume link path for improved file organization ([a950883](https://github.com/AtaCanYmc/ResuMesh/commit/a950883e0188e39dfdf0d3d81ffbc29cc5d6fb6b))


### Bug Fixes

* add marquee section to content.json and update useHomeData to include it ([6450881](https://github.com/AtaCanYmc/ResuMesh/commit/64508819fa3641068acdff8a8a6b58ed93bbd291))
* add Vercel Analytics integration to App component ([99de4f1](https://github.com/AtaCanYmc/ResuMesh/commit/99de4f14b71e42a7d2c1cc25dc77bea2d72d894d))
* add Vercel Analytics integration to App component ([c37dbb2](https://github.com/AtaCanYmc/ResuMesh/commit/c37dbb28c471a4edbf062e55ae2736c77e471f75))
* correct API endpoint paths for root and health check ([fdf1311](https://github.com/AtaCanYmc/ResuMesh/commit/fdf13116738d34cb34bb998f38367f2aeb7ec6dd))
* enhance marquee animation with reverse direction and CSS adjustments ([096c978](https://github.com/AtaCanYmc/ResuMesh/commit/096c97868cd359716ab0a90efebc39fd7a33fc5b))
* enhance SkillsMarquee component with dynamic category filtering and animations ([6c2d347](https://github.com/AtaCanYmc/ResuMesh/commit/6c2d3478f0cbf5a16c3353c8376e0cf9faecce3e))
* ensure skills data is an array before rendering in SkillsMarquee component ([8f493e2](https://github.com/AtaCanYmc/ResuMesh/commit/8f493e2bc475a7f33a0dbe7571daf4c68a122601))
* ensure skills data is an array before rendering in SkillsMarquee… ([90eee9e](https://github.com/AtaCanYmc/ResuMesh/commit/90eee9ed538c98c7e6bc67ccf73949e688c45978))
* increase the number of projects and articles fetched for better … ([5f7da59](https://github.com/AtaCanYmc/ResuMesh/commit/5f7da59d3fab32a555f74997912731fed192b634))
* increase the number of projects and articles fetched for better content display ([195a6b9](https://github.com/AtaCanYmc/ResuMesh/commit/195a6b94806f3833bda4ea16bed1b3b2a8a2a054))
* increase z-index of header for improved visibility ([48ab47b](https://github.com/AtaCanYmc/ResuMesh/commit/48ab47b5b92ca57bfeb2cc42bab833f5e80310fa))
* remove redundant GITHUB_USERNAME from .env.example ([69137e5](https://github.com/AtaCanYmc/ResuMesh/commit/69137e52b729585ffe53b106969892c290e84bb2))
* restore footer about section in content and translation files ([308bcb2](https://github.com/AtaCanYmc/ResuMesh/commit/308bcb2978317c6f7ea0552b03f4fb30de98dffb))
* update LinkedIn URL in content.json for correct profile link ([18c54af](https://github.com/AtaCanYmc/ResuMesh/commit/18c54af7c63c6829fff80cdd009d8f4006a44995))
* update LinkedIn URL in content.json for correct profile link ([d3e3229](https://github.com/AtaCanYmc/ResuMesh/commit/d3e32291aba35255ca18de4b6cde22060fe4de63))
* update logo image path in README for correct display ([55c1b91](https://github.com/AtaCanYmc/ResuMesh/commit/55c1b914faf4a1937f8e58480d5d660855b3ab0f))
* update logo image path in README for correct display ([9ac8051](https://github.com/AtaCanYmc/ResuMesh/commit/9ac8051337a2518858cbf2ec94c66a7fb417bd2c))
* update project sections with enhanced headings and subtitles for better clarity ([5416c09](https://github.com/AtaCanYmc/ResuMesh/commit/5416c09091a758f1ba7bbd15a736a8d6f879c7fa))
* update project sections with enhanced headings and subtitles for… ([6cbc500](https://github.com/AtaCanYmc/ResuMesh/commit/6cbc50037f56165629ce40931d710947429ca9f9))
* update project statistics in content.json for accuracy ([33cac4c](https://github.com/AtaCanYmc/ResuMesh/commit/33cac4cae36d93bfb74f48ac3855bb974706517e))
* update social links and footer information in content.json and add new icons ([10224c8](https://github.com/AtaCanYmc/ResuMesh/commit/10224c8cc4724f4c91aa2444237f14776304a928))
* update Turkish comments and error messages to English for consistency ([20fb372](https://github.com/AtaCanYmc/ResuMesh/commit/20fb372dd669c78a61fffdbe96b6f174a379495a))

## [1.8.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.7.0...v1.8.0) (2026-07-11)


### Features

* add article and project refresh functionality with platform-specific scrapers ([489b9e4](https://github.com/AtaCanYmc/ResuMesh/commit/489b9e484bf237964fa2746d87436369d9c83ce0))
* add education management functionality with CRUD operations and UI components ([7bfbdc9](https://github.com/AtaCanYmc/ResuMesh/commit/7bfbdc95286fd0713cc86cf406519b4337c42f84))
* add pagination support for articles, experiences, certificates, skills, and educations retrieval ([06e9037](https://github.com/AtaCanYmc/ResuMesh/commit/06e9037d51728d1c4e2d0a79d685b280e63de089))
* add skills and educations management with CRUD operations and integrate into the admin panel ([8f671bb](https://github.com/AtaCanYmc/ResuMesh/commit/8f671bb5ddf7fa540b1e04c7a9cbdd452fb345aa))
* enhance admin sections with empty state components and improve data table columns ([7943813](https://github.com/AtaCanYmc/ResuMesh/commit/794381359f36568c2d84b731c249413db0fa313c))
* enhance logging and PDF processing with error handling and size validation ([9dc881e](https://github.com/AtaCanYmc/ResuMesh/commit/9dc881ecbcbb86ed78ea313cb40c394d057de0c0))
* implement background processing for data ingestion in refresh endpoints ([0c57920](https://github.com/AtaCanYmc/ResuMesh/commit/0c57920407333f1b76fa8036cc4d2e04aee15198))
* implement skills management with CRUD operations and integrate into admin panel ([44303a3](https://github.com/AtaCanYmc/ResuMesh/commit/44303a3d3dca6b2cc7d2f4ab5f8ed13cb3cd2dee))
* implement SSRF protection in scraper service and enhance CV generation with concurrent tasks ([0670477](https://github.com/AtaCanYmc/ResuMesh/commit/06704778a5c515ec9c43425e351921ef753ae89b))
* refactor admin dependencies to use session management and improve testability ([94bd63e](https://github.com/AtaCanYmc/ResuMesh/commit/94bd63eeabc4b78f5c0cd3a343040bcb50fbb6ac))

## [1.7.0](https://github.com/AtaCanYmc/ResuMesh/compare/v1.6.0...v1.7.0) (2026-07-09)


### Features

* add search and date filtering options to system logs and update related methods ([2ec3cfc](https://github.com/AtaCanYmc/ResuMesh/commit/2ec3cfc424773e7f8b3c4cd6d28609410f0d0582))
* add twitterHandle prop to SEO component for enhanced social media integration ([4b5da37](https://github.com/AtaCanYmc/ResuMesh/commit/4b5da37395ec9552e53b47d4bf30f8061f98155d))
* enhance system log functionality with search and filter options ([4505c02](https://github.com/AtaCanYmc/ResuMesh/commit/4505c02bee0258d2f2f2d6f13d6df17c4c7038a3))
* remove admin link from MainLayout and clean up imports ([10c939d](https://github.com/AtaCanYmc/ResuMesh/commit/10c939d8a23aea20099bb2da6b1dfeb75804b29d))

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
