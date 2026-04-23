import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import api from '../api'

export default function Book() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const bus = state?.bus
  const [selectedSeats, setSelectedSeats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState(null) // { status, bookingId }

  if (!bus) return (
    <div style={s.center}>
      <p>No bus selected.</p>
      <button style={s.btn} onClick={() => navigate('/search')}>Back to Search</button>
    </div>
  )

  const toggleSeat = (seat) => {
    setSelectedSeats(prev =>
      prev.includes(seat) ? prev.filter(x => x !== seat) : [...prev, seat]
    )
  }

  const handleBook = async () => {
    if (selectedSeats.length === 0) return setError('Please select at least one seat')
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/booking/create', { busId: bus._id, seats: selectedSeats })
      // Poll for payment result — booking starts as pending, payment updates it
      setTimeout(async () => {
        try {
          const { data: updated } = await api.get(`/booking/${data._id}`)
          setResult({ status: updated.paymentStatus, bookingId: data._id })
        } catch {
          setResult({ status: 'pending', bookingId: data._id })
        }
        setLoading(false)
      }, 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed')
      setLoading(false)
    }
  }

  // Payment result screen
  if (result) {
    const success = result.status === 'paid'
    return (
      <div style={s.center}>
        <div style={{ ...s.resultCard, borderTop: `4px solid ${success ? '#27ae60' : '#e74c3c'}` }}>
          <p style={s.resultIcon}>{success ? '✅' : '❌'}</p>
          <h2 style={{ color: success ? '#27ae60' : '#e74c3c' }}>
            {success ? 'Booking Confirmed!' : 'Payment Failed'}
          </h2>
          <p style={s.resultSub}>
            {success
              ? `Your seats ${selectedSeats.join(', ')} on ${bus.source} → ${bus.destination} are booked.`
              : 'Your payment could not be processed. The booking has been cancelled.'}
          </p>
          {success && <p style={s.txnId}>Booking ID: #{result.bookingId.slice(-8).toUpperCase()}</p>}
          <div style={s.resultActions}>
            {success
              ? <button style={s.btn} onClick={() => navigate('/my-bookings')}>View My Bookings</button>
              : <button style={s.btn} onClick={() => { setResult(null); setSelectedSeats([]) }}>Try Again</button>
            }
            <button style={s.outlineBtn} onClick={() => navigate('/search')}>Back to Search</button>
          </div>
        </div>
      </div>
    )
  }

  const dep = new Date(bus.departureTime)
  const arr = new Date(bus.arrivalTime)

  return (
    <div style={s.page}>
      {/* Bus Info */}
      <div style={s.busInfo}>
        <div>
          <h2 style={s.route}>{bus.source} → {bus.destination}</h2>
          <p style={s.meta}>{bus.operator} · {bus.busNumber}</p>
          <p style={s.meta}>
            {dep.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} &nbsp;|&nbsp;
            {dep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} → {arr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <div style={s.priceTag}>₹{bus.price} <span style={s.perSeat}>/ seat</span></div>
      </div>

      {/* Seat Map */}
      <div style={s.seatSection}>
        <h3 style={s.seatTitle}>Select Seats</h3>
        <div style={s.legend}>
          <span style={s.legendItem}><span style={{ ...s.legendBox, background: '#f0f0f0' }} /> Available</span>
          <span style={s.legendItem}><span style={{ ...s.legendBox, background: '#e94560' }} /> Selected</span>
        </div>
        <div style={s.grid}>
          {Array.from({ length: bus.totalSeats || 52 }, (_, i) => i + 1).map(seat => {
            const selected = selectedSeats.includes(seat)
            return (
              <div key={seat} onClick={() => toggleSeat(seat)}
                style={{ ...s.seat, background: selected ? '#e94560' : '#f0f0f0', color: selected ? '#fff' : '#333', transform: selected ? 'scale(1.1)' : 'scale(1)' }}>
                {seat}
              </div>
            )
          })}
        </div>
      </div>

      {/* Summary */}
      {selectedSeats.length > 0 && (
        <div style={s.summary}>
          <div>
            <p style={s.summaryLabel}>Selected Seats</p>
            <p style={s.summaryValue}>{selectedSeats.sort((a, b) => a - b).join(', ')}</p>
          </div>
          <div>
            <p style={s.summaryLabel}>Total Amount</p>
            <p style={{ ...s.summaryValue, color: '#e94560', fontSize: '1.4rem' }}>₹{selectedSeats.length * bus.price}</p>
          </div>
          <div>
            <p style={s.summaryLabel}>Seats</p>
            <p style={s.summaryValue}>{selectedSeats.length}</p>
          </div>
        </div>
      )}

      {error && <p style={s.error}>{error}</p>}

      <button style={{ ...s.btn, opacity: loading ? 0.7 : 1 }} onClick={handleBook} disabled={loading}>
        {loading ? '⏳ Processing Payment...' : `Confirm & Pay ₹${selectedSeats.length * bus.price || 0}`}
      </button>

      {loading && (
        <p style={s.paymentNote}>🔒 Simulating secure payment... please wait</p>
      )}
    </div>
  )
}

const s = {
  page: { maxWidth: '700px', margin: '40px auto', padding: '0 16px 40px' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: '16px' },
  busInfo: { background: '#1a1a2e', color: '#fff', borderRadius: '12px', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  route: { fontSize: '1.3rem', marginBottom: '6px' },
  meta: { color: '#aaa', fontSize: '0.9rem', marginTop: '4px' },
  priceTag: { fontSize: '1.8rem', fontWeight: 'bold', color: '#e94560' },
  perSeat: { fontSize: '0.8rem', color: '#aaa' },
  seatSection: { background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', marginBottom: '20px' },
  seatTitle: { marginBottom: '12px', color: '#1a1a2e' },
  legend: { display: 'flex', gap: '20px', marginBottom: '16px' },
  legendItem: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: '#666' },
  legendBox: { width: '20px', height: '20px', borderRadius: '4px', display: 'inline-block' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '8px' },
  seat: { padding: '10px 0', textAlign: 'center', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem', transition: 'all 0.15s', userSelect: 'none' },
  summary: { background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', justifyContent: 'space-between', marginBottom: '20px' },
  summaryLabel: { fontSize: '0.8rem', color: '#999', marginBottom: '4px' },
  summaryValue: { fontWeight: 'bold', fontSize: '1rem', color: '#1a1a2e' },
  btn: { width: '100%', padding: '14px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  outlineBtn: { width: '100%', padding: '12px', background: '#fff', color: '#e94560', border: '1px solid #e94560', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' },
  error: { color: '#e74c3c', marginBottom: '12px', textAlign: 'center' },
  paymentNote: { textAlign: 'center', color: '#888', fontSize: '0.85rem', marginTop: '12px' },
  resultCard: { background: '#fff', borderRadius: '12px', padding: '40px 32px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: '420px', width: '100%' },
  resultIcon: { fontSize: '3rem', marginBottom: '12px' },
  resultSub: { color: '#666', margin: '12px 0', lineHeight: 1.6 },
  txnId: { background: '#f5f5f5', padding: '8px 16px', borderRadius: '6px', fontSize: '0.85rem', color: '#555', margin: '12px 0' },
  resultActions: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' },
}
