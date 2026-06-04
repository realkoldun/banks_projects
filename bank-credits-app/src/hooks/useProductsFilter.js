import { useMemo } from 'react'
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
