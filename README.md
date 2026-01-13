# Order Service API

A **Node.js + Express + MongoDB** backend API for managing users, products, and orders with authentication, transactions, and role-based access control.

---

## Table of Contents

1. [Features](#features)  
2. [Tech Stack](#tech-stack)  
3. [Getting Started](#getting-started)  
4. [Environment Variables](#environment-variables)  
5. [Project Structure](#project-structure)  
6. [API Endpoints](#api-endpoints)  
7. [Curl Examples](#curl-examples)  
8. [Design Notes](#design-notes)  
9. [Future Improvements](#future-improvements)  

---

## Features

- User registration & login with JWT authentication  
- Role-based access (admin vs customer)  
- Create, list, and update products (admin only)  
- Create, list, pay, and cancel orders  
- Transaction-safe stock updates  
- Proper validation using Zod  
- Centralized error handling and logging  
- Demo-ready via curl commands

---

## Tech Stack

- Node.js (v25+)  
- Express.js  
- MongoDB (Atlas recommended)  
- Mongoose (ODM)  
- Zod (validation)  
- JWT (authentication)  


---

## Getting Started



1. **Install dependencies**

```bash
npm install
```

2. **Set environment variables** (see next section)  

3. **Start the server**

```bash
npm start
```

Server will run on `http://localhost:3000`

---

## Environment Variables

Create a `.env` file in the root folder with:

```
MONGO_URI=<MongoDB Atlas URI>
JWT_SECRET=<secret for JWT>
PORT=3000
```

Example:

```
MONGO_URI=mongodb+srv://small_order_api_user:XJdqhQLt9uN8DqXe@orderuser.c53tdnv.mongodb.net/order_service_db?retryWrites=true&w=majority
JWT_SECRET=Taifa_dYrtg
PORT=3000
```

---

## Project Structure

```
src/
 ├ app.js            # Entry point
 ├ routes/           # API endpoints
 ├ controllers/      # Thin controllers
 ├ services/         # Business logic & transactions
 ├ repositories/     # DB operations
 ├ middlewares/      # Auth, error handling
 ├ validations/      # Zod schemas
 ├ models/           # Mongoose models
 └ utils/            # Helpers / scripts (e.g., makeAdmin.js)
```

---

## API Endpoints

### Auth

- `POST /auth/register` → Register user  
- `POST /auth/login` → Login and return JWT  

### Products

- `POST /products` → Admin only, create product  
- `GET /products` → Public, list products  
- `PATCH /products/:id` → Admin only, update product  

### Orders

- `POST /orders` → Customer only, create order  
- `GET /orders` → Customers see own orders, admin sees all  
- `POST /orders/:id/pay` → Pay an order (idempotent)  
- `POST /orders/:id/cancel` → Cancel order and restore stock

---

## Curl Examples

### Admin: Create Product

```bash
curl -X POST http://localhost:3000/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <ADMIN_TOKEN>" \
-d '{
  "name": "Laptop",
  "price": 100000,
  "stock": 5
}'
```

### Customer: Register

```bash
curl -X POST http://localhost:3000/auth/register \
-H "Content-Type: application/json" \
-d '{"email":"Kiambu@mail.com","password":"123456"}'
```

### Customer: Login

```bash
curl -X POST http://localhost:3000/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"Kiambu@mail.com","password":"123456"}'
```

### Customer: Create Order

```bash
curl -X POST http://localhost:3000/orders \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <CUSTOMER_TOKEN>" \
-d '{
  "items": [{"productId":"PRODUCT_ID","quantity":2}]
}'
```

### Customer: Pay Order

```bash
curl -X POST http://localhost:3000/orders/ORDER_ID/pay \
-H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

### Customer: Cancel Order

```bash
curl -X POST http://localhost:3000/orders/ORDER_ID/cancel \
-H "Authorization: Bearer <CUSTOMER_TOKEN>"
```

---

## Design Notes

- **Separation of concerns:** thin controllers, meaningful services, repositories handle DB.  
- **Transaction safety:** stock updates and cancel operations are atomic.  
- **Validation:** Zod schemas prevent invalid input (negative stock, non-existent products).  
- **Security:** hashed passwords, JWT verification, role-based access control.  
- **Error handling:** consistent status codes for edge cases like duplicate email, already paid, or cancelled orders.

---

## Future Improvements

- Dockerize with MongoDB included for easy deployment  
- Rate-limiting for auth endpoints  
- Advanced reporting and analytics for admin
