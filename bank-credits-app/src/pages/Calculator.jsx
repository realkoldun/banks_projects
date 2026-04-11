import { useState } from 'react'
import { creditProducts, getBankById } from '../data/banks'

function Calculator() {
  const [amount, setAmount] = useState(10000)
  const [term, setTerm] = useState(24)
  const [selectedCredit, setSelectedCredit] = useState(creditProducts[0].id)
  const [paymentType, setPaymentType] = useState('annuity')

  const credit = creditProducts.find(c => c.id === selectedCredit) || creditProducts[0]
  const bank = getBankById(credit.bankId)

  const ratePerMonth = credit.rate / 12 / 100
  
  let monthlyPayment, totalPayment, overpayment
  
  if (paymentType === 'annuity') {
    if (ratePerMonth === 0) {
      monthlyPayment = amount / term
    } else {
      const k = Math.pow(1 + ratePerMonth, term)
      monthlyPayment = amount * (ratePerMonth * k) / (k - 1)
    }
    totalPayment = monthlyPayment * term
    overpayment = totalPayment - amount
  } else {
    const basePayment = amount / term
    let totalInterest = 0
    for (let i = 0; i < term; i++) {
      totalInterest += (amount - basePayment * i) * ratePerMonth
    }
    monthlyPayment = basePayment + amount * ratePerMonth
    totalPayment = amount + totalInterest
    overpayment = totalInterest
  }

  return (
    <div className="calculator-page">
      <h1 className="page-title animate-in">Кредитный калькулятор</h1>
      <p className="page-subtitle animate-in stagger-1">
        Рассчитайте ежемесячный платёж и переплату по кредиту
      </p>

      <div className="card animate-in stagger-2" style={{ marginBottom: '2rem' }}>
        <div className="form-group">
          <label className="form-label">Кредитный продукт</label>
          <select 
            className="form-select"
            value={selectedCredit}
            onChange={(e) => setSelectedCredit(e.target.value)}
          >
            {creditProducts.map(c => (
              <option key={c.id} value={c.id}>
                {getBankById(c.bankId).logo} {getBankById(c.bankId).name} — {c.name} ({c.rate}%)
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Сумма кредита (BYN)</label>
            <input 
              type="number"
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={1000}
              max={credit.maxAmount}
            />
            <small style={{ color: 'var(--color-text-muted)' }}>
              Максимум: {(credit.maxAmount / 1000).toFixed(0)}K BYN
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Срок (месяцев)</label>
            <input 
              type="number"
              className="form-input"
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              min={6}
              max={credit.maxTerm}
            />
            <small style={{ color: 'var(--color-text-muted)' }}>
              Максимум: {credit.maxTerm} мес
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Тип платежа</label>
            <select 
              className="form-select"
              value={paymentType}
              onChange={(e) => setPaymentType(e.target.value)}
            >
              <option value="annuity">Аннуитетный</option>
              <option value="differentiated">Дифференцированный</option>
            </select>
          </div>
        </div>
      </div>

      <div className="result-box animate-in stagger-3">
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', marginBottom: '1rem' }}>
          Результаты расчёта
        </h3>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem', 
          marginBottom: '1rem',
          padding: '0.75rem',
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-sm)'
        }}>
          <span style={{ fontSize: '1.5rem' }}>{bank.logo}</span>
          <span style={{ fontWeight: 600 }}>{bank.name}</span>
          <span style={{ color: 'var(--color-text-muted)' }}>— {credit.name}</span>
        </div>

        <div className="result-row">
          <span>Сумма кредита</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
            {amount.toLocaleString()} BYN
          </span>
        </div>
        
        <div className="result-row">
          <span>Процентная ставка</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--color-accent)' }}>
            {credit.rate}%
          </span>
        </div>
        
        <div className="result-row">
          <span>Срок кредита</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
            {term} мес ({(term / 12).toFixed(1)} лет)
          </span>
        </div>
        
        <div className="result-row">
          <span>
            {paymentType === 'annuity' ? 'Ежемесячный платёж' : 'Первый платёж'}
          </span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--color-success)' }}>
            {monthlyPayment.toFixed(2)} BYN
          </span>
        </div>
        
        <div className="result-row">
          <span>Общая сумма выплат</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
            {totalPayment.toFixed(2)} BYN
          </span>
        </div>
        
        <div className="result-row total">
          <span>Переплата по кредиту</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--color-warning)' }}>
            {overpayment.toFixed(2)} BYN ({((overpayment / amount) * 100).toFixed(1)}%)
          </span>
        </div>
      </div>

      <div className="card animate-in stagger-4" style={{ marginTop: '2rem' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: '1rem' }}>График платежей (первые 6 месяцев)</h3>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Месяц</th>
                <th>Платёж</th>
                <th>Основной долг</th>
                <th>Проценты</th>
                <th>Остаток</th>
              </tr>
            </thead>
            <tbody>
              {(() => {
                const rows = []
                let balance = amount
                const basePayment = paymentType === 'annuity' 
                  ? monthlyPayment 
                  : amount / term

                for (let i = 1; i <= Math.min(term, 6); i++) {
                  const interest = balance * ratePerMonth
                  const principal = basePayment - interest
                  balance -= principal
                  
                  rows.push(
                    <tr key={i}>
                      <td>{i}</td>
                      <td>{(interest + principal).toFixed(2)} BYN</td>
                      <td>{principal.toFixed(2)} BYN</td>
                      <td>{interest.toFixed(2)} BYN</td>
                      <td>{Math.max(balance, 0).toFixed(2)} BYN</td>
                    </tr>
                  )
                }
                return rows
              })()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Calculator
