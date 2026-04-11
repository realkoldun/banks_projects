import { useState } from 'react'
import { banks, creditProducts, getBankById, creditTypes } from '../data/banks'

function Compare() {
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('rate')

  const uniqueTypes = [...new Set(creditProducts.map(c => c.type))]

  let filtered = selectedType === 'all' 
    ? [...creditProducts] 
    : creditProducts.filter(c => c.type === selectedType)

  const sorted = filtered.sort((a, b) => {
    if (sortBy === 'rate') return a.rate - b.rate
    if (sortBy === 'amount') return b.maxAmount - a.maxAmount
    if (sortBy === 'term') return b.maxTerm - a.maxTerm
    return 0
  })

  return (
    <div className="compare-page">
      <h1 className="page-title animate-in">Сравнение кредитов</h1>
      <p className="page-subtitle animate-in stagger-1">
        Сравните условия различных банков и выберите оптимальный вариант
      </p>

      <div className="card animate-in stagger-2" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
            <label className="form-label">Тип кредита</label>
            <select 
              className="form-select"
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">Все типы</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{creditTypes[type]}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
            <label className="form-label">Сортировка</label>
            <select 
              className="form-select"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="rate">По ставке (возр.)</option>
              <option value="amount">По сумме (убыв.)</option>
              <option value="term">По сроку (убыв.)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-container animate-in stagger-3">
        <table className="table">
          <thead>
            <tr>
              <th>Банк</th>
              <th>Название</th>
              <th>Тип</th>
              <th>Ставка</th>
              <th>Макс. сумма</th>
              <th>Макс. срок</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(credit => {
              const bank = getBankById(credit.bankId)
              return (
                <tr key={credit.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{bank.logo}</span>
                      <span style={{ fontWeight: 500 }}>{bank.name}</span>
                    </div>
                  </td>
                  <td>{credit.name}</td>
                  <td>
                    <span className="badge badge-success">{creditTypes[credit.type]}</span>
                  </td>
                  <td>
                    <span style={{ 
                      fontFamily: 'var(--font-display)', 
                      fontSize: '1.1rem',
                      color: credit.rate < 10 ? 'var(--color-success)' : 'var(--color-warning)'
                    }}>
                      {credit.rate}%
                    </span>
                  </td>
                  <td>{(credit.maxAmount / 1000).toFixed(0)}K {credit.currency}</td>
                  <td>{Math.floor(credit.maxTerm / 12)} лет {credit.maxTerm % 12} мес</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-text-muted)' }}>
          Нет кредитных продуктов для отображения
        </div>
      )}
    </div>
  )
}

export default Compare
