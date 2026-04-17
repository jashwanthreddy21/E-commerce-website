import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Eye, Heart, Share2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { formatPrice } = useLocation();
  const { wishlistIds, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const isWishlisted = wishlistIds.has(product.id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { navigate('/login'); return; }
    toggleWishlist(product.id);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/product/${product.id}`;
    if (navigator.share) {
      navigator.share({ title: product.name, url });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        alert('Product link copied to clipboard!');
      });
    }
  };

  return (
    <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <Link to={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', flexDirection: 'column' }}>
        <div className="card-img-wrapper" style={{ height: '240px', position: 'relative' }}>
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', transition: 'var(--transition)' }}
            />
          ) : (
            <div style={{ color: 'var(--text-muted)' }}>No Image</div>
          )}
          {product.stock === 0 && (
            <div style={{ position: 'absolute', top: '1rem', right: '1rem', zIndex: 2 }} className="badge badge-primary">
              Sold Out
            </div>
          )}
        </div>

        <div style={{ padding: '1.8rem 1.8rem 0 1.8rem', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.2s' }} onMouseOver={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseOut={(e) => e.currentTarget.style.color = 'inherit'}>
              {product.name}
            </h3>
          </div>
        </div>
      </Link>

      <div style={{ padding: '0 1.8rem 1.8rem 1.8rem', flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--surface)' }}>
        {/* Price row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)', letterSpacing: '-0.02em' }}>
            {formatPrice(product.price)}
          </span>
          {/* Wishlist & Share under price */}
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={handleWishlist}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              style={{
                background: 'none',
                border: `1.5px solid ${isWishlisted ? '#ef4444' : 'var(--border)'}`,
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: isWishlisted ? '#ef4444' : 'var(--text-muted)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = isWishlisted ? '#ef4444' : 'var(--border)'; e.currentTarget.style.color = isWishlisted ? '#ef4444' : 'var(--text-muted)'; }}
            >
              <Heart size={16} fill={isWishlisted ? '#ef4444' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              title="Share product"
              style={{
                background: 'none',
                border: '1.5px solid var(--border)',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                color: 'var(--text-muted)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(139,92,246,0.08)'; e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>

        {/* View & Add to Cart row */}
        <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.75rem' }}>
          <Link to={`/product/${product.id}`} className="btn btn-secondary" style={{ padding: '0.6rem', borderRadius: '50%', flexShrink: 0 }} title="View details">
            <Eye size={18} />
          </Link>
          <button
            className="btn btn-primary"
            style={{ flex: 1, padding: '0.6rem' }}
            onClick={() => addToCart(product.id, 1)}
            disabled={product.stock === 0}
            title={product.stock === 0 ? 'Out of stock' : 'Add to cart'}
          >
            <ShoppingCart size={18} />
            {product.stock === 0 ? ' Out of Stock' : ' Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
