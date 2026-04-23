import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import CityInput from '../components/CityInput'

const busTypeColor = {
  'KSRTC Ordinary': '#6c757d',
  'KSRTC Express': '#0077b6',
  'KSRTC Rajahamsa': '#7b2d8b',
  'KSRTC Airavat': '#e94560',
  'KSRTC Club Class': '#d4a017',
}

const getToday = () => new Date().toISOString().split('T')[0]

export default function Search() {
  const navigate = useNavigate()
  const [source, setSource] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState(getToday)
  const [cities, setCities] = useState([])
  const [buses, setBuses] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/bus/cities')
      .then(({ data }) => setCities(data))
      .catch(err => console.error('Failed to load cities:', err?.response?.status, err?.message))
  }, [])

  const handleSwap = useCallback(() => {
    setSource(prev => { setDestination(prev); return destination })
  }, [destination])

  const handleSourceChange = useCallback((v) => setSource(v), [])
  const handleDestChange = useCallback((v) => setDestination(v), [])

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!source || !destination) return setError('Please select both source and destination')
    if (source === destination) return setError('Source and destination cannot be the same')
    setError('')
    setLoading(true)
    try {
      const { data } = await api.get('/bus/search', { params: { source, destination, date } })
      setBuses(data)
      setSearched(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Search failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      {/* Header */}
      <div style={s.header}>
        <h2 style={s.title}>🚌 Search KSRTC Buses</h2>
        <form onSubmit={handleSearch} style={s.form}>
          <CityInput placeholder="From (e.g. Bangalore)" value={source} onChange={handleSourceChange} cities={cities} />
          <button type="button" onClick={handleSwap} style={s.swapBtn}>⇄</button>
          <CityInput placeholder="To (e.g. Mysore)" value={destination} onChange={handleDestChange} cities={cities} />
          <input type="date" style={s.dateInput} value={date} min={getToday()} onChange={e => setDate(e.target.value)} required />
          <button style={s.searchBtn} type="submit" disabled={loading}>
            {loading ? 'Searching...' : '🔍 Search'}
          </button>
        </form>
        {error && <p style={s.error}>{error}</p>}
      </div>

      {/* Results */}
      <div style={s.results}>
        {searched && (
          <p style={s.resultCount}>
            {buses.length > 0
              ? `${buses.length} bus${buses.length > 1 ? 'es' : ''} found — ${source} → ${destination} on ${new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}`
              : `No buses found for ${source} → ${destination} on this date`
            }
          </p>
        )}

        {buses.map(bus => {
          const dep = new Date(bus.departureTime)
          const arr = new Date(bus.arrivalTime)
          const duration = Math.round((arr - dep) / 36e5)
          const color = busTypeColor[bus.operator] || '#333'

          return (
            <div key={bus._id} style={s.card}>
              <div style={s.cardLeft}>
                <span style={{ ...s.badge, background: color }}>{bus.operator}</span>
                <p style={s.busNum}>{bus.busNumber}</p>
              </div>

              <div style={s.cardMiddle}>
                <div style={s.timeBlock}>
                  <span style={s.time}>{dep.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span style={s.cityLabel}>{bus.source}</span>
                </div>
                <div style={s.durationBlock}>
                  <span style={s.durationText}>{duration}h</span>
                  <div style={s.durationLine}>
                    <div style={s.dot} /><div style={s.line} /><div style={s.dot} />
                  </div>
                  <span style={s.durationText}>journey</span>
                </div>
                <div style={s.timeBlock}>
                  <span style={s.time}>{arr.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span style={s.cityLabel}>{bus.destination}</span>
                </div>
              </div>

              <div style={s.cardRight}>
                <p style={s.price}>₹{bus.price}</p>
                <p style={{ ...s.seats, color: bus.availableSeats < 10 ? '#e74c3c' : '#27ae60' }}>
                  {bus.availableSeats} seats left
                </p>
                <button
                  style={{ ...s.bookBtn, opacity: bus.availableSeats === 0 ? 0.5 : 1 }}
                  disabled={bus.availableSeats === 0}
                  onClick={() => navigate(`/book/${bus._id}`, { state: { bus } })}
                >
                  {bus.availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', background: '#f0f2f5' },
  header: { background: '#1a1a2e', padding: '32px 24px 40px', textAlign: 'center', position: 'relative', zIndex: 10 },
  title: { color: '#fff', marginBottom: '20px', fontSize: '1.6rem' },
  form: { display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' },
  swapBtn: { background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', fontSize: '1.2rem', flexShrink: 0 },
  dateInput: { padding: '12px 14px', borderRadius: '8px', border: 'none', fontSize: '0.95rem', outline: 'none', cursor: 'pointer', flexShrink: 0 },
  searchBtn: { padding: '12px 28px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem', flexShrink: 0 },
  error: { color: '#ff6b6b', marginTop: '12px', fontSize: '0.9rem' },
  results: { maxWidth: '900px', margin: '32px auto', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: '16px' },
  resultCount: { color: '#555', fontSize: '0.95rem' },
  card: { background: '#fff', borderRadius: '12px', padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.07)', display: 'flex', alignItems: 'center', gap: '24px' },
  cardLeft: { minWidth: '130px' },
  badge: { color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', whiteSpace: 'nowrap' },
  busNum: { color: '#aaa', fontSize: '0.8rem', marginTop: '8px' },
  cardMiddle: { flex: 1, display: 'flex', alignItems: 'center', gap: '20px', justifyContent: 'center' },
  timeBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center' },
  time: { fontSize: '1.4rem', fontWeight: 'bold', color: '#1a1a2e' },
  cityLabel: { fontSize: '0.82rem', color: '#888', marginTop: '3px' },
  durationBlock: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' },
  durationText: { fontSize: '0.75rem', color: '#aaa' },
  durationLine: { display: 'flex', alignItems: 'center', gap: '4px' },
  dot: { width: '8px', height: '8px', borderRadius: '50%', background: '#ddd' },
  line: { width: '70px', height: '2px', background: '#ddd' },
  cardRight: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', minWidth: '130px' },
  price: { fontSize: '1.5rem', fontWeight: 'bold', color: '#e94560' },
  seats: { fontSize: '0.82rem', fontWeight: '600' },
  bookBtn: { padding: '10px 22px', background: '#e94560', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' },
}
