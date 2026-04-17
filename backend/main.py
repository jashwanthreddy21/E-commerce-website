import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth, products, cart, orders, wishlist

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="E-Commerce API",
    description="API for the Full-Stack E-Commerce Application",
    version="1.0.0"
)

# CORS config — add your Vercel URL here after deploying
origins = [
    "http://localhost:5173",   # Vite dev server
    "http://localhost:3000",   # Alternative React port
    os.getenv("FRONTEND_URL", ""),  # Set this env var on Render to your Vercel URL
]
# Filter out empty strings
origins = [o for o in origins if o]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router)
app.include_router(products.router)
app.include_router(cart.router)
app.include_router(orders.router)
app.include_router(wishlist.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the E-Commerce API"}

@app.get("/health")
def health_check():
    """
    DB health check endpoint.
    Visit: http://localhost:8000/health  (local)
           https://your-app.onrender.com/health  (production)
    """
    from .database import SessionLocal
    from . import models
    try:
        db = SessionLocal()
        users     = db.query(models.User).count()
        products  = db.query(models.Product).count()
        orders    = db.query(models.Order).count()
        wishlist  = db.query(models.WishlistItem).count()
        db.close()
        return {
            "status": "✅ healthy",
            "database": "connected",
            "counts": {
                "users": users,
                "products": products,
                "orders": orders,
                "wishlist_items": wishlist
            }
        }
    except Exception as e:
        return {
            "status": "❌ unhealthy",
            "database": "disconnected",
            "error": str(e)
        }
