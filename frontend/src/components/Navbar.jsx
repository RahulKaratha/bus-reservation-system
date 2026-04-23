import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav style={styles.nav}>
      <Link to="/" style={styles.brand}>🚌 BusBook</Link>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/search" style={styles.link}>Search</Link>
            <Link to="/my-bookings" style={styles.link}>My Bookings</Link>
            <Link to="/profile" style={styles.link}>Profile</Link>
            <span style={styles.name}>Hi, {user.name}</span>
            <button onClick={handleLogout} style={styles.btn}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', background: '#1a1a2e', color: '#fff' },
  brand: { color: '#e94560', fontWeight: 'bold', fontSize: '1.3rem', textDecoration: 'none' },
  links: { display: 'flex', alignItems: 'center', gap: '16px' },
  link: { color: '#fff', textDecoration: 'none' },
  name: { color: '#aaa', fontSize: '0.9rem' },
  btn: { background: '#e94560', color: '#fff', border: 'none', padding: '6px 14px', borderRadius: '4px', cursor: 'pointer' }
}
