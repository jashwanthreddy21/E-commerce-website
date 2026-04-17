import sqlite3
import os

def migrate():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    db_path = os.path.join(base_dir, "sql_app.db")
    
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    print("Checking users table schema...")
    cursor.execute("PRAGMA table_info(users)")
    columns = [col[1] for col in cursor.fetchall()]
    
    if "nickname" not in columns:
        print("Adding 'nickname' column...")
        cursor.execute("ALTER TABLE users ADD COLUMN nickname VARCHAR(255)")
    else:
        print("'nickname' column already exists.")
        
    if "phone_number" not in columns:
        print("Adding 'phone_number' column...")
        cursor.execute("ALTER TABLE users ADD COLUMN phone_number VARCHAR(50)")
    else:
        print("'phone_number' column already exists.")
        
    conn.commit()
    conn.close()
    print("Migration finished successfully!")

if __name__ == "__main__":
    migrate()
