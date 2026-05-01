import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const API_BASE = "https://fjassign.onrender.com";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.token, data.user);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Cannot reach server. Is it running?');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: 'dummy_google_token_for_testing' }),
        });
        const data = await response.json();
        if (response.ok) {
          login(data.token, data.user);
          navigate('/dashboard');
        } else {
          setError(data.message || 'Google Login failed');
        }
      } catch (err) {
        setError('Cannot reach server. Is it running?');
      }
    };

    return (
      <div className="auth-wrapper">
        <div className="auth-card">
          <div className="brand">
            <h1>💰 Finance Tracker</h1>
            <p>Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <Loader2 className="spinner" size={16} /> : 'Sign In'}
            </button>
          </form>

          <div style={{ textAlign: 'center', margin: '20px 0', fontSize: '14px', color: 'var(--text)' }}>
            ⎯⎯⎯⎯ OR ⎯⎯⎯⎯
          </div>

          <button
            type="button"
            className="btn btn-outline"
            style={{ width: '100%', marginBottom: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClick={handleGoogleLogin}
          >
            🌐 Continue with Google
          </button>

          {error && <p className="message error show">{error}</p>}

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Register here</Link>
          </div>
        </div>
      </div>
    );
  };

  export default Login;
