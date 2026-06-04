import { useMemo } from 'react'

/**
 * Хук для фильтрации продуктов по банку и/или типу.
 * Если значение пустое/All — фильтр не применяется.
 */
export function useProductsFilter(products, { bankId = '', type = '' } = {}) {
  return useMemo(() => {
    let filtered = products
    if (bankId) {
      filtered = filtered.filter(p => p.bankId === bankId)
    }
    if (type && type !== 'all') {
      filtered = filtered.filter(p => p.type === type)
    }
    return filtered
  }, [products, bankId, type])
}
