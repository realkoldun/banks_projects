import { useState } from 'react'
import { CALCULATOR } from '../../locales'
import './paymentSchedule.css'
function PaymentSchedule({ schedule, term }) {
  const [showFull, setShowFull] = useState(false)
  if (!schedule || schedule.length === 0) return null
  const displayed = showFull ? schedule : schedule.slice(0, 6)
  const curr = 'BYN'
  const totalPayment = schedule.reduce((s, row) => s + row.payment, 0)
  const totalInterest = schedule.reduce((s, row) => s + row.interest, 0)
  return (
    <div className="card payment-schedule">
      <div className="payment-schedule__header">
        <h3 className="payment-schedule__title">
          {CALCULATOR.scheduleTitle} {showFull ? CALCULATOR.allMonths(term) : CALCULATOR.firstMonths}
        </h3>
        {term > 6 && (
          <button className="btn btn-outline payment-schedule__toggle" onClick={() => setShowFull(!showFull)}>
            {showFull ? CALCULATOR.collapse : CALCULATOR.showAll}
          </button>
        )}
      </div>
      <div className="table-container" style={{
        maxHeight: showFull ? '500px' : 'auto',
        overflowY: showFull ? 'auto' : 'visible'
      }}>
        <table className="table">
          <thead>
            <tr>
              {CALCULATOR.scheduleCols.map(col => (
                <th key={col}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
              {displayed.map(row => (
              <tr key={row.month}>
                <td>{row.month}</td>
                <td>{row.payment.toFixed(2)} {curr}</td>
                <td>{row.principal.toFixed(2)} {curr}</td>
                <td>{row.interest.toFixed(2)} {curr}</td>
                <td>{row.balance.toFixed(2)} {curr}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {showFull && (
        <div className="payment-schedule__summary">
          {CALCULATOR.sumPayments}: {totalPayment.toFixed(2)} {curr} · {CALCULATOR.sumInterest}: {totalInterest.toFixed(2)} {curr}
        </div>
      )}
    </div>
  )
}
export default PaymentSchedule
