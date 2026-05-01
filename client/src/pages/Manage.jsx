import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

const Manage = () => {
  const { user, token, logout } = useContext(AuthContext);
  
  // Category State
  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState('expense');
  const [categories, setCategories] = useState([]);

  // Transaction State
  const [txCategoryId, setTxCategoryId] = useState('');
  const [txType, setTxType] = useState('expense');
  const [txAmount, setTxAmount] = useState('');
  const [txDate, setTxDate] = useState('');
  const [txDesc, setTxDesc] = useState('');
  const [txCurrency, setTxCurrency] = useState('INR');
  const [receiptFile, setReceiptFile] = useState(null);

  // Budget State
  const [budCatId, setBudCatId] = useState('');
  const [budLimit, setBudLimit] = useState('');
  const [budMonth, setBudMonth] = useState('');

  const [message, setMessage] = useState('');

  // Fetch categories on load
  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories', { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
        if (data.categories.length > 0) {
          setTxCategoryId(data.categories[0].id);
          setBudCatId(data.categories[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchCategories(); }, [token]);

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name: catName, type: catType })
    });
    if (res.ok) {
      showMessage('✅ Category added!');
      setCatName('');
      fetchCategories();
    } else showMessage('❌ Failed to add category');
  };

  const handleAddTransaction = async (e) => {
    e.preventDefault();
    
    // We use FormData because of the receipt file upload (multer)
    const formData = new FormData();
    formData.append('category_id', txCategoryId);
    formData.append('type', txType);
    formData.append('amount', txAmount);
    formData.append('date', txDate);
    formData.append('description', txDesc);
    formData.append('currency', txCurrency);
    if (receiptFile) formData.append('receipt', receiptFile);

    const res = await fetch('/api/transactions', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData // No content-type header, fetch sets it automatically for FormData
    });

    if (res.ok) {
      showMessage('✅ Transaction added (with optional receipt)!');
      setTxAmount(''); setTxDesc(''); setReceiptFile(null);
    } else showMessage('❌ Failed to add transaction');
  };

  const handleAddBudget = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/budgets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ category_id: budCatId, limit_amount: budLimit, month: budMonth })
    });
    if (res.ok) {
      showMessage('✅ Budget set! If expenses exceed this, you get an email.');
      setBudLimit('');
    } else showMessage('❌ Failed to set budget');
  };

  return (
    <>
      <nav className="navbar">
        <span className="navbar-brand">💰 Finance Tracker</span>
        <div className="navbar-right">
          <Link to="/dashboard" className="btn btn-outline btn-sm">Dashboard</Link>
          <span>{user.name}</span>
          <button className="btn btn-danger btn-sm" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h2>Manage Data <Database size={20} style={{ display: 'inline', marginLeft: 8 }} /></h2>
          <p>Add data here to see it reflect on your Dashboard.</p>
        </div>

        {message && <div className="message success show" style={{ marginBottom: 20 }}>{message}</div>}

        <div className="stats-grid">
          {/* CATEGORY FORM */}
          <div className="section-card">
            <h3>1. Add Category</h3>
            <form onSubmit={handleAddCategory}>
              <div className="form-group">
                <label>Category Name</label>
                <input type="text" value={catName} onChange={e => setCatName(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Type</label>
                <select className="form-group input" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }} value={catType} onChange={e => setCatType(e.target.value)}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </div>
              <button className="btn btn-primary btn-sm">Create Category</button>
            </form>
          </div>

          {/* BUDGET FORM */}
          <div className="section-card">
            <h3>2. Set Monthly Budget</h3>
            <form onSubmit={handleAddBudget}>
              <div className="form-group">
                <label>Category</label>
                <select style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }} value={budCatId} onChange={e => setBudCatId(e.target.value)} required>
                  {categories.filter(c => c.type === 'expense').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Limit Amount</label>
                <input type="number" value={budLimit} onChange={e => setBudLimit(e.target.value)} required />
              </div>
              <div className="form-group">
                <label>Month (YYYY-MM)</label>
                <input type="month" value={budMonth} onChange={e => setBudMonth(e.target.value)} required />
              </div>
              <button className="btn btn-primary btn-sm">Save Budget</button>
            </form>
          </div>
        </div>

        {/* TRANSACTION FORM */}
        <div className="section-card">
          <h3>3. Add Transaction (File Upload & Multi-Currency)</h3>
          <form onSubmit={handleAddTransaction} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label>Type</label>
              <select style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }} value={txType} onChange={e => setTxType(e.target.value)}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Category</label>
              <select style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }} value={txCategoryId} onChange={e => setTxCategoryId(e.target.value)} required>
                {categories.filter(c => c.type === txType).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>Amount</label>
              <input type="number" value={txAmount} onChange={e => setTxAmount(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Currency</label>
              <select style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid var(--border)' }} value={txCurrency} onChange={e => setTxCurrency(e.target.value)}>
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" value={txDate} onChange={e => setTxDate(e.target.value)} required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <input type="text" value={txDesc} onChange={e => setTxDesc(e.target.value)} />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Upload Receipt Image (Optional)</label>
              <input type="file" onChange={e => setReceiptFile(e.target.files[0])} style={{ padding: '6px 0' }} />
            </div>

            <button className="btn btn-primary" style={{ gridColumn: 'span 2' }}>Add Transaction</button>
          </form>
        </div>

      </div>
    </>
  );
};

export default Manage;
