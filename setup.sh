#!/bin/bash

set -e

MODE="${1:-prod}"

if [[ "$MODE" != "dev" && "$MODE" != "prod" ]]; then
  echo "Error: Invalid mode '$MODE'"
  echo "Valid arguments: 'dev' or 'prod'"
  exit 1
fi

echo "Starting CabinCare Manager setup in $MODE mode..."

echo "Stopping existing containers..."
docker compose down || true

if [[ "$MODE" == "dev" ]]; then
  docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build -d
else
  docker compose -f docker-compose.yml -f docker-compose.prod.yml up --build -d
fi


echo ""
echo "Setup complete!"
echo ""
echo "Access the application:"
echo "   Local:     http://localhost:3000"
