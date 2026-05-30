import { useState, useMemo } from 'react'
import { creditProducts, getBankById } from '../../data/banks'
import { COMPARE } from '../../locales'
import { useExchangeRates } from '../../hooks/useExchangeRates'
import FilterBar from '../../components/FilterBar'
import CreditTable from '../../components/CreditTable'
import CurrencyToggle from '../../components/CurrencyToggle'
import './compare.css'

function Compare() {
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('rate')
  const [currency, setCurrency] = useState('BYN')

  const { rates } = useExchangeRates()

  const uniqueTypes = useMemo(
    () => [...new Set(creditProducts.map(c => c.type))],
    []
  )

  const sorted = useMemo(() => {
    let filtered = selectedType === 'all'
      ? [...creditProducts]
      : creditProducts.filter(c => c.type === selectedType)

    return filtered.sort((a, b) => {
      if (sortBy === 'rate') return a.rate - b.rate
      if (sortBy === 'amount') return b.maxAmount - a.maxAmount
      if (sortBy === 'term') return b.maxTerm - a.maxTerm
      return 0
    })
  }, [selectedType, sortBy])

  return (
    <div className="compare-page">
      <h1 className="page-title animate-in">{COMPARE.title}</h1>
      <p className="page-subtitle animate-in stagger-1">{COMPARE.subtitle}</p>

      <div className="card animate-in" style={{ marginBottom: '1rem', padding: '1rem' }}>
        <CurrencyToggle value={currency} onChange={setCurrency} />
      </div>

      <FilterBar
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        uniqueTypes={uniqueTypes}
      />

      <CreditTable products={sorted} getBankById={getBankById} currency={currency} rates={rates} />
    </div>
  )
}

export default Compare