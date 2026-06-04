import { useState, useEffect, useRef, useMemo } from 'react'
import { calcPayment } from '../../utils/creditCalc'
import { MIN_AMOUNT } from '../../constants'
import { useProductsFilter } from '../../hooks/useProductsFilter'
import RangeSlider from '../RangeSlider'
import AmountInput from '../AmountInput'
import Select from '../Select'
import BankSelect from '../BankSelect'
import { CALCULATOR, SHARED } from '../../locales'
import './compareCard.css'

function CompareCard({ credit, bank, initialAmount, initialTerm, banks, products }) {
  const [amount, setAmount] = useState(0)
  const [term, setTerm] = useState(0)
  const [paymentType, setPaymentType] = useState('annuity')
  const [bankFilter, setBankFilter] = useState('')
  const [localCreditId, setLocalCreditId] = useState('')
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
      setBankFilter(credit.bankId || '')
      setLocalCreditId(credit.id)
    }
  }, [credit, initialAmount, initialTerm])

  // Фильтрация продуктов по выбранному банку в CompareCard
  const filteredProducts = useProductsFilter(products || [], { bankId: bankFilter })

  // Если выбрали банк — сбрасываем выбранный кредит на первый из фильтра
  useEffect(() => {
    if (filteredProducts.length > 0) {
      if (!filteredProducts.find(p => p.id === localCreditId)) {
        setLocalCreditId(filteredProducts[0].id)
      }
    }
  }, [filteredProducts, localCreditId])

  // Активный кредит — либо по localCreditId, либо исходный
  const activeCredit = useMemo(
    () => filteredProducts.find(p => p.id === localCreditId) || credit,
    [filteredProducts, localCreditId, credit]
  )
  const activeBank = activeCredit
    ? banks?.find(b => b.id === activeCredit.bankId)
    : bank

  if (!credit && !activeCredit) return null

  const targetCredit = activeCredit || credit
  if (!targetCredit) return null

  const curr = 'BYN'
  // Защита от NaN — если значения невалидны, не считаем
  const safeAmount = amount && amount >= MIN_AMOUNT && amount <= (targetCredit.maxAmount || Infinity) ? amount : 0
  const safeTerm = term && term > 0 && term <= (targetCredit.maxTerm || Infinity) ? term : 0
  const isValid = safeAmount > 0 && safeTerm > 0

  const ratePerMonth = targetCredit.rate / 12 / 100
  const monthlyPayment = isValid ? calcPayment(safeAmount, ratePerMonth, safeTerm, paymentType) : 0
  const totalPayment = isValid ? monthlyPayment * safeTerm : 0
  const overpayment = isValid ? totalPayment - safeAmount : 0

  return (
    <div className="card compare-card">
      <div className="compare-card__header">
        <span className="compare-card__logo">{activeBank?.logo}</span>
        <div>
          <div className="compare-card__bank-name">{activeBank?.name}</div>
          <div className="compare-card__product-name">{targetCredit.name}</div>
        </div>
      </div>

      {banks && (
        <BankSelect
          banks={banks}
          value={bankFilter}
          onChange={setBankFilter}
          label="Банк"
        />
      )}

      {filteredProducts.length > 1 && (
        <Select
          label={CALCULATOR.productLabel}
          value={localCreditId}
          onChange={setLocalCreditId}
          options={filteredProducts.map(c => ({
            value: c.id,
            label: `${c.name} (${c.rate}%)`
          }))}
        />
      )}

      <AmountInput
        label={CALCULATOR.amountLabel}
        value={amount}
        onChange={setAmount}
        maxAmount={targetCredit.maxAmount}
      />

      <RangeSlider
        label={CALCULATOR.termLabel}
        value={term}
        onChange={setTerm}
        min={6}
        max={targetCredit.maxTerm}
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
          <span className="compare-card__rate">{targetCredit.rate}%</span>
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
