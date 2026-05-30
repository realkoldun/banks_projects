import { CURRENCY } from '../../locales'
import './currencyToggle.css'

const currencies = Object.keys(CURRENCY.symbols)

function CurrencyToggle({ value, onChange }) {
  return (
    <div className="currency-toggle">
      <label className="form-label">{CURRENCY.label}</label>
      <div className="currency-toggle__buttons">
        {currencies.map(curr => (
          <button
            key={curr}
            className={`currency-toggle__btn ${value === curr ? 'currency-toggle__btn--active' : ''}`}
            onClick={() => onChange(curr)}
            title={CURRENCY[curr]}
          >
            <span className="currency-toggle__icon">{CURRENCY.symbols[curr]}</span>
            <span className="currency-toggle__code">{curr}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default CurrencyToggle