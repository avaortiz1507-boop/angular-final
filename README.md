# Inventory Manager

A small Angular + Tailwind inventory application that connects to the public RESTful API at https://api.restful-api.dev/objects.

## Features

- Dashboard overview with quick stats
- Inventory list with view, edit, and delete actions
- Single item detail page
- Create and edit forms with validation
- Login/account mock page and 404 route
- Full CRUD using Angular HttpClient and the public API

## Project setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the Angular development server:

   ```bash
   npm start
   ```

3. Open the app in your browser at:

   ```text
   http://localhost:4200/
   ```

## Available routes

- `/` — Home dashboard
- `/objects` — Inventory list
- `/objects/new` — Create item form
- `/objects/:id` — Item details
- `/objects/:id/edit` — Edit item form
- `/login` — Account/login mock area
- `*` — Not found route

## API usage

This app uses the public object API:

- GET https://api.restful-api.dev/objects
- GET https://api.restful-api.dev/objects/{id}
- POST https://api.restful-api.dev/objects
- PUT https://api.restful-api.dev/objects/{id}
- PATCH https://api.restful-api.dev/objects/{id}
- DELETE https://api.restful-api.dev/objects/{id}

## Validation notes

The create/edit form validates:

- Name is required and must be at least 3 characters
- Color is required and must be at least 2 characters
- Price is required and cannot be negative
- Submit button stays disabled until the form is valid

## Build

To verify the project compiles:

```bash
npm run build
```
