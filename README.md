# Aspire Web App

This is the frontend part of _Aspire, The Aspiration Abyss_.

## Prepare for development

### Setup backend

1. Copy the file `<rootDir>/backend/.env.sample` into `<rootDir>/backend/.env`.
2. Run the script in `<rootDir>/backend/scripts/` that matches your OS. The script generates JWT keypair and prints
   secrets to the console.
3. Copy the secrets and fill them in in the `.env` file.
4. In the `<rootDir>/backend` directory run `docker-compose up` (alternatively add `-d`).

The project will start on the default `8083` port.
