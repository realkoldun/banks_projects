import { useState, useMemo } from 'react'
import { useBanksData, getBankById } from '../../hooks/useBanksData'
import { COMPARE } from '../../locales'
import FilterBar from '../../components/FilterBar'
import CreditTable from '../../components/CreditTable'
import './compare.css'

function Compare() {
  const [selectedType, setSelectedType] = useState('all')
  const [sortBy, setSortBy] = useState('rate')

  const { banks, products, creditTypes, loading, error } = useBanksData()

  const uniqueTypes = useMemo(
    () => [...new Set(products.map(c => c.type))],
    [products]
  )

  const sorted = useMemo(() => {
    let filtered = selectedType === 'all'
      ? [...products]
      : products.filter(c => c.type === selectedType)

    return filtered.sort((a, b) => {
      if (sortBy === 'rate') return a.rate - b.rate
      if (sortBy === 'amount') return b.maxAmount - a.maxAmount
      if (sortBy === 'term') return b.maxTerm - a.maxTerm
      return 0
    })
  }, [selectedType, sortBy, products])

  if (loading) return <div className="compare-page"><div className="card" style={{ textAlign: 'center', padding: '3rem' }}>Загрузка данных...</div></div>
  if (error) return <div className="compare-page"><div className="card" style={{ textAlign: 'center', padding: '3rem', color: '#ef4444' }}>Ошибка: {error}</div></div>

  return (
    <div className="compare-page">
      <h1 className="page-title animate-in">{COMPARE.title}</h1>
      <p className="page-subtitle animate-in stagger-1">{COMPARE.subtitle}</p>

      <FilterBar
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        sortBy={sortBy}
        onSortChange={setSortBy}
        uniqueTypes={uniqueTypes}
        creditTypes={creditTypes}
      />

      <CreditTable products={sorted} getBankById={(id) => getBankById(banks, id)} creditTypes={creditTypes} />
    </div>
  )
}

export default Compare