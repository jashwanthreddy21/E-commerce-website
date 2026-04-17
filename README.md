# Premium E-Commerce Application

A complete, production-ready Full-Stack E-Commerce Web Application built with React (Vite) and FastAPI.

## Tech Stack
- **Frontend**: React (Vite, Hooks, Context API) + Axios, Lucide Icons
- **Backend**: FastAPI (Python), SQLAlchemy, Pydantic, Passlib, JWT Auth
- **Database**: SQLite (Default for local development) / MySQL (Configurable via `.env` or `docker-compose`)

---

## Backend Setup Instructions

### Prerequisites
- Python 3.9+
- Pip / Venv

### Installation

1. Open a terminal and navigate to the root directory `E-Commercial`.
2. Create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
4. Configure Database:
   - By default, it will use a local SQLite database (`sql_app.db`).
   - If you want to use MySQL, either run `docker-compose up -d` (requires Docker) and then set the `.env` file variables (see `backend/core/config.py`).

5. Seed the database with initial products and users:
   ```bash
   python -m backend.seed_data
   ```

### Running the API
From the root directory, with the virtual environment activated:
```bash
uvicorn backend.main:app --reload
```
The FastAPI backend will run at `http://localhost:8000`. You can view the automatic Swagger API documentation at `http://localhost:8000/docs`.

---

## Frontend Setup Instructions

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Running

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install npm dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

The frontend will run at `http://localhost:5173` by default.

---

## Features Implemented
- **JWT Authentication**: User registration and login mechanics.
- **Product Store**: Beautiful grid to search and buy products.
- **Cart System**: Persisted Cart data tied to your user.
- **Checkout Process**: Converting a Cart into an Order while reducing Product inventory stock.
- **Order History**: Dashboard for normal users to track past purchases.
- **Admin Dashboard**: Accessible by the admin user. Can be used to view **all** customer orders, manage statuses ("Processing", "Shipped"), add new inventory, and remove inventory.

### Test Accounts (Injected via seed_data)
**Admin:** 
- Email: `admin@ecommerce.com`
- Password: `adminpassword`

**User:**
- Email: `user@ecommerce.com`
- Password: `userpassword`
# E-commerce-website
