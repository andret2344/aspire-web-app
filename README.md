# Aspire Web App

This is the frontend part of Aspire, The Aspiration Abyss.

## Table of contents

[[_TOC_]]

## Prepare for development

### Open project dir

    cd aspire-web-app

### Install dependencies

    yarn

### Prepare environment

1. Make a copy of `.env` file and name it `.env.dev`.
2. In the newly created file use the backend address you want to reach. Remember to put `/api` at the end.

### Run dev server

    yarn start

## Production

### Build the production version

    yarn build

## Tests

### Run tests

yarn test

### Run tests with coverage

yarn test:ci
