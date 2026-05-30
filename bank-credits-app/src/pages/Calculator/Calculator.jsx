import { useState, useEffect, useMemo } from 'react'
import { useBanksData, getBankById } from '../../hooks/useBanksData'
import { calcPayment, buildSchedule } from '../../utils/creditCalc'
import { useExchangeRates } from '../../hooks/useExchangeRates'
import { convertFromBYN } from '../../api/exchangeRate'
import { CALCULATOR, SHARED } from '../../locales'
import Select from '../../components/Select'
import RangeSlider from '../../components/RangeSlider'
import CurrencyToggle from '../../components/CurrencyToggle'
import CreditResult from '../../components/CreditResult'
import PaymentChart from '../../components/PaymentChart'
import PaymentSchedule from '../../components/PaymentSchedule'
import CompareCard from '../../components/CompareCard'
import './calculator.css'

const STORAGE_KEY = 'bank-calc-last'

function loadLastState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return null
}

function Calculator() {
  const { banks, products, loading: dataLoading, error: dataError } = useBanksData()

  const last = loadLastState()
  const [selectedCredit, setSelectedCredit] = useState(last?.creditId || '')
  const [amount, setAmount] = useState(last?.amount || 10000)
  const [term, setTerm] = useState(last?.term || 24)
  const [paymentType, setPaymentType] = useState(last?.paymentType || 'annuity')
  const [currency, setCurrency] = useState(last?.currency || 'BYN')
  const [showCompare, setShowCompare] = useState(false)
  const [compareCredit, setCompareCredit] = useState('')

  const { rates } = useExchangeRates()

  const credit = products.find(c => c.id === selectedCredit) || products[0]
  const bank = credit ? getBankById(banks, credit.bankId) : null
  const rate = rates?.[currency] || 1
  const ratePerMonth = credit ? credit.rate / 12 / 100 : 0
  const monthlyPaymentBYN = credit ? calcPayment(amount, ratePerMonth, term, paymentType) : 0
  const totalPaymentBYN = monthlyPaymentBYN * term
  const overpaymentBYN = totalPaymentBYN - amount

  const schedule = useMemo(
    () => buildSchedule(amount, ratePerMonth, term, monthlyPaymentBYN, paymentType),
    [amount, ratePerMonth, term, monthlyPaymentBYN, paymentType]
  )

  const totalInterestBYN = schedule.reduce((s, r) => s + r.interest, 0)
  const otherCredit = compareCredit ? products.find(c => c.id === compareCredit) : null
  const otherBank = otherCredit ? getBankById(banks, otherCredit.bankId) : null

  const monthlyPayment = convertFromBYN(monthlyPaymentBYN, rate)
  const totalPayment = convertFromBYN(totalPaymentBYN, rate)
  const overpayment = convertFromBYN(overpaymentBYN, rate)
  const amountDisplay = convertFromBYN(amount, rate)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        creditId: selectedCredit, amount, term, paymentType, currency
      }))
    } catch {}
  }, [selectedCredit, amount, term, paymentType, currency])

  if (dataLoading) return <div className="calculator-page"><div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Загрузка данных...</div></div>
  if (dataError) return <div className="calculator-page"><div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>Ошибка: {dataError}</div></div>
  if (!credit) return null

  return (
    <div className="calculator-page">
      <h1 className="page-title animate-in">{CALCULATOR.title}</h1>
      <p className="page-subtitle animate-in stagger-1">{CALCULATOR.subtitle}</p>

      <div className="card animate-in stagger-2 calculator__params">
        <div className="calculator__row">
          <Select
            label={CALCULATOR.productLabel}
            value={selectedCredit}
            onChange={setSelectedCredit}
            options={products.map(c => {
              const b = getBankById(banks, c.bankId)
              return { value: c.id, label: `${b?.logo} ${b?.name} — ${c.name} (${c.rate}%)` }
            })}
            className="calculator__select-group"
          />
          <Select
            label={CALCULATOR.paymentTypeLabel}
            value={paymentType}
            onChange={setPaymentType}
            options={[
              { value: 'annuity', label: CALCULATOR.annuity },
              { value: 'differentiated', label: CALCULATOR.differentiated }
            ]}
            className="calculator__select-group"
          />
          <div className="form-group calculator__select-group" style={{ minWidth: '200px' }}>
            <CurrencyToggle value={currency} onChange={setCurrency} />
          </div>
        </div>

        <RangeSlider
          label={CALCULATOR.amountLabel}
          value={amount}
          onChange={setAmount}
          min={1000}
          max={credit.maxAmount}
          step={1000}
          formatLabel={v => `${convertFromBYN(v, rate).toLocaleString()} ${currency}`}
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
      </div>

      <div className="calculator__results">
        <CreditResult
          bank={bank}
          credit={credit}
          amount={amountDisplay}
          term={term}
          monthlyPayment={monthlyPayment}
          totalPayment={totalPayment}
          overpayment={overpayment}
          paymentType={paymentType}
          currency={currency}
          rate={credit.rate}
        />

        <div className="card animate-in stagger-3 calculator__chart">
          <h3 className="calculator__chart-title">{CALCULATOR.chartTitle}</h3>
          <PaymentChart
            totalPrincipal={amountDisplay}
            totalInterest={convertFromBYN(totalInterestBYN, rate)}
            currency={currency}
          />
        </div>
      </div>

      <div className="animate-in calculator__compare-btn">
        <button className="btn btn-outline" onClick={() => setShowCompare(!showCompare)}>
          {showCompare ? CALCULATOR.hideCompare : CALCULATOR.compareBtn}
        </button>
      </div>

      {showCompare && (
        <div className="animate-in stagger-2" style={{ marginTop: '1.5rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">{CALCULATOR.selectCompare}</label>
            <Select
              value={compareCredit}
              onChange={setCompareCredit}
              placeholder={CALCULATOR.selectPlaceholder}
              options={products
                .filter(c => c.id !== selectedCredit)
                .map(c => {
                  const b = getBankById(banks, c.bankId)
                  return { value: c.id, label: `${b?.logo} ${b?.name} — ${c.name} (${c.rate}%)` }
                })}
            />
          </div>
          <div className="calculator__compare-panel">
            <div className="card calculator__summary-card">
              <div className="calculator__summary-header">
                {bank.logo} {bank.name} — {credit.name}
              </div>
              <div className="calculator__summary-info">
                {CALCULATOR.summaryPayment}: <strong className="calculator__summary-payment">{monthlyPayment.toFixed(2)} {currency}</strong><br />
                {CALCULATOR.summaryOverpayment}: <strong className="calculator__summary-overpayment">{overpayment.toFixed(2)} {currency}</strong>
              </div>
            </div>
            <CompareCard credit={otherCredit} bank={otherBank} currency={currency} rates={rates} />
          </div>
        </div>
      )}

      <PaymentSchedule schedule={schedule} term={term} currency={currency} rate={rate} />
    </div>
  )
}

export default Calculator