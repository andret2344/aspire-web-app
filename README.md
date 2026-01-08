# Aspire Web App

[![codecov](https://codecov.io/gh/andret2344/aspire-web-app/graph/badge.svg?token=0mvETlGdA8)](https://codecov.io/gh/andret2344/aspire-web-app)

This is the frontend part of _Aspire, The Aspiration Abyss_.

## Table of contents

- [Aspire Web App](#aspire-web-app)
    * [Table of contents](#table-of-contents)
    * [Prepare for development](#prepare-for-development)
        + [Setup backend](#setup-backend)
        + [Setup frontend](#setup-frontend)
    * [Running the project](#running-the-project)

## Prepare for development

### Setup backend

1. Copy the file `<rootDir>/backend/.env.sample` into `<rootDir>/backend/.env`.
2. Run the script in `<rootDir>/backend/scripts/` that matches your OS. The script generates JWT keypair and prints
   secrets to the console.
3. Copy the secrets and fill them in in the `.env` file.
4. In the `<rootDir>/backend` directory run `docker-compose up` (alternatively add `-d`).

The project will start on the default `8083` port.

### Setup frontend

1. Run `yarn install`.
2. Make a copy of `<rootDir>/.env` file and name it as `<rootDir>/.env.dev`.
3. In the newly created file use the backend address you want to reach. For instance:

```dotenv
REACT_API_URL=http://localhost:8083/
```

## Running the project

All the scripts are present in the `<rootDir>/package.json` file.
