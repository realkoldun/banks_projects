import { useState, useEffect, useCallback } from 'react'
import { getExchangeRates } from '../api/exchangeRate'

export function useExchangeRates() {
  const [rates, setRates] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchRates = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getExchangeRates()
      setRates(data)
    } catch (err) {
      setError(err.message)
      if (!rates) {
        setRates(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRates()
  }, [fetchRates])

  return { rates, loading, error, refetch: fetchRates }
}