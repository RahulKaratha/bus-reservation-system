import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      login(data)
      navigate('/search')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  const handleGoogle = () => {
    window.location.href = 'http://localhost:5001/api/oauth/google'
  }

  return (
    <div style={s.container}>
      <div style={s.card}>
        <h2 style={s.title}>Login</h2>
        {error && <p style={s.error}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input style={s.input} type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })} required />
          <input style={s.input} type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })} required />
          <button style={s.btn} type="submit">Login</button>
        </form>

        <div style={s.divider}><span style={s.dividerText}>or</span></div>

        <button style={s.googleBtn} onClick={handleGoogle}>
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" alt="G" />
          Continue with Google
        </button>

        <p style={s.footer}>No account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  )
}

const s = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' },
  card: { background: '#fff', padding: '32px', borderRadius: '12px', boxShadow: '0 2px 12px rgba(0,0,0,0.1)', width: '360px' },
  title: { marginBottom: '20px', textAlign: 'center', color: '#1a1a2e' },
  input: { width: '100%', padding: '11px 14px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box', fontSize: '0.95rem' },
  btn: { width: '100%', padding: '11px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  divider: { display: 'flex', alignItems: 'center', margin: '16px 0', gap: '8px' },
  dividerText: { color: '#aaa', fontSize: '0.85rem', whiteSpace: 'nowrap', padding: '0 8px', background: '#fff' },
  googleBtn: { width: '100%', padding: '11px', background: '#fff', color: '#333', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '0.95rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' },
  error: { color: 'red', marginBottom: '12px', textAlign: 'center', fontSize: '0.9rem' },
  footer: { textAlign: 'center', marginTop: '16px', fontSize: '0.9rem' },
}
