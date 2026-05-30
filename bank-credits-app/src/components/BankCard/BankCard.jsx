import './bankCard.css'

function BankCard({ bank, creditCount, minRate }) {
  return (
    <div className="card bank-card" style={{ borderLeft: `4px solid ${bank.color}` }}>
      <div className="bank-card__header">
        <span className="bank-card__logo">{bank.logo}</span>
        <div>
          <h3 className="bank-card__name">{bank.name}</h3>
          <span className="badge badge-success">Доля рынка: {bank.marketShare}%</span>
        </div>
      </div>
      <div className="bank-card__info">
        <div>Кредитных продуктов: <strong>{creditCount}</strong></div>
        <div>
          Мин. ставка:{' '}
          <strong className="bank-card__rate">
            {minRate === Infinity ? '—' : `${minRate}%`}
          </strong>
        </div>
        <div>Доля физ. лиц: <strong>{bank.physicalLoansShare}%</strong></div>
      </div>
    </div>
  )
}

export default BankCard