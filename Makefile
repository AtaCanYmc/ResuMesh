.PHONY: install dev seed generate-types clean

# Default target
help:
	@echo "Available commands:"
	@echo "  make install         - Install all dependencies (frontend, backend, pre-commit)"
	@echo "  make dev             - Start the local development environment via docker compose"
	@echo "  make seed            - Seed the database with mock data for testing"
	@echo "  make generate-types  - Generate TypeScript API client from FastAPI OpenAPI spec"
	@echo "  make clean           - Remove node_modules, Python cache files, and virtual environments"

install:
	@echo "Installing Backend Dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing Frontend Dependencies..."
	cd frontend && npm install
	@echo "Installing pre-commit hooks..."
	pre-commit install || echo "pre-commit not found. Please pip install pre-commit if needed."

dev:
	@echo "Starting Development Environment..."
	docker compose up -d
	@echo "Services started. Backend: http://localhost:8000, Frontend: http://localhost:8080"
	@echo "You can also run frontend locally via 'cd frontend && npm run dev'"

seed:
	@echo "Seeding the database..."
	cd backend && python scripts/seed_mock_data.py
	@echo "Database seeded successfully."

generate-types:
	@echo "Generating Frontend API Types..."
	@echo "Note: The backend must be running locally for this to work."
	cd frontend && npm run generate-client
	@echo "Types generated successfully in frontend/src/api/generated"

clean:
	@echo "Cleaning up..."
	rm -rf frontend/node_modules
	rm -rf backend/.venv
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type d -name ".pytest_cache" -exec rm -rf {} +
	@echo "Clean complete."
