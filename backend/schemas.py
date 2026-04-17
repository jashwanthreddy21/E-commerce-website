from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# Token 
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User 
class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    nickname: Optional[str] = None
    phone_number: Optional[str] = None

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    nickname: Optional[str] = None
    phone_number: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    class Config:
        from_attributes = True

# Review
class ReviewBase(BaseModel):
    rating: int
    comment: Optional[str] = None

class ReviewCreate(ReviewBase):
    pass

class Review(ReviewBase):
    id: int
    product_id: int
    user_id: int
    created_at: datetime
    user: UserBase

    class Config:
        from_attributes = True

# Product
class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    stock: int
    image_url: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    reviews: List[Review] = []

    class Config:
        from_attributes = True

# Cart
class CartItemBase(BaseModel):
    product_id: int
    quantity: int

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    user_id: int
    product: Product
    class Config:
        from_attributes = True

# Order
class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price_at_time: float
    
class OrderItem(OrderItemBase):
    id: int
    product: Product
    class Config:
        from_attributes = True

class OrderCreate(BaseModel):
    pass # Order creation assumes all cart items are moved to order

class Order(BaseModel):
    id: int
    user_id: int
    total_amount: float
    status: str
    created_at: datetime
    items: List[OrderItem] = []
    class Config:
        from_attributes = True

# Wishlist
class WishlistItemCreate(BaseModel):
    product_id: int

class WishlistItem(BaseModel):
    id: int
    user_id: int
    product_id: int
    product: Product
    created_at: datetime

    class Config:
        from_attributes = True
