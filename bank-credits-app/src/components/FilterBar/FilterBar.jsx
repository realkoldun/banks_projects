import { creditTypes } from '../../data/banks'
import { COMPARE, FILTER } from '../../locales'
import './filterBar.css'

function FilterBar({ selectedType, onTypeChange, sortBy, onSortChange, uniqueTypes }) {
  return (
    <div className="card filter-bar" style={{ marginBottom: '2rem' }}>
      <div className="filter-bar__row">
        <div className="form-group filter-bar__group">
          <label className="form-label">{FILTER.typeLabel}</label>
          <select className="form-select" value={selectedType} onChange={e => onTypeChange(e.target.value)}>
            <option value="all">{COMPARE.allTypes}</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{creditTypes[type]}</option>
            ))}
          </select>
        </div>

        <div className="form-group filter-bar__group">
          <label className="form-label">{FILTER.sortLabel}</label>
          <select className="form-select" value={sortBy} onChange={e => onSortChange(e.target.value)}>
            <option value="rate">{COMPARE.sortByRate}</option>
            <option value="amount">{COMPARE.sortByAmount}</option>
            <option value="term">{COMPARE.sortByTerm}</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default FilterBar