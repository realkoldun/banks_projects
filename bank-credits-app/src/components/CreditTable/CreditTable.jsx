import { creditTypes } from '../../data/banks'
import { COMPARE, CREDIT_TABLE, SHARED } from '../../locales'
import './creditTable.css'

function CreditTable({ products, getBankById, currency, rates }) {
  if (!products || products.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
        {COMPARE.noData}
      </div>
    )
  }

  const rate = rates?.[currency] || 1

  return (
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            {COMPARE.cols.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map(credit => {
            const bank = getBankById(credit.bankId)
            const convertedAmount = credit.maxAmount / rate
            return (
              <tr key={credit.id}>
                <td>
                  <div className="credit-table__bank-cell">
                    <span>{bank.logo}</span>
                    <span className="credit-table__bank-name">{bank.name}</span>
                  </div>
                </td>
                <td>{credit.name}</td>
                <td>
                  <span className="badge badge-success">{creditTypes[credit.type]}</span>
                </td>
                <td>
                  <span
                    className={`credit-table__rate ${
                      credit.rate < 10 ? 'credit-table__rate--low' : 'credit-table__rate--medium'
                    }`}
                  >
                    {SHARED.rate(credit.rate)}
                  </span>
                </td>
                <td>{CREDIT_TABLE.maxAmount(convertedAmount, currency)}</td>
                <td>{CREDIT_TABLE.maxTerm(credit.maxTerm)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default CreditTable