import { useRef, useEffect } from 'react'
import './rangeSlider.css'
function RangeSlider({ label, value, onChange, min, max, step, formatLabel, editable }) {
  const inputRef = useRef(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${Math.min(Math.max(value.toString().length, 5), 12)}ch`
    }
  }, [value])
  const handleInputChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    const num = raw === '' ? min : parseInt(raw, 10)
    onChange(Math.min(Math.max(num, min), max))
  }
  return (
    <div className="form-group range-slider">
      <label className="form-label">
        {label}:{' '}
        {editable ? (
          <input
            ref={inputRef}
            type="text"
            className="range-slider__input-text"
            value={value}
            onChange={handleInputChange}
            onBlur={() => {
              if (!value || value < min) onChange(min)
            }}
          />
        ) : (
          <strong>{formatLabel ? formatLabel(value) : value}</strong>
        )}
      </label>
      <input
        type="range"
        className="range-slider__input"
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
      />
      <div className="range-slider__bounds">
        <span>{formatLabel ? formatLabel(min) : min}</span>
        <span>{formatLabel ? formatLabel(max) : max}</span>
      </div>
    </div>
  )
}
export default RangeSlider
