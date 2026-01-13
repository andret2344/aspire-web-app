@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"

set "JWT_DIR=..\jwt"
if not exist "%JWT_DIR%" mkdir "%JWT_DIR%"

set "PRIV=%JWT_DIR%\private.pem"
set "PUB=%JWT_DIR%\public.pem"

where openssl >nul 2>&1
if errorlevel 1 (
  echo ERROR: OpenSSL not found in PATH.
  exit /b 1
)

for /f "usebackq delims=" %%A in (`openssl rand -hex 32`) do set "APP_SECRET=%%A"
for /f "usebackq delims=" %%A in (`openssl rand -base64 48`) do set "JWT_PASSPHRASE=%%A"

echo APP_SECRET=!APP_SECRET!
echo JWT_PASSPHRASE=!JWT_PASSPHRASE!

if exist "%PRIV%" del /f /q "%PRIV%"
if exist "%PUB%" del /f /q "%PUB%"

openssl genrsa -aes256 -passout pass:!JWT_PASSPHRASE! -out "%PRIV%" 4096
if errorlevel 1 (
  echo ERROR: openssl failed generating private key.
  exit /b 2
)
echo Generated "%PRIV%"

openssl rsa -pubout -in "%PRIV%" -passin pass:!JWT_PASSPHRASE! -out "%PUB%"
if errorlevel 1 (
  echo ERROR: openssl failed generating public key.
  exit /b 3
)
echo Generated "%PUB%"

endlocal
exit /b 0
