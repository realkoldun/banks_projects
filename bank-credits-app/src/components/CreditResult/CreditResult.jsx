import { CALCULATOR, SHARED } from '../../locales'
import './creditResult.css'

function CreditResult({ bank, credit, amount, term, monthlyPayment, totalPayment, overpayment, paymentType, currency, rate }) {
  return (
    <div className="card credit-result" style={{ flex: 1, minWidth: '280px' }}>
      <div className="credit-result__header">
        <span className="credit-result__logo">{bank?.logo}</span>
        <div>
          <div className="credit-result__bank-name">{bank?.name}</div>
          <div className="credit-result__product-name">{credit?.name}</div>
        </div>
      </div>

      <div className="result-box">
        <div className="result-row">
          <span>{CALCULATOR.amountLabel}</span>
          <span className="credit-result__amount">{amount.toLocaleString()} {currency}</span>
        </div>
        <div className="result-row">
          <span>{SHARED.rate_label}</span>
          <span className="credit-result__rate">{SHARED.rate(rate)}</span>
        </div>
        <div className="result-row">
          <span>{CALCULATOR.termLabel}</span>
          <span>{SHARED.months(term)} ({SHARED.years(term)})</span>
        </div>
        <div className="result-row">
          <span>{paymentType === 'annuity' ? CALCULATOR.monthlyPayment : CALCULATOR.firstPayment}</span>
          <span className="credit-result__payment">{monthlyPayment.toFixed(2)} {currency}</span>
        </div>
        <div className="result-row">
          <span>{CALCULATOR.totalAmount}</span>
          <span>{totalPayment.toFixed(2)} {currency}</span>
        </div>
        <div className="result-row total">
          <span>{CALCULATOR.overpayment}</span>
          <span className="credit-result__overpayment">
            {overpayment.toFixed(2)} {currency} ({((overpayment / (amount || 1)) * 100).toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  )
}

export default CreditResult