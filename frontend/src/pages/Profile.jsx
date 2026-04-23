import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api'

const statusColor = { confirmed: '#27ae60', pending: '#f39c12', cancelled: '#e74c3c' }
const paymentColor = { paid: '#27ae60', pending: '#f39c12', failed: '#e74c3c' }

export default function Profile() {
  const { user } = useAuth()
  const [tab, setTab] = useState('profile')
  const [form, setForm] = useState({ name: '', email: '', phone: '', avatar: '' })
  const [bookings, setBookings] = useState([])
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    api.get('/user/profile').then(({ data }) => {
      if (data) setForm({ name: data.name || '', email: data.email || '', phone: data.phone || '', avatar: data.avatar || '' })
    }).catch(() => {})
  }, [])

  useEffect(() => {
    if (tab === 'bookings') {
      api.get('/booking/my').then(({ data }) => setBookings(data)).catch(() => {})
    }
  }, [tab])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaved(false)
    setLoading(true)
    try {
      await api.put('/user/profile', form)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    try {
      await api.patch(`/booking/${id}/cancel`)
      setBookings(prev => prev.map(b => b._id === id ? { ...b, bookingStatus: 'cancelled' } : b))
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed')
    }
  }

  const initials = (form.name || user?.name || '?').split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div style={styles.page}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.avatarWrap}>
          {form.avatar
            ? <img src={form.avatar} alt="avatar" style={styles.avatarImg} />
            : <div style={styles.avatarInitials}>{initials}</div>
          }
          <h3 style={styles.sidebarName}>{form.name || user?.name}</h3>
          <p style={styles.sidebarEmail}>{form.email}</p>
        </div>

        <nav style={styles.nav}>
          {[
            { key: 'profile', label: '👤 Edit Profile' },
            { key: 'bookings', label: '🎫 My Bookings' },
          ].map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              style={{ ...styles.navBtn, ...(tab === item.key ? styles.navBtnActive : {}) }}>
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div style={styles.main}>
        {tab === 'profile' && (
          <div style={styles.card}>
            <h2 style={styles.cardTitle}>Edit Profile</h2>
            {saved && <div style={styles.successBanner}>✅ Profile updated successfully!</div>}
            {error && <div style={styles.errorBanner}>❌ {error}</div>}
            <form onSubmit={handleSubmit}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} placeholder="Your full name" value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Email Address</label>
                <input style={styles.input} type="email" placeholder="your@email.com" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Phone Number</label>
                <input style={styles.input} type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone}
                  onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Avatar URL <span style={styles.optional}>(optional)</span></label>
                <input style={styles.input} placeholder="https://..." value={form.avatar}
                  onChange={e => setForm({ ...form, avatar: e.target.value })} />
              </div>
              <button style={styles.saveBtn} type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}

        {tab === 'bookings' && (
          <div>
            <h2 style={styles.cardTitle}>My Bookings</h2>
            {bookings.length === 0
              ? <div style={styles.emptyBookings}><p style={{ fontSize: '2rem' }}>🎫</p><p>No bookings yet</p></div>
              : bookings.map(b => (
                <div key={b._id} style={styles.bookingCard}>
                  <div style={styles.bookingTop}>
                    <div>
                      <p style={styles.bookingId}>#{b._id.slice(-8).toUpperCase()}</p>
                      <p style={styles.bookingSeats}>Seats: {b.seats.join(', ')}</p>
                      <p style={styles.bookingDate}>{new Date(b.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                    </div>
                    <div style={styles.bookingBadges}>
                      <span style={{ ...styles.statusBadge, background: statusColor[b.bookingStatus] }}>
                        {b.bookingStatus}
                      </span>
                      <span style={{ ...styles.statusBadge, background: paymentColor[b.paymentStatus] }}>
                        {b.paymentStatus}
                      </span>
                    </div>
                  </div>
                  {b.bookingStatus !== 'cancelled' && (
                    <button style={styles.cancelBtn} onClick={() => handleCancel(b._id)}>
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { display: 'flex', minHeight: '100vh', background: '#f0f2f5', gap: '24px', padding: '32px 24px', maxWidth: '1100px', margin: '0 auto', boxSizing: 'border-box' },
  sidebar: { width: '260px', flexShrink: 0 },
  avatarWrap: { background: '#fff', borderRadius: '12px', padding: '28px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '16px' },
  avatarImg: { width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginBottom: '12px' },
  avatarInitials: { width: '80px', height: '80px', borderRadius: '50%', background: '#e94560', color: '#fff', fontSize: '1.8rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' },
  sidebarName: { fontSize: '1rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '4px' },
  sidebarEmail: { fontSize: '0.8rem', color: '#999' },
  nav: { background: '#fff', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  navBtn: { display: 'block', width: '100%', padding: '14px 20px', background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '0.95rem', color: '#555', borderLeft: '3px solid transparent' },
  navBtnActive: { background: '#fff5f7', color: '#e94560', fontWeight: 'bold', borderLeft: '3px solid #e94560' },
  main: { flex: 1 },
  card: { background: '#fff', borderRadius: '12px', padding: '28px 32px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' },
  cardTitle: { fontSize: '1.3rem', fontWeight: 'bold', color: '#1a1a2e', marginBottom: '24px' },
  fieldGroup: { marginBottom: '18px' },
  label: { display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#555', marginBottom: '6px' },
  optional: { fontWeight: 'normal', color: '#aaa' },
  input: { width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1px solid #e0e0e0', fontSize: '0.95rem', boxSizing: 'border-box', outline: 'none', transition: 'border 0.2s' },
  saveBtn: { padding: '12px 32px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', marginTop: '8px' },
  successBanner: { background: '#f0fff4', border: '1px solid #27ae60', color: '#27ae60', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' },
  errorBanner: { background: '#fff5f5', border: '1px solid #e74c3c', color: '#e74c3c', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.9rem' },
  emptyBookings: { textAlign: 'center', padding: '60px', color: '#999' },
  bookingCard: { background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.08)', marginBottom: '16px' },
  bookingTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' },
  bookingId: { fontWeight: 'bold', color: '#1a1a2e', fontSize: '0.95rem' },
  bookingSeats: { color: '#666', fontSize: '0.85rem', marginTop: '4px' },
  bookingDate: { color: '#999', fontSize: '0.8rem', marginTop: '4px' },
  bookingBadges: { display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' },
  statusBadge: { color: '#fff', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold' },
  cancelBtn: { padding: '8px 18px', background: '#fff', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' },
}
