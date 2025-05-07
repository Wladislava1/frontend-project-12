install:
	cd frontend && npm install

build:
	cd frontend && npm run build

start:build
	npx start-server -s ./frontend/dist -p 5002
