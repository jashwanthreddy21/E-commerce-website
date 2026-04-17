from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import models, schemas
from ..database import get_db
from ..services.auth import get_current_user

router = APIRouter(prefix="/wishlist", tags=["Wishlist"])

@router.get("/", response_model=List[schemas.WishlistItem])
def get_wishlist(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    """Return all wishlist items for the current user."""
    return current_user.wishlist_items

@router.post("/", response_model=schemas.WishlistItem, status_code=status.HTTP_201_CREATED)
def add_to_wishlist(
    item: schemas.WishlistItemCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Add a product to the current user's wishlist. Ignores duplicates."""
    product = db.query(models.Product).filter(models.Product.id == item.product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check if already wishlisted
    existing = db.query(models.WishlistItem).filter(
        models.WishlistItem.user_id == current_user.id,
        models.WishlistItem.product_id == item.product_id
    ).first()
    if existing:
        return existing

    new_item = models.WishlistItem(user_id=current_user.id, product_id=item.product_id)
    db.add(new_item)
    db.commit()
    db.refresh(new_item)
    return new_item

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_from_wishlist(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Remove a product from the current user's wishlist."""
    item = db.query(models.WishlistItem).filter(
        models.WishlistItem.user_id == current_user.id,
        models.WishlistItem.product_id == product_id
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")

    db.delete(item)
    db.commit()
    return None
