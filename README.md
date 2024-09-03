# TAK-22_Frontend1_FINAL
Viimaste õppeväljundite hindamise töö.

## What needs to be done?

This assignment's point is to create a fully functional backend REST API with token-based authorization and a frontend application that interacts with the backend. There are two main features: TODO application and integration with OpenWeatherAPI.

## Backend REST API

Authentication (All endpoints will be protected by token)
-  Create an endpoint that responds with [OpenWeatherAPI](https://openweathermap.org/api) data.
-  Implement TODO application endpoints
  -  Data can be saved in a local array, having a database will give extra credits
  -  Create CRUD operations (CREATE, READ, UPDATE, DELETE) endpoints

### Requirements

#### Authentication
-  Implement token-based authentication for your backend
-  All endpoints must be protected by the token (hint: middleware)
  
#### OpenWeatherAPI Integration
-  Create an endpoint that fetches and responds with data from the OpenWeatherAPI.
- The data should be fetched dynamically based on parameters (e.g., city name) provided by the client/frontend.

#### TODO application
- Implement RESTful endpoints for your TODO actions
- Each TODO has this data structure:
  - **id**
  - **title** 
  - **description** 
  - **status** (pending, in-progress, done) 
  - **createdAt** 
  - **updatedAt**
 
- CRUD resources will be:
  - **CREATE**
  - **READ**
  - **UPDATE**
  - **DELETE**
 
#### Data management
- Data can be stored to a local array
- Data can be stored in a database (MySQL, MongoDB, etc..). When stored in the database, probably need to add some kind of ORM package.

#### Additional Information
- All endpoints must have error handling done and responses must have correct format like HTTP statuses and messages.

## Frontend Development
  - Choose a framework (React/Vue etc..)
  - Develop a login feature to get authenticated and retrieve the token for accessing endpoints
  - Create an interface for managing the TODO application.
  - Create an interface for managing OpenWeatherAPI data.
    - This includes a way to hand parameters to API calls (like city-name)

## Documentation

#### API documentation
- Use POSTMAN to create detailed documentation of API endpoints
- Both backend and frontend repos must have detailed README with installation steps and requirements.
