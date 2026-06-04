import { CALCULATOR } from '../../locales'
import './paymentChart.css'
function PaymentChart({ totalPrincipal, totalInterest, currency }) {
  const total = totalPrincipal + totalInterest
  if (total === 0) return null
  const radius = 45
  const cx = 60
  const cy = 60
  const strokeWidth = 12
  const principalPct = (totalPrincipal / total) * 100
  const interestPct = (totalInterest / total) * 100
  const principalArc = 360 * (principalPct / 100)
  const interestArc = 360 * (interestPct / 100)
  const startA = -90
  const principalEndA = startA + principalArc
  const interestEndA = principalEndA + interestArc
  const toRad = (deg) => (deg * Math.PI) / 180
  const polar = (cx, cy, r, deg) => ({
    x: cx + r * Math.cos(toRad(deg)),
    y: cy + r * Math.sin(toRad(deg))
  })
  const buildArc = (startDeg, endDeg) => {
    const start = polar(cx, cy, radius, startDeg)
    const end = polar(cx, cy, radius, endDeg)
    const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0
    const sweep = endDeg > startDeg ? 1 : 0
    return `M ${start.x} ${start.y} A ${radius} ${radius} 0 ${largeArc} ${sweep} ${end.x} ${end.y}`
  }
  const principalPath = principalPct > 0 ? buildArc(startA, principalEndA) : ''
  const interestPath = interestPct > 0 ? buildArc(principalEndA, interestEndA) : ''
  const curr = currency || 'BYN'
  return (
    <div className="payment-chart">
      <svg className="payment-chart__svg" viewBox="0 0 120 120">
        <circle
          className="payment-chart__bg"
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
        />
        {principalPath && (
          <path
            className="payment-chart__principal"
            d={principalPath}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
          />
        )}
        {interestPath && (
          <path
            className="payment-chart__interest"
            d={interestPath}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="butt"
          />
        )}
        <text x={cx} y={cy - 2} textAnchor="middle" className="payment-chart__value" fontSize="14" fontWeight="700">
          {Math.round(total).toLocaleString()}
        </text>
        <text x={cx} y={cy + 14} textAnchor="middle" className="payment-chart__currency" fontSize="9">
          {curr}
        </text>
      </svg>
      <div className="payment-chart__legend">
        <div className="payment-chart__legend-item">
          <span className="payment-chart__dot payment-chart__dot--principal" />
          <span>{CALCULATOR.principalLabel} — {Math.round(totalPrincipal).toLocaleString()} {curr} ({principalPct.toFixed(1)}%)</span>
        </div>
        <div className="payment-chart__legend-item">
          <span className="payment-chart__dot payment-chart__dot--interest" />
          <span>{CALCULATOR.interestLabel} — {Math.round(totalInterest).toLocaleString()} {curr} ({interestPct.toFixed(1)}%)</span>
        </div>
      </div>
    </div>
  )
}
export default PaymentChart
