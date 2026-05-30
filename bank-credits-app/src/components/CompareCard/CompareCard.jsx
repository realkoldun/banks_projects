import { useState, useEffect } from 'react'
import { calcPayment } from '../../utils/creditCalc'
import { convertFromBYN } from '../../api/exchangeRate'
import RangeSlider from '../RangeSlider'
import Select from '../Select'
import { CALCULATOR, SHARED } from '../../locales'
import './compareCard.css'

function CompareCard({ credit, bank, currency, rates }) {
  const [amount, setAmount] = useState(credit ? 10000 : 0)
  const [term, setTerm] = useState(credit ? 24 : 0)
  const [paymentType, setPaymentType] = useState('annuity')

  useEffect(() => {
    if (credit) {
      setAmount(prev => Math.min(prev, credit.maxAmount))
      setTerm(prev => Math.min(prev, credit.maxTerm))
    }
  }, [credit])

  if (!credit) return null

  const curr = currency || 'BYN'
  const r = rates?.[curr] || 1
  const ratePerMonth = credit.rate / 12 / 100
  const monthlyPaymentBYN = calcPayment(amount, ratePerMonth, term, paymentType)
  const totalPaymentBYN = monthlyPaymentBYN * term
  const overpaymentBYN = totalPaymentBYN - amount
  const monthlyPayment = convertFromBYN(monthlyPaymentBYN, r)
  const totalPayment = convertFromBYN(totalPaymentBYN, r)
  const overpayment = convertFromBYN(overpaymentBYN, r)

  return (
    <div className="card compare-card">
      <div className="compare-card__header">
        <span className="compare-card__logo">{bank?.logo}</span>
        <div>
          <div className="compare-card__bank-name">{bank?.name}</div>
          <div className="compare-card__product-name">{credit.name}</div>
        </div>
      </div>

      <RangeSlider
        label={CALCULATOR.amountLabel}
        value={amount}
        onChange={setAmount}
        min={1000}
        max={credit.maxAmount}
        step={1000}
        formatLabel={v => `${convertFromBYN(v, r).toLocaleString()} ${curr}`}
      />

      <RangeSlider
        label={CALCULATOR.termLabel}
        value={term}
        onChange={setTerm}
        min={6}
        max={credit.maxTerm}
        step={1}
        formatLabel={v => `${CALCULATOR.months(v)} (${CALCULATOR.years(v)})`}
      />

      <Select
        label={CALCULATOR.paymentTypeLabel}
        value={paymentType}
        onChange={setPaymentType}
        options={[
          { value: 'annuity', label: CALCULATOR.annuity },
          { value: 'differentiated', label: CALCULATOR.differentiated }
        ]}
      />

      <div className="result-box compare-card__result">
        <div className="result-row">
          <span>{SHARED.rate_label}</span>
          <span className="compare-card__rate">{credit.rate}%</span>
        </div>
        <div className="result-row">
          <span>{CALCULATOR.summaryPayment}</span>
          <span className="compare-card__payment">{monthlyPayment.toFixed(2)} {curr}</span>
        </div>
        <div className="result-row">
          <span>{CALCULATOR.totalAmount}</span>
          <span>{totalPayment.toFixed(2)} {curr}</span>
        </div>
        <div className="result-row total">
          <span>{CALCULATOR.summaryOverpayment}</span>
          <span className="compare-card__overpayment">
            {overpayment.toFixed(2)} {curr} ({((overpayment / (convertFromBYN(amount, r) || 1)) * 100).toFixed(1)}%)
          </span>
        </div>
      </div>
    </div>
  )
}

export default CompareCard