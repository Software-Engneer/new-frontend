import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import './Products.css';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const { getAuthHeaders, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    console.log('Products component mounted, fetching products...');
    fetchProducts();
  }, [token, navigate], [fetchProducts]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('Initiating products fetch from API...');
      
      const response = await fetch('http://localhost:5000/api/products', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      console.log('API Response Status:', response.status);
      const data = await response.json();
      console.log('API Response Data:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch products');
      }

      const productsList = data.data || [];
      console.log('Processed products list:', productsList);
      
      setProducts(productsList);
      console.log('Products state updated with', productsList.length, 'items');
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message || 'Failed to load products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');

      const url = editingProduct 
        ? `http://localhost:5000/api/products/${editingProduct.id}`
        : 'http://localhost:5000/api/products';

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || (editingProduct ? 'Failed to update product' : 'Failed to create product'));
      }

      await fetchProducts();
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: ''
      });
      setEditingProduct(null);
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.message || 'An error occurred while saving the product');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });

      if (!response.ok) {
        if (response.status === 401) {
          navigate('/login');
          return;
        }
        throw new Error('Failed to delete product');
      }

      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMenuClick = (e, productId) => {
    e.stopPropagation();
    setActiveMenu(activeMenu === productId ? null : productId);
  };

  const handleActionClick = (e, action, product) => {
    e.stopPropagation();
    setActiveMenu(null);
    
    if (action === 'edit') {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (action === 'delete') {
      handleDelete(product.id || product._id);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest('.menu-container')) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeMenu]);

  if (loading) return (
    <>
      <Navbar />
      <div className="loading">Loading...</div>
    </>
  );

  return (
    <>
      <Navbar />
      <div className="products-container">
        <h2>Products Management</h2>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">Product Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className={`submit-btn ${editingProduct ? 'update' : 'add'}`}
              disabled={loading}
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
            
            {editingProduct && (
              <button 
                type="button" 
                className="cancel-btn"
                onClick={() => {
                  setEditingProduct(null);
                  setFormData({
                    name: '',
                    description: '',
                    price: '',
                    category: ''
                  });
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="products-grid">
          {products.map(product => (
            <div key={product.id || product._id} className="product-card">
              <div className="product-content">
                <div className="product-header">
                  <h3>{product.name}</h3>
                  <div className="menu-container">
                    <button 
                      className="menu-trigger"
                      onClick={(e) => handleMenuClick(e, product.id || product._id)}
                    >
                      <span className="dots">⋮</span>
                    </button>
                    {activeMenu === (product.id || product._id) && (
                      <div className="menu-dropdown">
                        <button 
                          onClick={(e) => handleActionClick(e, 'edit', product)}
                          className="menu-item"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={(e) => handleActionClick(e, 'delete', product)}
                          className="menu-item delete"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <p className="description">{product.description}</p>
                <p className="price">${Number(product.price).toFixed(2)}</p>
                <p className="category-badge">{product.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Products; 