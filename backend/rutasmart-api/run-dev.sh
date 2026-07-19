#!/bin/bash
# Levantar backend local con perfil dev (pooler Supabase + JWT)
set -e
cd "$(dirname "$0")"
echo "→ Iniciando RutaSmart API (perfil dev) en http://localhost:8080"
echo "→ Swagger: http://localhost:8080/swagger"
mvn spring-boot:run -Dspring-boot.run.profiles=dev
