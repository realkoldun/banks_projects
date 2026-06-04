import { SHARED } from '../../locales'
import './bankCard.css'
function BankCard({ bank, creditCount, minRate }) {
  return (
    <div className="card bank-card" style={{ borderLeft: `4px solid ${bank.color}` }}>
      <div className="bank-card__header">
        <span className="bank-card__logo">{bank.logo}</span>
        <div>
          <h3 className="bank-card__name">{bank.name}</h3>
          <span className="badge badge-success">{SHARED.marketShareLabel(bank.marketShare)}</span>
        </div>
      </div>
      <div className="bank-card__info">
        <div>{SHARED.productsCountLabel}: <strong>{creditCount}</strong></div>
        <div>
          {SHARED.minRateLabel}:{' '}
          <strong className="bank-card__rate">
            {minRate === Infinity ? SHARED.dash : SHARED.rateValue(minRate)}
          </strong>
        </div>
        <div>{SHARED.physicalShareLabel}: <strong>{SHARED.rateValue(bank.physicalLoansShare)}</strong></div>
      </div>
    </div>
  )
}
export default BankCard
