import { Link } from 'react-router-dom'
import { banks, creditProducts, creditTypes } from '../data/banks'

function Home() {
  const totalBanks = banks.length
  const totalProducts = creditProducts.length
  const avgRate = (creditProducts.reduce((sum, c) => sum + c.rate, 0) / creditProducts.length).toFixed(2)
  const maxLoan = Math.max(...creditProducts.map(c => c.maxAmount))

  const uniqueTypes = [...new Set(creditProducts.map(c => c.type))]

  return (
    <div className="home">
      <section className="hero animate-in">
        <h1 className="page-title">Оптимизация кредитных услуг</h1>
        <p className="page-subtitle">
          Анализ и сравнение кредитных продуктов банков Республики Беларусь. 
          Найдите лучшие условия для ваших финансовых задач.
        </p>
        <div className="hero-actions">
          <Link to="/calculator" className="btn btn-primary">Рассчитать кредит</Link>
          <Link to="/compare" className="btn btn-outline">Сравнить банки</Link>
        </div>
      </section>

      <section className="stats animate-in stagger-1">
        <div className="card-grid">
          <div className="card stat-card">
            <div className="stat-value">{totalBanks}</div>
            <div className="stat-label">Банков в анализе</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{totalProducts}</div>
            <div className="stat-label">Кредитных продуктов</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{avgRate}%</div>
            <div className="stat-label">Средняя ставка</div>
          </div>
          <div className="card stat-card">
            <div className="stat-value">{(maxLoan / 1000).toFixed(0)}K</div>
            <div className="stat-label">Макс. сумма (BYN)</div>
          </div>
        </div>
      </section>

      <section className="banks-overview animate-in stagger-2">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
          Банки-участники
        </h2>
        <div className="card-grid">
          {banks.map(bank => {
            const bankCredits = creditProducts.filter(c => c.bankId === bank.id)
            const minRate = Math.min(...bankCredits.map(c => c.rate), Infinity)
            
            return (
              <div key={bank.id} className="card" style={{ borderLeft: `4px solid ${bank.color}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '2rem' }}>{bank.logo}</span>
                  <div>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>{bank.name}</h3>
                    <span className="badge badge-success">Доля рынка: {bank.marketShare}%</span>
                  </div>
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  <div>Кредитных продуктов: <strong style={{ color: 'var(--color-text)' }}>{bankCredits.length}</strong></div>
                  <div>Мин. ставка: <strong style={{ color: 'var(--color-success)' }}>{minRate === Infinity ? '—' : `${minRate}%`}</strong></div>
                  <div>Доля физ. лиц: <strong style={{ color: 'var(--color-text)' }}>{bank.physicalLoansShare}%</strong></div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section className="credit-types animate-in stagger-3">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', marginBottom: '1.5rem' }}>
          Типы кредитов
        </h2>
        <div className="card-grid">
          {uniqueTypes.map(type => {
            const typeCredits = creditProducts.filter(c => c.type === type)
            const avgTypeRate = (typeCredits.reduce((sum, c) => sum + c.rate, 0) / typeCredits.length).toFixed(2)
            
            return (
              <div key={type} className="card">
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>
                  {creditTypes[type]}
                </h3>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                  Доступно {typeCredits.length} продуктов
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Средняя ставка</span>
                  <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-accent)' }}>
                    {avgTypeRate}%
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default Home
