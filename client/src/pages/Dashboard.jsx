import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { LogOut, LayoutDashboard, TrendingUp, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user, token, logout } = useContext(AuthContext);
  
  const [dashboardData, setDashboardData] = useState(null);
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashRes, budgetRes] = await Promise.all([
          fetch('/api/dashboard', { headers: { 'Authorization': `Bearer ${token}` } }),
          fetch('/api/budgets', { headers: { 'Authorization': `Bearer ${token}` } })
        ]);

        if (dashRes.ok && budgetRes.ok) {
          const dashData = await dashRes.json();
          const budgetData = await budgetRes.json();
          setDashboardData(dashData);
          setBudgets(budgetData.budgets);
        } else if (dashRes.status === 401 || budgetRes.status === 401) {
          logout();
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, logout]);

  if (!user) return null;

  return (
    <>
      <nav className="navbar">
        <span className="navbar-brand">💰 Finance Tracker</span>
        <div className="navbar-right">
          <Link to="/manage" className="btn btn-outline btn-sm">Add Data</Link>
          <span>{user.name}</span>
          <button className="btn btn-danger btn-sm" onClick={logout}>
            <LogOut size={14} style={{ marginRight: 4, display: 'inline' }} />
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-wrapper">
        <div className="dashboard-header">
          <h2>Dashboard Overview <LayoutDashboard size={20} style={{ display: 'inline', marginLeft: 8 }} /></h2>
        </div>

        {loading ? (
          <p>Loading financial insights...</p>
        ) : (
          <>
            <div className="stats-grid">
              <div className="stat-card income">
                <div className="stat-label">Total Income</div>
                <div className="stat-value">₹{dashboardData?.totals?.income?.toFixed(2) || '0.00'}</div>
              </div>
              <div className="stat-card expense">
                <div className="stat-label">Total Expenses</div>
                <div className="stat-value">₹{dashboardData?.totals?.expense?.toFixed(2) || '0.00'}</div>
              </div>
              <div className="stat-card savings">
                <div className="stat-label">Net Savings</div>
                <div className="stat-value">₹{dashboardData?.totals?.savings?.toFixed(2) || '0.00'}</div>
              </div>
            </div>

            <div className="section-card">
              <h3><TrendingUp size={18} /> Expense Breakdown</h3>
              {dashboardData?.categoryBreakdown?.length === 0 ? (
                <p>No expenses recorded yet.</p>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {dashboardData.categoryBreakdown.map((item, index) => (
                    <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between' }}>
                      <span>{item.category}</span>
                      <span style={{ fontWeight: '600' }}>₹{item.amount.toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="section-card">
              <h3><Bell size={18} /> Budgets vs Actual (This Month)</h3>
              {budgets.length === 0 ? (
                <p>No budgets set up.</p>
              ) : (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {budgets.map(b => (
                    <div key={b.id} style={{ padding: '12px', border: '1px solid var(--border)', borderRadius: '8px', background: b.exceeded ? '#FEF2F2' : 'var(--bg)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <strong>{b.category_name}</strong>
                        <span style={{ color: b.exceeded ? 'var(--danger)' : 'var(--text)' }}>
                          {b.exceeded ? '⚠️ Exceeded' : 'On Track'}
                        </span>
                      </div>
                      <div style={{ fontSize: '13px' }}>
                        Spent: ₹{b.spent_amount.toFixed(2)} / Limit: ₹{b.limit_amount.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Dashboard;
