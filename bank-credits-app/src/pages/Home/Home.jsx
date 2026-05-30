import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import { banks, creditProducts, creditTypes } from '../../data/banks'
import { HOME } from '../../locales'
import StatsCards from '../../components/StatsCards'
import BankCard from '../../components/BankCard'
import './home.css'

function Home() {
  const stats = useMemo(() => {
    const totalBanks = banks.length
    const totalProducts = creditProducts.length
    const avgRate = (creditProducts.reduce((sum, c) => sum + c.rate, 0) / totalProducts).toFixed(2)
    const maxLoan = Math.max(...creditProducts.map(c => c.maxAmount))

    return [
      { value: totalBanks, label: HOME.stats[0].label },
      { value: totalProducts, label: HOME.stats[1].label },
      { value: `${avgRate}%`, label: HOME.stats[2].label },
      { value: `${(maxLoan / 1000).toFixed(0)} тыс.`, label: HOME.stats[3].label }
    ]
  }, [])

  const uniqueTypes = useMemo(
    () => [...new Set(creditProducts.map(c => c.type))],
    []
  )

  return (
    <div className="home">
      <section className="hero animate-in">
        <h1 className="page-title">{HOME.title}</h1>
        <p className="page-subtitle">{HOME.subtitle}</p>
        <div className="hero-actions">
          <Link to="/calculator" className="btn btn-primary">{HOME.calcBtn}</Link>
          <Link to="/compare" className="btn btn-outline">{HOME.compareBtn}</Link>
        </div>
      </section>

      <StatsCards stats={stats} />

      <section className="banks-overview animate-in stagger-2">
        <h2 className="home__section-title">{HOME.banksTitle}</h2>
        <div className="card-grid">
          {banks.map(bank => {
            const bankCredits = creditProducts.filter(c => c.bankId === bank.id)
            const minRate = Math.min(...bankCredits.map(c => c.rate), Infinity)

            return (
              <BankCard key={bank.id} bank={bank} creditCount={bankCredits.length} minRate={minRate} />
            )
          })}
        </div>
      </section>

      <section className="credit-types animate-in stagger-3">
        <h2 className="home__section-title">{HOME.typesTitle}</h2>
        <div className="card-grid">
          {uniqueTypes.map(type => {
            const typeCredits = creditProducts.filter(c => c.type === type)
            const avgTypeRate = (typeCredits.reduce((sum, c) => sum + c.rate, 0) / typeCredits.length).toFixed(2)

            return (
              <div key={type} className="card">
                <h3 className="home__type-title">{creditTypes[type]}</h3>
                <p className="home__type-count">{HOME.typeCount(typeCredits.length)}</p>
                <div className="home__type-footer">
                  <span className="home__type-label">{HOME.avgRateLabel}</span>
                  <span className="home__type-rate">{avgTypeRate}%</span>
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