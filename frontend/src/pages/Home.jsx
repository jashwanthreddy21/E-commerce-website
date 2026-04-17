import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { Search, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [query, setQuery] = useState('');
  // For pagination since we have 800+ products
  const [page, setPage] = useState(0);
  const limit = 24;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url = query 
          ? `/products/?search=${query}&skip=${page*limit}&limit=${limit}` 
          : `/products/?skip=${page*limit}&limit=${limit}`;
        const res = await api.get(url);
        // Append on load more, or replace on search change
        if (page === 0) setProducts(res.data);
        else setProducts(prev => [...prev, ...res.data]);
      } catch (error) {
        console.error("Error fetching products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [query, page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setQuery(search);
  };

  return (
    <div className="container">
      {/* Premium Hero Section */}
      {!query && page === 0 && (
        <div className="hero animate-fade-in">
          <div style={{ position: 'relative', zIndex: 2, maxWidth: '600px' }}>
            <div className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '1.5rem', backdropFilter: 'blur(10px)' }}>
              <Sparkles size={14} style={{ marginRight: '0.4rem' }} /> New Fall Collection
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '1.5rem' }}>
              Elevate Your <br/><span style={{ color: '#E2E8F0' }}>Lifestyle.</span>
            </h1>
            <p style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.8)', marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Discover the finest curated selection of premium electronics and accessories crafted for excellence.
            </p>
            <button 
              onClick={() => document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="btn btn-secondary" 
              style={{ padding: '1rem 2rem', fontSize: '1.1rem', borderRadius: '50px', background: 'white', color: 'var(--primary)' }}
            >
              Shop Now <ChevronRight size={20} />
            </button>
          </div>
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', gap: '1.5rem', opacity: 0.9 }}>
            {/* Decorative graphical elements could go here, or featured imagery */}
          </div>
        </div>
      )}

      {/* Main Content section */}
      <div id="catalog" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem', paddingTop: '2rem' }}>
        <div className="animate-fade-in">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
             Our Catalog
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem' }}>Find exactly what you're looking for.</p>
        </div>
        
        <form onSubmit={handleSearch} className="animate-fade-in" style={{ display: 'flex', gap: '0.75rem', width: '100%', maxWidth: '450px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <div style={{ position: 'absolute', inset: '0', left: '1.2rem', display: 'flex', alignItems: 'center', pointerEvents: 'none', color: 'var(--text-muted)' }}>
              <Search size={20} />
            </div>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search premium goods..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingLeft: '3.2rem', borderRadius: '50px', fontSize: '1.05rem', background: 'white', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ borderRadius: '50px', padding: '0 1.8rem' }}>Search</button>
        </form>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 grid-cols-2 grid-cols-3 grid-cols-4">
          {products.map((product, i) => (
            <ProductCard key={`${product.id}-${i}`} product={product} />
          ))}
        </div>
      ) : !loading && (
        <div style={{ textAlign: 'center', padding: '6rem 0', background: 'white', borderRadius: 'var(--radius)', border: '1px dashed var(--border)' }}>
          <Search size={64} style={{ margin: '0 auto 1.5rem', color: 'var(--text-muted)', opacity: 0.3 }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>No products found</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>We couldn't track down any items matching "{query}".</p>
        </div>
      )}

      {/* Pagination Load More */}
      {products.length >= limit && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '4rem' }}>
           <button onClick={() => setPage(page + 1)} className="btn btn-secondary" style={{ padding: '1rem 3rem', borderRadius: '50px' }}>
             Load More Products
           </button>
        </div>
      )}

      {loading && (
        <div className="center-page" style={{ minHeight: '30vh' }}><div className="spinner"></div></div>
      )}
    </div>
  );
};

export default Home;
