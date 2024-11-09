#!/bin/sh

if [ ! -f "nginx/certs/local.key" ] || [ ! -f "nginx/certs/local.crt" ]; then
  echo "Generating self-signed SSL certificates..."
  mkdir -p nginx/certs
  openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout nginx/certs/local.key \
    -out nginx/certs/local.crt \
    -subj "/CN=localhost"
else
  echo "SSL certificates already exist."
fi