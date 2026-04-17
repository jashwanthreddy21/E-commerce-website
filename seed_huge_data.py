import random
from backend.database import SessionLocal, engine, Base
from backend.models import Product

def seed_large_db():
    print("Connecting to database...")
    db = SessionLocal()
    
    # Categories and modifiers for random product generation
    categories = [
        "Headphones", "Smartphone", "Laptop", "Monitor", "Keyboard", 
        "Mouse", "Tablet", "Smartwatch", "Camera", "Microphone", "Speakers"
    ]
    brands = ["Aero", "Nexus", "Zenith", "Quantum", "Pulse", "Vortex", "Apex", "Horizon", "Nebula", "Lumina"]
    adjectives = ["Pro", "Max", "Ultra", "Elite", "Advanced", "Plus", "V2", "X", "One", "Series"]
    
    # Real Unsplash premium tech product images
    images = [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop", # Headphones
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1000&auto=format&fit=crop", # Watch
        "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000&auto=format&fit=crop", # Laptop
        "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=1000&auto=format&fit=crop", # Laptop
        "https://images.unsplash.com/photo-1527443195645-1133f7f28990?q=80&w=1000&auto=format&fit=crop", # Monitor
        "https://images.unsplash.com/photo-1588702581069-8fdced1eb189?q=80&w=1000&auto=format&fit=crop", # Phone
        "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop", # Keyboard
        "https://images.unsplash.com/photo-1527814050087-379381547969?q=80&w=1000&auto=format&fit=crop", # Mouse
        "https://images.unsplash.com/photo-1533228876829-65c94e7b5025?q=80&w=1000&auto=format&fit=crop", # Speaker
        "https://images.unsplash.com/photo-1514432324607-a2bc7f1b7454?q=80&w=1000&auto=format&fit=crop"  # Camera
    ]

    print("Generating 800 premium products...")
    new_products = []
    
    for i in range(800):
        category = random.choice(categories)
        brand = random.choice(brands)
        adj = random.choice(adjectives)
        
        name = f"{brand} {category} {adj}"
        description = f"Experience the pinnacle of {category.lower()} technology with the {name}. Designed for professionals and enthusiasts lacking top-tier performance, sleek modern design, and robust durability. Perfect for your everyday premium lifestyle."
        price = round(random.uniform(29.99, 1999.99), 2)
        stock = random.randint(0, 500)
        image_url = random.choice(images)
        
        product = Product(
            name=name,
            description=description,
            price=price,
            stock=stock,
            image_url=image_url
        )
        new_products.append(product)
        
        # Batch insert every 100 records for performance
        if len(new_products) == 100:
            db.bulk_save_objects(new_products)
            db.commit()
            new_products.clear()
            print(f"Inserted batch... ({i+1}/800)")
            
    if new_products:
        db.bulk_save_objects(new_products)
        db.commit()

    db.close()
    print("Successfully added 800 products to the database!")

if __name__ == "__main__":
    seed_large_db()
