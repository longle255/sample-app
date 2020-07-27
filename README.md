<h1 align="center">Sample API</h1>

<p align="center">
  <b>Sample RESTful API Services in TypeScript.</b></br>
</p>

<br />

### Serve

Go to the project dir and start the app with this yarn script.

```bash
yarn start serve
```

> This starts a local server using `nodemon`, which will watch for any file changes and will restart the sever according to these changes.
> The server address will be displayed to you as `http://0.0.0.0:3000`.


## ❯ Scripts and Tasks

All script are defined in the `package-scripts.js` file, but the most important ones are listed here.

### Install

- Install all dependencies with `yarn install`

### Linting

- Run code quality analysis using `yarn start lint`. This runs tslint.
- There is also a vscode task for this called `lint`.

### Tests

- Run the unit tests using `yarn start test` (There is also a vscode task for this called `test`).
- Run the integration tests using `yarn start test.integration`.
- Run the e2e tests using `yarn start test.e2e`.

### Running in dev mode

- Run `yarn start serve` to start nodemon with ts-node, to serve the app.
- The server address will be displayed to you as `http://0.0.0.0:3000`

### Building the project and run it

- Run `yarn start build` to generated all JavaScript files from the TypeScript sources (There is also a vscode task for this called `build`).
- To start the builded app located in `dist` use `yarn start`.

## ❯ API Routes

The route prefix is `/api` by default, but you can change this in the .env file.
The swagger and the monitor route can be altered in the `.env` file.

| Route          | Description |
| -------------- | ----------- |
| **/api**       | Shows us the name, description and the version of the package.json |
| **/monitor**   | Shows a small monitor page for the server |
| **/api/users** | Example entity endpoint |
| **/api/pets**  | Example entity endpoint |

## ❯ Project Structure

| Name                              | Description |
| --------------------------------- | ----------- |
| **.vscode/**                      | VSCode tasks, launch configuration and some other settings |
| **dist/**                         | Compiled source files will be placed here |
| **src/**                          | Source files |
| **src/api/controllers/**          | REST API Controllers |
| **src/api/controllers/requests**  | Request classes with validation rules if the body is not equal with a model |
| **src/api/controllers/responses** | Response classes or interfaces to type json response bodies  |
| **src/api/errors/**               | Custom HttpErrors like 404 NotFound |
| **src/api/interceptors/**         | Interceptors are used to change or replace the data returned to the client. |
| **src/api/middlewares/**          | Express Middlewares like helmet security features |
| **src/api/models/**               | Bookshelf Models |
| **src/api/repositories/**         | Repository / DB layer |
| **src/api/services/**             | Service layer |
| **src/api/subscribers/**          | Event subscribers |
| **src/api/validators/**           | Custom validators, which can be used in the request classes |
| **src/api/resolvers/**            | GraphQL resolvers (query, mutation & field-resolver) |
| **src/api/types/**                | GraphQL types ,input-types and scalar types |
| **src/api/** schema.gql           | Generated GraphQL schema |
| **src/api/** swagger.json         | Swagger documentation |
| **src/decorators/**               | Custom decorators like @Logger & @EventDispatch |
| **src/loaders/**                  | Loader is a place where you can configure the app |
| **src/public/**                   | Static assets (fonts, css, js, img). |
| **src/types/** *.d.ts             | Custom type definitions and files that aren't on DefinitelyTyped |
| **test**                          | Tests |
| **test/e2e/** *.test.ts           | End-2-End tests (like e2e) |
| **test/integration/** *.test.ts   | Integration test with SQLite3 |
| **test/unit/** *.test.ts          | Unit tests |
| .env.example                      | Environment configurations |
| .env.test                         | Test environment configurations |
| mydb.sql                          | SQLite database for integration tests. Ignored by git and only available after integration tests |

## ❯ Further Documentations

| Name & Link                       | Description                       |
| --------------------------------- | --------------------------------- |
| [Express](https://expressjs.com/) | Express is a minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications. |
| [Microframework](https://github.com/pleerock/microframework) | Microframework is a simple tool that allows you to execute the modules in a proper order, helping you to organize bootstrap code in the application. |
| [TypeDI](https://github.com/pleerock/typedi) | Dependency Injection for TypeScript. |
| [routing-controllers](https://github.com/pleerock/routing-controllers) | Create structured, declarative and beautifully organized class-based controllers with heavy decorators usage in Express / Koa using TypeScript and Routing Controllers Framework. |
| [TypeORM](http://typeorm.io/#/) | TypeORM is highly influenced by other ORMs, such as Hibernate, Doctrine and Entity Framework. |
| [class-validator](https://github.com/pleerock/class-validator) | Validation made easy using TypeScript decorators. |
| [class-transformer](https://github.com/pleerock/class-transformer) | Proper decorator-based transformation / serialization / deserialization of plain javascript objects to class constructors |
| [event-dispatcher](https://github.com/pleerock/event-dispatch) | Dispatching and listening for application events in Typescript |
| [Helmet](https://helmetjs.github.io/) | Helmet helps you secure the Express apps by setting various HTTP headers. It’s not a silver bullet, but it can help! |
| [Auth0 API Documentation](https://auth0.com/docs/api/management/v2) | Authentification service |
| [Jest](http://facebook.github.io/jest/) | Delightful JavaScript Testing Library for unit and e2e tests |
| [supertest](https://github.com/visionmedia/supertest) | Super-agent driven library for testing node.js HTTP servers using a fluent API |
| [nock](https://github.com/node-nock/nock) | HTTP mocking and expectations library |
| [DataLoader Documentation](https://github.com/facebook/dataloader) | DataLoader is a generic utility to be used as part of the application's data fetching layer to provide a consistent API over various backends and reduce requests to those backends via batching and caching. |

## ❯ License

[MIT](/LICENSE)


### Notes

```
error: [api:middlewares/ErrorHandlerMiddleware] TypeError: callback is not a function
    at /Users/longle/Documents/Workspace/faptv/faptv-api/node_modules/mongoose/lib/statemachine.js:140:14
    at Array.map (<anonymous>)
    at ctor.map (/Users/longle/Documents/Workspace/faptv/faptv-api/node_modules/mongoose/lib/statemachine.js:137:29)
    at _loop_1 (/Users/longle/Documents/Workspace/faptv/faptv-api/src/TransformOperationExecutor.ts:124:47)
```

This is because the result of api is in form of mongoose document. need to change to json before sending back by using .toJSON(). I put an interceptor to do that
