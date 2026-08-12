# Valerion — AI-Powered Luxury Fashion E-Commerce

A full-stack MERN e-commerce platform for a luxury fashion house, built around a
natural-language **AI Fashion Assistant** that recommends products from a chat
interface, plus a full admin panel for managing inventory, orders, and customers.

**Live Demo:** _add your Vercel URL here after deploying_
**GitHub Repository:** _add your repo URL here after pushing_

## Screenshots

_Add screenshots here once you run the app locally — e.g.:_
- Homepage hero + featured products
- AI Fashion Assistant in conversation
- Product listing with filters
- Admin dashboard

```
![Homepage](./screenshots/home.png)
![AI Assistant](./screenshots/ai-assistant.png)
![Admin Dashboard](./screenshots/admin-dashboard.png)
```

## Features

### Customer-facing
- **Home** — hero section, featured products, shoppable collections, testimonials
- **Products** — listing with live search, category filter, price range filter
- **Product Details** — sizes, quantity, wishlist toggle, add to cart
- **Auth** — register/login (JWT), persistent session
- **Profile** — edit name/phone/shipping address
- **Wishlist** — save/remove products
- **Cart** — quantity edit, remove, live subtotal/shipping/tax calculation
- **Checkout** — Razorpay sandbox payment flow, order creation
- **Orders** — order history with live status

### 🤖 Valerion AI Fashion Assistant
A floating chat widget (bottom-right, on every page) where a shopper can type
something like:

> "I need a black outfit for a formal evening."

...and the assistant replies in natural language with a styled recommendation,
then shows the matching products inline in the chat:

> "Based on your preference for a formal evening, I recommend our Black Silk
> Evening Dress, paired beautifully with our Onyx Velvet Wrap Gown. I've pulled
> 2 pieces below that match what you're after."

**How it works:** `backend/utils/aiEngine.js` parses the message for occasion,
color, category, and budget ("under ₹20,000"), builds a MongoDB query from
that intent, and falls back to full-text search across product name/description/
tags if nothing matches structurally. It ships with **zero external API
dependency**, so the project runs end-to-end without any paid key.

To upgrade it to a true LLM-backed assistant, swap `interpretQuery()` in that
file for a call to an LLM API (e.g. the Anthropic Messages API) that returns
the same `{ occasion, color, category, maxPrice, keywords }` shape — everything
downstream (matching, reply generation, rendering) stays the same.

### 🔐 Admin Panel
- Admin-only login (role-based JWT guard)
- Dashboard: revenue, order count, customer count, order-status breakdown, low-stock alerts
- Products: add / edit / delete, inventory table, stock levels
- Orders: view all orders, update status (Pending → Confirmed → Shipped → Delivered)
- Customers: view registered customers

### 💳 Payment
Integrated with **Razorpay's test/sandbox environment**. No real charges are
possible — the checkout uses `rzp_test_` keys only. If no key is configured,
checkout falls back to a "demo paid" flow so the order pipeline can still be
reviewed end-to-end without a Razorpay account.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router, Tailwind CSS, Vite, Axios |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB + Mongoose |
| Auth | JWT, bcrypt password hashing |
| AI | Custom natural-language intent parser + recommendation engine |
| Payments | Razorpay (test/sandbox) |
| Tools | Git, GitHub, Figma (for design), Vercel (frontend hosting) |

## Project Structure

```
valerion/
├── backend/
│   ├── config/db.js
│   ├── controllers/        # auth, product, order, user, ai, admin
│   ├── middleware/         # JWT auth guard, admin guard, error handler
│   ├── models/              # User, Product, Order
│   ├── routes/
│   ├── seed/                 # sample luxury products + default admin user
│   ├── utils/aiEngine.js    # the AI Fashion Assistant logic
│   └── server.js
└── frontend/
    └── src/
        ├── api/axios.js
        ├── context/          # AuthContext, CartContext
        ├── components/      # Navbar, Footer, ProductCard, AIAssistant, etc.
        └── pages/
            └── admin/         # Dashboard, Products, Orders, Customers
```

