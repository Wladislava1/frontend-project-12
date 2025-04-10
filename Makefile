build:
	cd frontend && npm run build

start:build
	npx start-server -s ./frontend/build
