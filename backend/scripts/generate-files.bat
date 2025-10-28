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

set "CHARS=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
set "APP_SECRET="
for /L %%i in (1,1,64) do (
  set /A "idx=!random! %% 62"
  for %%c in (!idx!) do set "APP_SECRET=!APP_SECRET!!CHARS:~%%c,1!"
)
set "JWT_PASSPHRASE="
for /L %%i in (1,1,24) do (
  set /A "idx=!random! %% 62"
  for %%c in (!idx!) do set "JWT_PASSPHRASE=!JWT_PASSPHRASE!!CHARS:~%%c,1!"
)

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