## Installation

### Prerequisites
- Node.js 18+
- A MongoDB database — either local (`mongod`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster

### 1. Clone and install

```bash
git clone <your-repo-url> valerion
cd valerion

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

```bash
# backend/.env
cp backend/.env.example backend/.env
# then fill in MONGO_URI and JWT_SECRET

# frontend/.env
cp frontend/.env.example frontend/.env
# optional: add a Razorpay test key
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

This creates 15 sample luxury products and a default admin account:
- **Email:** `admin@valerion.com`
- **Password:** `Admin@12345`

### 4. Run both servers

```bash
# Terminal 1
cd backend
npm run dev        # http://localhost:5000

# Terminal 2
cd frontend
npm run dev        # http://localhost:5173
```

The Vite dev server proxies `/api` requests to the backend, so no CORS
configuration is needed locally.

## API Documentation

Base URL: `/api`

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Create an account |
| POST | `/auth/login` | Log in, returns JWT |
| GET | `/auth/me` | Get current user (auth required) |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List/search/filter products — `?search=&category=&minPrice=&maxPrice=&color=&occasion=&page=&limit=` |
| GET | `/products/featured` | Featured products for homepage |
| GET | `/products/:id` | Single product |
| POST | `/products` | Create product (admin) |
| PUT | `/products/:id` | Update product (admin) |
| DELETE | `/products/:id` | Delete product (admin) |

### AI Assistant
| Method | Endpoint | Description |
|---|---|---|
| POST | `/ai/assistant` | `{ message: string }` → `{ reply, intent, products }` |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET / PUT | `/users/profile` | Get/update profile (auth) |
| GET / POST / DELETE | `/users/wishlist(/:productId)` | Manage wishlist (auth) |
| GET / POST / PUT / DELETE | `/users/cart(/:itemId)` | Manage cart (auth) |
| GET | `/users` | List customers (admin) |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/orders` | Create order from cart items (auth) |
| GET | `/orders/my` | Current user's orders (auth) |
| GET | `/orders/:id` | Single order (owner or admin) |
| PUT | `/orders/:id/pay` | Mark order paid after Razorpay success (auth) |
| GET | `/orders` | All orders (admin) |
| PUT | `/orders/:id/status` | Update order status (admin) |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/admin/dashboard` | Revenue, order/customer/product counts, low-stock list (admin) |

All protected routes require `Authorization: Bearer <token>`.

## Deployment

1. **Database:** create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas), whitelist your deployment IPs, and copy the connection string into `MONGO_URI`.
2. **Backend:** deploy the `backend/` folder to [Render](https://render.com) or [Railway](https://railway.app). Set `MONGO_URI`, `JWT_SECRET`, and `CLIENT_URL` (your deployed frontend URL) as environment variables.
3. **Frontend:** deploy the `frontend/` folder to [Vercel](https://vercel.com). Set `VITE_RAZORPAY_KEY_ID` if using real sandbox checkout, and update the Vite proxy / API base URL to point at your deployed backend (or set `VITE_API_URL` and adjust `src/api/axios.js`).
4. Run `npm run seed` once against your production `MONGO_URI` to populate sample data.

## Future Improvements

- Replace the rule-based AI engine with a true LLM call (Anthropic/OpenAI) for richer conversational styling and multi-turn context
- Add product reviews and ratings submission
- Add order tracking with shipment status webhooks
- Add image upload (Cloudinary/S3) instead of external image URLs in the admin panel
- Add pagination controls and infinite scroll on the product listing page
- Add unit/integration tests (Jest + Supertest for the API, React Testing Library for the frontend)
- Add a size-guide and virtual try-on style visual aid
- Multi-currency support

## License
Portfolio project — not a real store. Built for demonstration purposes.
