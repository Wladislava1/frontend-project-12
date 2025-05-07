install:
	cd frontend && npm ci

build:
	cd frontend && npm run build

start:build
	npx start-server -s ./frontend/dist -p 5002
