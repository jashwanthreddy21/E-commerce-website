from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..services.auth import get_current_user, get_current_admin

router = APIRouter(prefix="/orders", tags=["Orders"])

@router.post("/", response_model=schemas.Order, status_code=status.HTTP_201_CREATED)
def create_order(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    cart_items = db.query(models.CartItem).filter(models.CartItem.user_id == current_user.id).all()
    
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")
        
    total_amount = 0
    for item in cart_items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        if not product or product.stock < item.quantity:
            raise HTTPException(status_code=400, detail=f"Product {item.product_id} not available in requested quantity")
        total_amount += product.price * item.quantity
        
    new_order = models.Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status="Pending"
    )
    db.add(new_order)
    db.commit()
    db.refresh(new_order)
    
    for item in cart_items:
        product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
        # Deduct stock
        product.stock -= item.quantity
        
        order_item = models.OrderItem(
            order_id=new_order.id,
            product_id=item.product_id,
            quantity=item.quantity,
            price_at_time=product.price
        )
        db.add(order_item)
        # Remove from cart
        db.delete(item)
        
    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/", response_model=List[schemas.Order])
def get_user_orders(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.Order).filter(models.Order.user_id == current_user.id).all()

@router.get("/all", response_model=List[schemas.Order])
def get_all_orders(db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    return db.query(models.Order).all()

@router.put("/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, status_str: str, db: Session = Depends(get_db), current_admin: models.User = Depends(get_current_admin)):
    order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.status = status_str
    db.commit()
    db.refresh(order)
    return order
