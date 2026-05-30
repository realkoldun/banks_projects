import { CALCULATOR } from '../../locales'
import './paymentChart.css'

function PaymentChart({ totalPrincipal, totalInterest, currency }) {
  const total = totalPrincipal + totalInterest
  if (total === 0) return null
  const pct = (totalPrincipal / total) * 100
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (pct / 100) * circumference
  const curr = currency || 'BYN'

  return (
    <div className="payment-chart">
      <svg className="payment-chart__svg" viewBox="0 0 120 120">
        <circle className="payment-chart__bg" cx="60" cy="60" r="54" fill="none" strokeWidth="12" />
        <circle
          className="payment-chart__fill"
          cx="60" cy="60" r="54"
          fill="none" strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="56" textAnchor="middle" className="payment-chart__value" fontSize="16" fontWeight="700">
          {Math.round(totalPrincipal).toLocaleString()}
        </text>
        <text x="60" y="72" textAnchor="middle" className="payment-chart__currency" fontSize="10">
          {curr}
        </text>
      </svg>
      <div className="payment-chart__legend">
        <div className="payment-chart__legend-item">
          <span className="payment-chart__dot payment-chart__dot--principal" />
          <span>{CALCULATOR.principalLabel} — {Math.round(totalPrincipal).toLocaleString()} {curr}</span>
        </div>
        <div className="payment-chart__legend-item">
          <span className="payment-chart__dot payment-chart__dot--interest" />
          <span>{CALCULATOR.interestLabel} — {Math.round(totalInterest).toLocaleString()} {curr}</span>
        </div>
      </div>
    </div>
  )
}

export default PaymentChart