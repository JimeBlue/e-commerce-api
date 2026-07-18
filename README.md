# eCommerce API

A backend API for an eCommerce platform, built with Express, TypeScript, MongoDB/Mongoose, and Zod. Built as a solo module project for WBS Coding School.

## 🚀 Quick Start

### Setup

```bash
# Clone the repository
git clone https://github.com/JimeBlue/e-commerce-api.git
cd e-commerce-api

# Install dependencies
npm install

# Create your local env file
cp .env.example .env.development.local
# then fill in MONGODB_URI with your MongoDB Atlas (or local) connection string

# Start development
npm run dev
```

### Environment Variables

| Variable      | Description                |
| ------------- | --------------------------- |
| `PORT`        | Port the server listens on  |
| `MONGODB_URI` | MongoDB connection string   |

## 📁 Project Structure

```bash
.
├── src
│   ├── app.ts                # Application entry point
│   ├── db/                   # MongoDB connection setup
│   ├── controllers/           # Request handlers per resource
│   ├── middleware/            # validateBody, validateParams, validateQuery, errorHandler, notFoundHandler
│   ├── models/                 # Mongoose schemas (User, Category, Product, Order)
│   ├── routes/                 # Express routers per resource
│   └── schemas/                # Zod schemas for request/response validation
├── package.json
└── tsconfig.json
```

## 🛠 Available Scripts

| Command         | Description                                                 |
| ---------------- | ------------------------------------------------------------ |
| `npm run dev`   | Start development server with file watching and hot reload   |
| `npm run build` | Compile TypeScript to JavaScript                              |
| `npm run start` | Build and run the production version                          |

## 📚 API Overview

All resources follow the same REST pattern: `GET /`, `POST /`, `GET /:id`, `PUT /:id`, `DELETE /:id`.

| Resource     | Base route     | Notes                                                                                                       |
| ------------ | -------------- | ------------------------------------------------------------------------------------------------------------ |
| Users        | `/users`       | Passwords are never returned in responses                                                                   |
| Categories   | `/categories`  |                                                                                                                |
| Products     | `/products`    | `GET /products` supports an optional `?categoryId=` filter; rejects unknown `categoryId` on create/update    |
| Orders       | `/orders`      | Rejects unknown `userId`/`productId`; `total` is computed server-side from current product prices            |

Request bodies and query strings are validated with Zod before reaching a controller; validation errors and other failures return a JSON `{ message }` body with the appropriate status code. Unmatched routes return `404`.

## 🔧 Tech Stack

- **Express 5** + **TypeScript** (native ESM, path aliases with the `#` prefix)
- **Mongoose** for MongoDB modeling and querying
- **Zod** for request/response schema validation
