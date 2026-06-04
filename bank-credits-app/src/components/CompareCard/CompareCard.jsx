import { useState, useEffect, useRef } from 'react'
import { calcPayment } from '../../utils/creditCalc'
import { MIN_AMOUNT } from '../../constants'
import RangeSlider from '../RangeSlider'
import AmountInput from '../AmountInput'
import Select from '../Select'
import { CALCULATOR, SHARED } from '../../locales'
import './compareCard.css'

function CompareCard({ credit, bank, initialAmount, initialTerm }) {
  const [amount, setAmount] = useState(0)
  const [term, setTerm] = useState(0)
  const [paymentType, setPaymentType] = useState('annuity')
  const lastCreditId = useRef(null)

  useEffect(() => {
    if (credit && credit.id !== lastCreditId.current) {
      lastCreditId.current = credit.id
      // Инициализируем значения из основного калькулятора
      const safeAmount = initialAmount && initialAmount >= MIN_AMOUNT
        ? Math.min(initialAmount, credit.maxAmount || initialAmount)
        : Math.min(10000, credit.maxAmount || 10000)
      const safeTerm = initialTerm && initialTerm > 0
        ? Math.min(initialTerm, credit.maxTerm || initialTerm)
        : Math.min(24, credit.maxTerm || 24)
      setAmount(safeAmount)
      setTerm(safeTerm)
    }
  }, [credit, initialAmount, initialTerm])

  if (!credit) return null

  const curr = 'BYN'
  // Защита от NaN — если значения невалидны, не считаем
  const safeAmount = amount && amount >= MIN_AMOUNT && amount <= (credit.maxAmount || Infinity) ? amount : 0
  const safeTerm = term && term > 0 && term <= (credit.maxTerm || Infinity) ? term : 0
  const isValid = safeAmount > 0 && safeTerm > 0

  const ratePerMonth = credit.rate / 12 / 100
  const monthlyPayment = isValid ? calcPayment(safeAmount, ratePerMonth, safeTerm, paymentType) : 0
  const totalPayment = isValid ? monthlyPayment * safeTerm : 0
  const overpayment = isValid ? totalPayment - safeAmount : 0

  return (
    <div className="card compare-card">
      <div className="compare-card__header">
        <span className="compare-card__logo">{bank?.logo}</span>
        <div>
          <div className="compare-card__bank-name">{bank?.name}</div>
          <div className="compare-card__product-name">{credit.name}</div>
        </div>
      </div>

      <AmountInput
        label={CALCULATOR.amountLabel}
        value={amount}
        onChange={setAmount}
        maxAmount={credit.maxAmount}
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
          <span className="compare-card__payment">{isValid ? monthlyPayment.toFixed(2) : '—'} {curr}</span>
        </div>
        <div className="result-row">
          <span>{CALCULATOR.totalAmount}</span>
          <span>{isValid ? totalPayment.toFixed(2) : '—'} {curr}</span>
        </div>
        <div className="result-row total">
          <span>{CALCULATOR.summaryOverpayment}</span>
          <span className="compare-card__overpayment">
            {isValid ? `${overpayment.toFixed(2)} (${((overpayment / safeAmount) * 100).toFixed(1)}%)` : '—'} {curr}
          </span>
        </div>
      </div>
    </div>
  )
}

export default CompareCard
