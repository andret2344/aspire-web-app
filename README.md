# Aspire Web App

This is the frontend part of _Aspire, The Aspiration Abyss_.

## Table of contents

[[_TOC_]]

## Prepare for development

### Setup backend

1. Copy the file `<rootDir>/backend/.env.sample` into `<rootDir>/backend/.env` and ask the team for secrets (most
   importantly the `SECRET_KEY` and `POSTGRES_DB_PASS`)
2. In the `<rootDir>/backend` directory run `docker-compose up` (alternatively add `-d`).

The project will start on the default `8083` port.

### Setup frontend

1. Run `yarn install`.
2. Make a copy of `<rootDir>/.env` file and name it as `<rootDir>/.env.dev`.
3. In the newly created file use the backend address you want to reach. Remember to put `/api` at the end. For instance:

```dotenv
REACT_API_URL=http://localhost:8083/api
```

## Running the project

All the scripts are present in the `<rootDir>/package.json` file.
