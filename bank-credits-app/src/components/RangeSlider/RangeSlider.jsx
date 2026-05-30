import './rangeSlider.css'

function RangeSlider({ label, value, onChange, min, max, step, formatLabel }) {
  return (
    <div className="form-group range-slider">
      <label className="form-label">
        {label}: <strong>{formatLabel ? formatLabel(value) : value}</strong>
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