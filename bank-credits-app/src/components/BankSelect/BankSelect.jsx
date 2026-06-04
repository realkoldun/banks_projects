import { useState, useEffect } from 'react'
import Select from '../Select'
import './bankSelect.css'

function BankSelect({ banks, value, onChange, label = 'Банк' }) {
  const options = [
    { value: '', label: 'Все банки' },
    ...banks.map(b => ({ value: b.id, label: `${b.logo} ${b.name}` }))
  ]

  return (
    <div className="bank-select">
      <Select
        label={label}
        value={value || ''}
        onChange={onChange}
        options={options}
      />
    </div>
  )
}

export default BankSelect
