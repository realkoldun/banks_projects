import { COMPARE, CREDIT_TABLE, SHARED } from '../../locales'
import './creditTable.css'

function CreditTable({ products, getBankById, creditTypes }) {
  if (!products || products.length === 0) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
        {COMPARE.noData}
      </div>
    )
  }

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
            return (
              <tr key={credit.id}>
                <td>
                  <div className="credit-table__bank-cell">
                    <span>{bank.logo}</span>
                    <span className="credit-table__bank-name">{bank.name}</span>
                  </div>
                </td>
                <td>
                  <div className="credit-table__name-cell">
                    {credit.name}
                    {credit.firstMonths && (
                      <span className="badge badge-promo">
                        {credit.firstMonths.rate}% первые {credit.firstMonths.months} мес.
                      </span>
                    )}
                  </div>
                </td>
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
                <td>{CREDIT_TABLE.maxAmount(credit.maxAmount, 'BYN')}</td>
                <td>{CREDIT_TABLE.maxTerm(credit.maxTerm)}</td>
                <td className="credit-table__special">{credit.specialTerms || '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default CreditTable