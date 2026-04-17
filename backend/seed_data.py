from .database import SessionLocal, engine, Base
from .models import User, Product
from .services.auth import get_password_hash

def seed_db():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    # Check if admin already exists
    admin = db.query(User).filter(User.email == "admin@ecommerce.com").first()
    if not admin:
        print("Creating admin user...")
        admin = User(
            email="admin@ecommerce.com",
            hashed_password=get_password_hash("adminpassword"),
            full_name="Admin User",
            is_admin=True
        )
        db.add(admin)
        
    user = db.query(User).filter(User.email == "user@ecommerce.com").first()
    if not user:
        print("Creating test user...")
        user = User(
            email="user@ecommerce.com",
            hashed_password=get_password_hash("userpassword"),
            full_name="Test User",
            is_admin=False
        )
        db.add(user)

    # Check for products
    if db.query(Product).count() == 0:
        print("Creating products...")
        products = [
            Product(name="Premium Wireless Headphones", description="High-quality noise-canceling headphones.", price=299.99, stock=50, image_url="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"),
            Product(name="Smart Watch Series X", description="Track your fitness and stay connected.", price=199.99, stock=30, image_url="https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop"),
            Product(name="Mechanical Keyboard", description="RGB mechanical keyboard for gamers and typists.", price=129.99, stock=100, image_url="https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop"),
            Product(name="4K Ultra HD Monitor", description="Stunning 27-inch 4K monitor for productivity.", price=349.99, stock=20, image_url="https://images.unsplash.com/photo-1527443195645-1133f7f28990?q=80&w=1000&auto=format&fit=crop"),
            Product(name="Ergonomic Mouse", description="Comfortable wireless mouse with multi-device support.", price=49.99, stock=150, image_url="https://images.unsplash.com/photo-1527814050087-379381547969?q=80&w=1000&auto=format&fit=crop"),
        ]
        db.add_all(products)
        
    db.commit()
    db.close()
    print("Seed complete.")

if __name__ == "__main__":
    seed_db()
