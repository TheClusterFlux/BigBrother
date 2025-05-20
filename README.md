# BigBrother

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.0.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Docker

### Build and Run with Docker Compose
```bash
# Build and start the container
docker compose up -d

# Stop the container
docker compose down
```

### Build and Run Manually
```bash
# Build the Docker image
docker build -t keanuwatts/theclusterflux:BigBrother .

# Run the container
docker run -d -p 8080:80 --name big-brother keanuwatts/theclusterflux:BigBrother
```

Access the application at `http://localhost:8080`.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
