import Select from '../Select'
import { COMPARE, FILTER } from '../../locales'
import './filterBar.css'
function FilterBar({
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  uniqueTypes,
  creditTypes,
  selectedBank,
  onBankChange,
  banks
}) {
  const typeOptions = [
    { value: 'all', label: COMPARE.allTypes },
    ...uniqueTypes.map(type => ({ value: type, label: creditTypes[type] }))
  ]
  const sortOptions = [
    { value: 'rate', label: COMPARE.sortByRate },
    { value: 'amount', label: COMPARE.sortByAmount },
    { value: 'term', label: COMPARE.sortByTerm }
  ]
  const bankOptions = [
    { value: '', label: 'Все банки' },
    ...(banks || []).map(b => ({ value: b.id, label: `${b.logo} ${b.name}` }))
  ]
  return (
    <div className="card filter-bar" style={{ marginBottom: '2rem' }}>
      <div className="filter-bar__row">
        <Select
          label="Банк"
          value={selectedBank || ''}
          onChange={onBankChange}
          options={bankOptions}
        />
        <Select
          label={FILTER.typeLabel}
          value={selectedType}
          onChange={onTypeChange}
          options={typeOptions}
        />
        <Select
          label={FILTER.sortLabel}
          value={sortBy}
          onChange={onSortChange}
          options={sortOptions}
        />
      </div>
    </div>
  )
}
export default FilterBar
