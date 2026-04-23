import { useEffect, useState } from 'react'
import api from '../api'

const statusColor = { confirmed: '#27ae60', pending: '#f39c12', cancelled: '#e74c3c' }

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/booking/my')
      setBookings(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (id) => {
    try {
      await api.patch(`/booking/${id}/cancel`)
      fetchBookings()
    } catch (err) {
      alert(err.response?.data?.message || 'Cancel failed')
    }
  }

  useEffect(() => { fetchBookings() }, [])

  if (loading) return <p style={styles.center}>Loading...</p>

  return (
    <div style={styles.container}>
      <h2>My Bookings</h2>
      {bookings.length === 0 && <p>No bookings yet.</p>}
      <div style={styles.list}>
        {bookings.map(b => (
          <div key={b._id} style={styles.card}>
            <div>
              <p><strong>Booking ID:</strong> {b._id}</p>
              <p><strong>Bus ID:</strong> {b.busId}</p>
              <p><strong>Seats:</strong> {b.seats.join(', ')}</p>
              <p>
                <strong>Status: </strong>
                <span style={{ color: statusColor[b.bookingStatus], fontWeight: 'bold' }}>{b.bookingStatus}</span>
                {' | '}
                <strong>Payment: </strong>
                <span style={{ color: statusColor[b.paymentStatus] || '#333' }}>{b.paymentStatus}</span>
              </p>
              <p style={styles.meta}>{new Date(b.createdAt).toLocaleString()}</p>
            </div>
            {b.bookingStatus !== 'cancelled' && (
              <button style={styles.cancelBtn} onClick={() => handleCancel(b._id)}>Cancel</button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '800px', margin: '40px auto', padding: '0 16px' },
  list: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' },
  card: { background: '#fff', padding: '16px 20px', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  meta: { color: '#999', fontSize: '0.85rem' },
  cancelBtn: { padding: '8px 16px', background: '#e74c3c', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  center: { textAlign: 'center', marginTop: '40px' }
}
