import { CALCULATOR } from '../../locales'
import { MIN_AMOUNT } from '../../constants'
import './amountInput.css'

function AmountInput({ label, value, onChange, maxAmount }) {
  const handleChange = (e) => {
    const raw = e.target.value.replace(/[^0-9]/g, '')
    const num = raw === '' ? 0 : parseInt(raw, 10)
    onChange(num)
  }

  const isBelowMin = value > 0 && value < MIN_AMOUNT
  const isOverMax = maxAmount > 0 && value > maxAmount

  return (
    <div className="form-group amount-input">
      <label className="form-label">{label}</label>
      <div className="amount-input__wrapper">
        <input
          type="text"
          className="amount-input__field"
          value={value}
          onChange={handleChange}
          inputMode="numeric"
        />
        <span className="amount-input__currency">BYN</span>
      </div>
      {isBelowMin && (
        <div className="amount-input__warning">
          Минимальная сумма кредита — {MIN_AMOUNT} BYN
        </div>
      )}
      {isOverMax && (
        <div className="amount-input__warning">
          Максимальная сумма для выбранного кредита — {(maxAmount / 1000).toFixed(0)} тыс. BYN
        </div>
      )}
    </div>
  )
}

export default AmountInput
