import uvicorn
from backend.main import app

if __name__ == "__main__":
    print("Starting Premium E-Commerce API...")
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
