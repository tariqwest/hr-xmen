# Project Name

> Pithy project description

## Team

  - Alexi Taylor
  - Gregory Coffeng
  - Jason Yu
  - Tariq West

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)

## Features

- Webpack development and production environment configuration
- Webpack SCSS configuration
- React Hot loader
- React Router configuration
- React, Redux configuration
- Testing environment configured with Mocha and Chai
- Linting with Airbnb eslint configuration

## Getting Started

Clone Repo

````
git clone https://github.com/alexitaylor/express-react-redux-boilerplate
````

npm install dependencies

````
express-react-redux-boilerplate

npm install
````

### Start development server with hot reloading

````
npm run dev
````

### Testing

Run test once

````
npm run test
````

Test watch

````
npm run test:watch
````

### Linting

For linting i'm using Eslint with Airbnb Eslint configuration

````
npm run lint
````

### Production

Build for production

````
npm run build
````

Start production server

````
npm run start
````

Note: I'm using pm2 for production server, you should install it on server via 'npm install pm2 -g'.
if you don't want to use pm2, just change pm2 with node in package.json file in scripts section.

### Roadmap

View the project roadmap [here](LINK_TO_DOC)


## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

### Happy Coding

### License

MIT