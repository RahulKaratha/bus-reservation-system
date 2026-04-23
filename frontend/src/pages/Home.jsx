import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🚌 Welcome to BusBook</h1>
      <p style={styles.sub}>Search and book bus tickets instantly</p>
      <button style={styles.btn} onClick={() => navigate(user ? '/search' : '/login')}>
        {user ? 'Search Buses' : 'Get Started'}
      </button>
    </div>
  )
}

const styles = {
  container: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '80vh', textAlign: 'center' },
  title: { fontSize: '2.5rem', marginBottom: '12px' },
  sub: { color: '#666', fontSize: '1.1rem', marginBottom: '28px' },
  btn: { padding: '14px 36px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer', fontWeight: 'bold' }
}
