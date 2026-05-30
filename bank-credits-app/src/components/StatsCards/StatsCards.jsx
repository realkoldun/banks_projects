import './statsCards.css'

function StatsCards({ stats }) {
  return (
    <section className="stats animate-in stagger-1">
      <div className="card-grid">
        {stats.map((stat, i) => (
          <div key={i} className="card stat-card">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default StatsCards