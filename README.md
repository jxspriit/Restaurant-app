# Copperleaf Kitchen — MERN Restaurant Ordering Platform

React (Vite) + Tailwind + Router + Axios + Context API + Framer Motion | Node + Express + MongoDB Atlas + JWT + bcrypt + Multer

## Backend
```
cd backend
npm install
cp .env.example .env     # fill in MONGO_URI and JWT_SECRET
npm run seed             # creates admin@copperleaf.com / Admin@123 + 14 dishes
npm run dev              # http://localhost:5000
```

## Frontend
```
cd frontend
npm install
cp .env.example .env
npm run dev              # http://localhost:5173
```

## Features
- Register/login (bcrypt + JWT), session restore, protected routes -> /login redirect
- Menu: search, category, veg filter, sort by price/rating/popularity
- Cart (persisted), checkout, order history, order tracker, cancel while Pending
- Admin (/admin, role-gated): stats, food CRUD + image upload, order status, users/roles, reviews, settings

## API
Auth: POST /api/auth/register|login|logout, GET|PUT /api/auth/me
Foods: GET /api/foods(/:id), POST|PUT|DELETE (admin)
Orders: POST /api/orders, GET /api/orders/my-orders, GET /api/orders/:id, PUT /api/orders/:id/cancel
Admin: GET /api/admin/stats|orders|users, PUT /api/admin/orders/:id/status, PUT /api/admin/users/:id/role, DELETE /api/admin/users/:id
Reviews: GET|POST /api/reviews, DELETE /api/reviews/:id

Note: seeded dishes have no images (placeholder shown); upload real ones via Admin > Edit Food.
