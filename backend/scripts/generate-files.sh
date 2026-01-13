#!/usr/bin/env bash
set -euo pipefail
umask 077

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JWT_DIR="${SCRIPT_DIR}/../jwt"
mkdir -p "$JWT_DIR"

PRIV="$JWT_DIR/private.pem"
PUB="$JWT_DIR/public.pem"

command -v openssl >/dev/null 2>&1 || { echo "ERROR: openssl not found"; exit 1; }

# zawsze nowy passphrase + app secret (alfanum)
APP_SECRET="$(openssl rand -hex 32)"
JWT_PASSPHRASE=""
while [ "${#JWT_PASSPHRASE}" -lt 24 ]; do
  JWT_PASSPHRASE="${JWT_PASSPHRASE}$(openssl rand -base64 48 | tr -dc 'A-Za-z0-9')"
done
JWT_PASSPHRASE="${JWT_PASSPHRASE:0:24}"

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
