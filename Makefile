.PHONY: help install dev prod deploy test clean backup setup-automation

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install dependencies
	cd nextgen-perfumes-backend && composer install
	cd nextgen-perfumes-frontend && npm install

dev: ## Start development environment
	docker-compose up -d
	@echo "Development environment started at http://localhost"

prod: ## Deploy to production
	./automation/deploy-production.sh

deploy-docker: ## Deploy using Docker
	./automation/docker-deploy.sh

test: ## Run tests
	cd nextgen-perfumes-backend && php artisan test
	cd nextgen-perfumes-frontend && npm test

clean: ## Clean up containers and volumes
	docker-compose down -v
	docker system prune -f

backup: ## Create backup
	./automation/backup.bat

rollback: ## Rollback deployment
	./automation/rollback.sh

logs: ## Show application logs
	docker-compose logs -f

status: ## Check service status
	docker-compose ps
	curl -s http://localhost/health || echo "Service unavailable"

setup-automation: ## Setup all automation (run once on server)
	./automation/cron-setup.sh
	./automation/ssl-setup.sh
	chmod +x automation/*.sh


lint: ## Run code quality checks
	cd nextgen-perfumes-frontend && npx eslint js/
	cd nextgen-perfumes-backend && ./vendor/bin/phpcs

security-scan: ## Run security scans
	cd nextgen-perfumes-backend && composer audit
	cd nextgen-perfumes-frontend && npm audit

monitor: ## Check system health
	./automation/monitoring.sh