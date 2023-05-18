### Flashcard APP
This REPO contains all of the functionalities to serve frontend for this project

Table of Contents
- [Description](#description)
  - [Documentation](#documentation)
  - [Setup](#setup)
    - [Dependencies](#dependencies)
    - [Folder Structure](#folder-structure)
  - [Getting Started](#getting-started)
      - [Cloning the project](#cloning-the-project)
      - [Installing dependencies](#installing-dependencies)
      - [Run The Service](#run-the-service)

# Description
Flashcards are a great way to learn a subject in a short period of time by engaging your brain with an active recall to help as you work through the cards.

## Documentation

This project have only one endpoint available for every single request.
`/graphql`

## Setup

### Dependencies

Tech Stack
- **Backend**: TypeScript, ExpressJS, GraphQL, Apollo
- **Database**: Postgres
- **ORM**: Prisma

### Folder Structure
```
📦 flashcard-app
 ┣ 📂interfaces     # All Typescript interfaces
 ┣ 📂prisma         # Includes schema.prisma and migrations
 ┣ 📂schemas        # GraphQL Resolvers and TypeDefs
 ┣ 📂utils          # Utilities for the app
 ┣ 📜app.ts         # Entry point

```
## Getting Started

#### Cloning the project
```bash
git clone https://github.com/TresorRw/flashcard-app.git
cd flashcard-app
```
#### Installing dependencies
```bash
npm i
```

#### Run The Service
```bash
npm start
```