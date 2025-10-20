#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JWT_DIR="${SCRIPT_DIR}/../jwt"
mkdir -p "$JWT_DIR"

PRIV="$JWT_DIR/private.pem"
PUB="$JWT_DIR/public.pem"

command -v openssl >/dev/null 2>&1 || { echo "ERROR: openssl not found"; exit 1; }

# zawsze nowy passphrase + app secret (alfanum)
APP_SECRET="$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 64)"
JWT_PASSPHRASE="$(tr -dc 'A-Za-z0-9' </dev/urandom | head -c 24)"

# wypisz (surowo)
printf 'APP_SECRET=%s\n' "$APP_SECRET"
printf 'JWT_PASSPHRASE=%s\n' "$JWT_PASSPHRASE"

# usuń stare pliki (by pewnie nadpisać)
rm -f "$PRIV" "$PUB"

# wygeneruj zaszyfrowany private key i public key
openssl genrsa -aes256 -passout pass:"$JWT_PASSPHRASE" -out "$PRIV" 4096
echo "Generated '$PRIV'"
openssl rsa -pubout -in "$PRIV" -passin pass:"$JWT_PASSPHRASE" -out "$PUB"
echo "Generated '$PUB'"
