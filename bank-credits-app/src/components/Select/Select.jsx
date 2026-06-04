import './select.css'
function Select({ label, value, onChange, options, placeholder, className = '' }) {
  return (
    <div className={`select-group ${className}`}>
      {label && <label className="form-label">{label}</label>}
      <select
        className="form-select"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
export default Select
