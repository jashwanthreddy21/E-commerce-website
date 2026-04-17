import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Star, Send, Heart, Share2 } from 'lucide-react';
import api from '../api/axios';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { formatPrice } = useLocation();
  const { user } = useAuth();
  const { wishlistIds, toggleWishlist } = useWishlist();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  
  // Review state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const submitReview = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to submit a review.");
    
    setSubmittingReview(true);
    try {
      const res = await api.post(`/products/${id}/reviews`, {
        rating: reviewRating,
        comment: reviewComment
      });
      // Append the newly created review containing the user payload locally to avoid refetching everything
      setProduct({ ...product, reviews: [res.data, ...product.reviews] });
      setReviewComment("");
      setReviewRating(5);
    } catch (error) {
      console.error("Error submitting review", error);
      alert("Failed to submit review.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <Star key={i} size={16} fill={i < rating ? "#F59E0B" : "none"} color={i < rating ? "#F59E0B" : "#D1D5DB"} />
    ));
  };

  // Calculate average rating
  const avgRating = product?.reviews?.length 
    ? (product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length).toFixed(1)
    : 0;

  if (loading) return <div className="center-page"><div className="spinner"></div></div>;

  if (!product) return (
    <div className="container center-page" style={{ flexDirection: 'column' }}>
      <h2>Product not found</h2>
      <button className="btn btn-primary mt-4" onClick={() => navigate('/')}>Go Back Home</button>
    </div>
  );

  return (
    <div className="container">
      <button className="btn btn-secondary" style={{ marginBottom: '2rem' }} onClick={() => navigate(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <div className="card" style={{ padding: '2rem' }}>
        <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
          <div style={{ borderRadius: 'var(--radius)', overflow: 'hidden', backgroundColor: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
            ) : (
              <div style={{ color: 'var(--text-muted)' }}>No Image</div>
            )}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {product.stock > 0 ? (
              <span className="badge badge-success" style={{ alignSelf: 'flex-start', marginBottom: '1rem' }}>In Stock ({product.stock})</span>
            ) : (
              <span className="badge" style={{ alignSelf: 'flex-start', marginBottom: '1rem', background: 'var(--error)', color: 'white' }}>Out of Stock</span>
            )}
            
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.025em' }}>{product.name}</h1>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1rem' }}>
              <div style={{ display: 'flex' }}>
                {renderStars(Math.round(avgRating))}
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {product.reviews?.length || 0} Reviews {avgRating > 0 && `(${avgRating} Avg)`}
              </span>
            </div>

            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '1rem' }}>
              {formatPrice(product.price)}
            </div>

            {/* Wishlist & Share */}
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <button
                onClick={() => { if (!user) { navigate('/login'); return; } toggleWishlist(product.id); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.55rem 1.2rem', borderRadius: '50px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                  border: `1.5px solid ${wishlistIds.has(product.id) ? '#ef4444' : 'var(--border)'}`,
                  background: wishlistIds.has(product.id) ? 'rgba(239,68,68,0.07)' : 'transparent',
                  color: wishlistIds.has(product.id) ? '#ef4444' : 'var(--text-muted)',
                }}
              >
                <Heart size={17} fill={wishlistIds.has(product.id) ? '#ef4444' : 'none'} />
                {wishlistIds.has(product.id) ? 'Wishlisted' : 'Add to Wishlist'}
              </button>
              <button
                onClick={() => {
                  const url = `${window.location.origin}/product/${product.id}`;
                  if (navigator.share) { navigator.share({ title: product.name, url }); }
                  else { navigator.clipboard.writeText(url).then(() => alert('Link copied!')); }
                }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.55rem 1.2rem', borderRadius: '50px', cursor: 'pointer',
                  fontWeight: 600, fontSize: '0.9rem', transition: 'all 0.2s',
                  border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text-muted)',
                }}
                onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
                onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
              >
                <Share2 size={17} /> Share
              </button>
            </div>

            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
              <div style={{ flex: '0 0 100px' }}>
                <label className="form-label">Quantity</label>
                <input 
                  type="number" 
                  min="1" 
                  max={product.stock}
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="form-control"
                  disabled={product.stock === 0}
                />
              </div>
              <button 
                className={`btn ${added ? 'btn-success' : 'btn-primary'}`} 
                style={{ flex: 1, padding: '0.8rem', backgroundColor: added ? 'var(--secondary)' : '' }}
                onClick={handleAddToCart}
                disabled={product.stock === 0}
              >
                {added ? <><Check size={20} /> Added to Cart</> : <><ShoppingCart size={20} /> Add to Cart</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="card animate-fade-in" style={{ padding: '2.5rem', marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          Overview & Features
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.8, whiteSpace: 'pre-wrap' }}>
          {product.description}
        </p>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Customer Reviews</h2>
        
        <div className="grid grid-cols-2" style={{ gap: '3rem' }}>
          <div>
            {product.reviews && product.reviews.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {product.reviews.map(review => (
                  <div key={review.id} style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-main)' }}>{review.user?.nickname || review.user?.full_name || 'Customer'}</span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <div style={{ display: 'flex', marginBottom: '1rem' }}>
                      {renderStars(review.rating)}
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.5 }}>{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ padding: '3rem', background: 'var(--surface)', borderRadius: 'var(--radius)', textAlign: 'center', color: 'var(--text-muted)' }}>
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>

          <div>
            <div style={{ background: 'var(--surface)', padding: '2rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)', position: 'sticky', top: '100px' }}>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Write a Review</h3>
              
              {user ? (
                <form onSubmit={submitReview}>
                  <div className="form-group">
                    <label className="form-label">Rating</label>
                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button 
                          type="button" 
                          key={star} 
                          onClick={() => setReviewRating(star)} 
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          <Star size={24} fill={star <= reviewRating ? "#F59E0B" : "none"} color={star <= reviewRating ? "#F59E0B" : "#D1D5DB"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Comment</label>
                    <textarea 
                      className="form-control" 
                      rows="4" 
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your thoughts about this product..."
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" disabled={submittingReview} style={{ width: '100%' }}>
                    {submittingReview ? 'Submitting...' : <><Send size={18} /> Submit Review</>}
                  </button>
                </form>
              ) : (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius-sm)' }}>
                  <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>You must be logged in to leave a review.</p>
                  <button className="btn btn-secondary" onClick={() => navigate('/login')}>Log in to Review</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
