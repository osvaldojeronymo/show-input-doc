#!/bin/bash

# Script para abrir a página sem cache no Firefox
echo "Abrindo página sem cache..."

# Se Firefox estiver disponível
if command -v firefox &> /dev/null; then
    firefox --private-window "file://$(pwd)/index.html"
elif command -v google-chrome &> /dev/null; then
    google-chrome --incognito "file://$(pwd)/index.html"
elif command -v chromium-browser &> /dev/null; then
    chromium-browser --incognito "file://$(pwd)/index.html"
else
    echo "Abra o arquivo index.html em modo privado/incógnito do seu navegador"
    echo "Caminho: $(pwd)/index.html"
fi
