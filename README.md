#JerseyHaat Shop - Full Stack E-Commerce Application

A luxury football jersey e-commerce web application built with the MERN stack (MongoDB, Express, React, Node.js) featuring a gold & dark premium theme.

## Project Structure

```
voute-jersey-shop/
├── backend/          # Node.js + Express + MongoDB API
├── frontend/         # React + Vite + Tailwind CSS Shop
└── admin/            # React + Vite + Tailwind CSS Admin Panel
```

## Features

### Frontend (Customer-facing)
- **Homepage**: Hero banner carousel, club categories, featured products, new arrivals, best sellers
- **Shop Page**: Full product grid with filters (club, type, price, badge), sorting, pagination
- **Club Pages**: Club-branded pages showing all jerseys for a specific club
- **Product Pages**: Detailed product view with image gallery, size selector, color swatches, quantity stepper
- **Cart**: Slide-out cart sidebar with quantity controls, localStorage persistence
- **Checkout**: Full checkout form with bKash, Nagad, Card, COD payment options
- **Image Fallback**: Dynamic SVG jersey generation when backend images are unavailable

### Backend (API)
- **RESTful API** with Express.js
- **MongoDB** with Mongoose ODM
- **Cloudinary** integration for image uploads
- **Full CRUD** for products, clubs, banners, and orders
- **Order management** with stock validation
- **Admin authentication** via token

### Admin Panel
- **Dashboard** with order statistics
- **Product Management**: CRUD with image upload, size/color management
- **Club Management**: CRUD with logo upload
- **Banner Management**: CRUD with image upload
- **Order Management**: View orders, update status, filter by status

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router |
| Backend | Node.js, Express.js, MongoDB, Mongoose |
| Images | Cloudinary, AI-generated fallback SVGs |
| Auth | Bearer token admin authentication |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally or MongoDB Atlas
- Cloudinary account (optional - has SVG fallback)

### 1. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/voute_jersey
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
ADMIN_TOKEN=voute_admin_secret_2025
FRONTEND_URL=http://localhost:5173
```

Start the server:
```bash
npm start
# or for development with nodemon:
npm run dev
```

### 2. Frontend Setup

```bash
cd frontend
npm install
```

The `.env` file is already configured:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the dev server:
```bash
npm run dev
```

### 3. Admin Panel Setup

```bash
cd admin
npm install
```

The `.env` file is already configured:
```env
VITE_API_URL=http://localhost:5000/api
VITE_ADMIN_TOKEN=voute_admin_secret_2025
```

Start the admin dev server:
```bash
npm run dev
```

## API Endpoints

### Clubs
- `GET /api/clubs` - Get all active clubs
- `GET /api/clubs/:slug` - Get club by slug with products
- `POST /api/clubs` - Create club (admin)
- `PUT /api/clubs/:id` - Update club (admin)
- `DELETE /api/clubs/:id` - Delete club (admin)

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/new` - Get new arrivals
- `GET /api/products/bestsellers` - Get best sellers
- `GET /api/products/club/:clubSlug` - Get products by club
- `GET /api/products/type/:type` - Get products by type
- `GET /api/products/:slug` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Banners
- `GET /api/banners` - Get active banners
- `GET /api/banners/all` - Get all banners (admin)
- `POST /api/banners` - Create banner (admin)
- `PUT /api/banners/:id` - Update banner (admin)
- `DELETE /api/banners/:id` - Delete banner (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get all orders (admin)
- `GET /api/orders/stats` - Get order stats (admin)
- `GET /api/orders/:id` - Get single order
- `PUT /api/orders/:id/status` - Update order status (admin)

## Default Ports

| Service | Port | URL |
|---------|------|-----|
| Backend API | 5000 | http://localhost:5000 |
| Frontend Shop | 5173 | http://localhost:5173 |
| Admin Panel | 5174 | http://localhost:5174 |

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5000) |
| `MONGO_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `ADMIN_TOKEN` | Secret token for admin access |
| `FRONTEND_URL` | Allowed CORS origin |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |

### Admin
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_ADMIN_TOKEN` | Admin auth token (must match backend) |

## Color Palette

| Name | Hex | Usage |
|------|-----|-------|
| Gold | #c9a84c | Primary accent, buttons, highlights |
| Gold Light | #e8d5a3 | Hover states |
| Gold Dark | #a0802c | Scrollbar, borders |
| Dark | #0e0c0a | Main background |
| Dark 2 | #1a1612 | Cards, nav background |
| Dark 3 | #252018 | Borders, dividers |
| Cream | #f5f0e8 | Primary text |
| Text Muted | #9a8a6a | Secondary text |

## License

MIT License - Voûte Jersey Shop 2025
