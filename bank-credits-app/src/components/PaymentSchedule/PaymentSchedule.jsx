import { useState } from 'react'
import { convertFromBYN } from '../../api/exchangeRate'
import { CALCULATOR } from '../../locales'
import './paymentSchedule.css'

function PaymentSchedule({ schedule, term, currency, rate }) {
  const [showFull, setShowFull] = useState(false)
  if (!schedule || schedule.length === 0) return null

  const displayed = showFull ? schedule : schedule.slice(0, 6)
  const curr = currency || 'BYN'
  const r = rate || 1

  const totalPayment = convertFromBYN(schedule.reduce((s, row) => s + row.payment, 0), r)
  const totalInterest = convertFromBYN(schedule.reduce((s, row) => s + row.interest, 0), r)

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
                <td>{convertFromBYN(row.payment, r).toFixed(2)} {curr}</td>
                <td>{convertFromBYN(row.principal, r).toFixed(2)} {curr}</td>
                <td>{convertFromBYN(row.interest, r).toFixed(2)} {curr}</td>
                <td>{convertFromBYN(row.balance, r).toFixed(2)} {curr}</td>
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