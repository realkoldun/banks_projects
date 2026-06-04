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

function CompareCard({ initialAmount, initialTerm, banks, products, excludeCreditId }) {
  const [amount, setAmount] = useState(0)
  const [term, setTerm] = useState(0)
  const [paymentType, setPaymentType] = useState('annuity')
  const [bankFilter, setBankFilter] = useState('')
  const [localCreditId, setLocalCreditId] = useState('')
  const initialized = useRef(false)

  // Инициализация суммы/срока один раз (из основного калькулятора)
  useEffect(() => {
    if (initialized.current) return
    const safeAmount = initialAmount && initialAmount >= MIN_AMOUNT ? initialAmount : 10000
    const safeTerm = initialTerm && initialTerm > 0 ? initialTerm : 24
    setAmount(safeAmount)
    setTerm(safeTerm)
    initialized.current = true
  }, [initialAmount, initialTerm])

  // Фильтрация по банку + исключаем кредит основного калькулятора
  const filteredProducts = useProductsFilter(products || [], { bankId: bankFilter })
    .filter(p => p.id !== excludeCreditId)

  // Если выбранный кредит не попадает в фильтр — ставим первый
  useEffect(() => {
    if (filteredProducts.length === 0) {
      setLocalCreditId('')
      return
    }
    if (!filteredProducts.find(p => p.id === localCreditId)) {
      setLocalCreditId(filteredProducts[0].id)
    }
  }, [filteredProducts, localCreditId])

  const activeCredit = useMemo(
    () => filteredProducts.find(p => p.id === localCreditId) || null,
    [filteredProducts, localCreditId]
  )
  const activeBank = activeCredit
    ? banks?.find(b => b.id === activeCredit.bankId)
    : null

  if (!activeCredit) {
    return (
      <div className="card compare-card">
        <div className="compare-card__empty">
          {bankFilter
            ? 'Нет других кредитов выбранного банка для сравнения'
            : 'Выберите банк или сбросьте фильтр'}
        </div>
      </div>
    )
  }

  const curr = 'BYN'
  // Защита от NaN
  const safeAmount = amount && amount >= MIN_AMOUNT && amount <= (activeCredit.maxAmount || Infinity) ? amount : 0
  const safeTerm = term && term > 0 && term <= (activeCredit.maxTerm || Infinity) ? term : 0
  const isValid = safeAmount > 0 && safeTerm > 0

  const ratePerMonth = activeCredit.rate / 12 / 100
  const monthlyPayment = isValid ? calcPayment(safeAmount, ratePerMonth, safeTerm, paymentType) : 0
  const totalPayment = isValid ? monthlyPayment * safeTerm : 0
  const overpayment = isValid ? totalPayment - safeAmount : 0

  return (
    <div className="card compare-card">
      <div className="compare-card__header">
        <span className="compare-card__logo">{activeBank?.logo}</span>
        <div>
          <div className="compare-card__bank-name">{activeBank?.name}</div>
          <div className="compare-card__product-name">{activeCredit.name}</div>
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
          options={filteredProducts.map(c => {
            // Показываем банк только когда выбраны все банки
            const b = banks?.find(bk => bk.id === c.bankId)
            const bankPrefix = !bankFilter && b ? `${b.logo} ${b.name} — ` : ''
            return { value: c.id, label: `${bankPrefix}${c.name} (${c.rate}%)` }
          })}
        />
      )}

      <AmountInput
        label={CALCULATOR.amountLabel}
        value={amount}
        onChange={setAmount}
        maxAmount={activeCredit.maxAmount}
      />

      <RangeSlider
        label={CALCULATOR.termLabel}
        value={term}
        onChange={setTerm}
        min={6}
        max={activeCredit.maxTerm}
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
          <span className="compare-card__rate">{activeCredit.rate}%</span>
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
