import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, ShieldCheck, Box, Globe, User, Heart, Package, CreditCard, MapPin, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const { countryCode, changeCountry, allCountries } = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.4rem', color: 'var(--primary)', letterSpacing: '-0.03em' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)', color: 'white', padding: '0.4rem', borderRadius: 'var(--radius-sm)', display: 'flex', boxShadow: '0 4px 10px rgba(139, 92, 246, 0.3)' }}>
             <Box size={20} strokeWidth={2.5} />
          </div>
          Premium<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Shop</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <Link to="/" style={{ fontWeight: 600, fontSize: '0.95rem' }}>Store</Link>
          {user ? (
            <>
              {user.is_admin && (
                <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.95rem' }}>
                  <ShieldCheck size={18} /> Admin
                </Link>
              )}
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', background: 'rgba(0,0,0,0.03)', padding: '0.4rem 0.8rem', borderRadius: '50px' }}>
                <Globe size={18} style={{ color: 'var(--primary)' }} />
                <select 
                  value={countryCode} 
                  onChange={(e) => changeCountry(e.target.value)}
                  style={{ background: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', outline: 'none', appearance: 'none', paddingRight: '10px' }}
                >
                  {allCountries.map(c => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>
              </div>

              <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', position: 'relative' }}>
                <ShoppingCart size={22} style={{ color: 'var(--primary)' }} />
                {cartItemCount > 0 && (
                  <span style={{ position: 'absolute', top: '-10px', right: '-12px', background: 'var(--accent)', color: 'white', fontSize: '0.7rem', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', border: '2px solid white' }}>
                    {cartItemCount}
                  </span>
                )}
              </Link>
              <div ref={menuRef} style={{ position: 'relative', borderLeft: '2px solid rgba(0,0,0,0.05)', paddingLeft: '1.5rem', marginLeft: '0.5rem' }}>
                <button 
                  onClick={() => setProfileOpen(!profileOpen)}
                  style={{ width: '40px', height: '40px', background: 'var(--primary)', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)', transition: 'var(--transition)' }}
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {user.full_name ? user.full_name.charAt(0).toUpperCase() : <User size={20} />}
                </button>

                {profileOpen && (
                  <div className="card animate-fade-in" style={{ position: 'absolute', top: '50px', right: '0', width: '220px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 10 }}>
                    <div style={{ paddingBottom: '0.8rem', marginBottom: '0.5rem', borderBottom: '1px solid var(--border)' }}>
                      <p style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.full_name || 'Valued Customer'}
                      </p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>

                    <Link onClick={() => setProfileOpen(false)} to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <Settings size={16} style={{ color: 'var(--text-muted)' }} /> Profile Settings
                    </Link>
                    
                    {user.is_admin && (
                      <Link onClick={() => setProfileOpen(false)} to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                        <ShieldCheck size={16} style={{ color: 'var(--accent)' }} /> Admin Dashboard
                      </Link>
                    )}

                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.2rem 0' }}></div>
                    
                    <Link onClick={() => setProfileOpen(false)} to="/orders" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <Package size={16} style={{ color: 'var(--text-muted)' }} /> Orders
                    </Link>
                    <Link onClick={() => setProfileOpen(false)} to="/wishlist" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <Heart size={16} style={{ color: '#ef4444' }} /> Wishlist
                    </Link>
                    <Link onClick={() => setProfileOpen(false)} to="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <CreditCard size={16} style={{ color: 'var(--text-muted)' }} /> Payment Methods
                    </Link>
                    <Link onClick={() => setProfileOpen(false)} to="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-main)' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <MapPin size={16} style={{ color: 'var(--text-muted)' }} /> Addresses
                    </Link>

                    <div style={{ height: '1px', background: 'var(--border)', margin: '0.2rem 0' }}></div>

                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem', fontWeight: 600, color: 'var(--error)', width: '100%', textAlign: 'left' }} onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.05)'} onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}>
                      <LogOut size={16} /> Sign out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', marginLeft: '1rem', alignItems: 'center' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', background: 'rgba(0,0,0,0.03)', padding: '0.4rem 0.8rem', borderRadius: '50px', marginRight: '0.5rem' }}>
                <Globe size={18} style={{ color: 'var(--primary)' }} />
                <select 
                  value={countryCode} 
                  onChange={(e) => changeCountry(e.target.value)}
                  style={{ background: 'transparent', border: 'none', fontWeight: 600, color: 'var(--text-main)', cursor: 'pointer', outline: 'none', appearance: 'none', paddingRight: '10px' }}
                >
                  {allCountries.map(c => (
                    <option key={c.code} value={c.code}>{c.code} ({c.symbol})</option>
                  ))}
                </select>
              </div>
              <Link to="/login" className="btn btn-secondary" style={{ padding: '0.6rem 1.4rem', borderRadius: '50px' }}>Log in</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: '0.6rem 1.4rem', borderRadius: '50px' }}>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
