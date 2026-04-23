import { useState, useEffect, useRef, memo } from 'react'

const CityInput = memo(function CityInput({ placeholder, value, onChange, cities }) {
  const [text, setText] = useState(value)
  const [open, setOpen] = useState(false)
  const ref = useRef()

  // Sync if parent resets value (e.g. swap button)
  useEffect(() => { setText(value) }, [value])

  const filtered = text.length > 0
    ? cities.filter(c => c.toLowerCase().includes(text.toLowerCase()) && c.toLowerCase() !== text.toLowerCase())
    : cities

  useEffect(() => {
    const handler = (e) => {
      if (!ref.current?.contains(e.target)) {
        setOpen(false)
        // If user typed something not in list, clear it
        if (!cities.includes(text)) { setText(''); onChange('') }
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [text, cities, onChange])

  const select = (city) => {
    setText(city)
    onChange(city)
    setOpen(false)
  }

  return (
    <div ref={ref} style={s.wrap}>
      <input
        style={s.input}
        placeholder={placeholder}
        value={text}
        onChange={e => { setText(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
        spellCheck="false"
      />
      {open && filtered.length > 0 && (
        <ul style={s.dropdown}>
          {filtered.map(city => (
            <li
              key={city}
              style={s.item}
              onMouseEnter={e => e.currentTarget.style.background = '#f0f4ff'}
              onMouseLeave={e => e.currentTarget.style.background = '#fff'}
              onMouseDown={e => { e.preventDefault(); select(city) }}
            >
              📍 {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
})

export default CityInput

const s = {
  wrap: { position: 'relative', flex: 1, minWidth: '180px', maxWidth: '240px' },
  input: { width: '100%', padding: '12px 16px', borderRadius: '8px', border: 'none', fontSize: '1rem', boxSizing: 'border-box', outline: 'none' },
  dropdown: { position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', zIndex: 9999, maxHeight: '220px', overflowY: 'auto', listStyle: 'none', margin: 0, padding: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' },
  item: { padding: '10px 16px', cursor: 'pointer', fontSize: '0.95rem', borderBottom: '1px solid #f5f5f5', background: '#fff' },
}
