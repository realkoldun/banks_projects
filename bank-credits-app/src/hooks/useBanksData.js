import { useState, useEffect, useCallback } from 'react'
import { fetchBanks, fetchProducts, fetchCreditTypes } from '../api/banks'

const CACHE_KEY = 'bank-data-cache'
const CACHE_TTL = 5 * 60 * 1000 // 5 минут

function loadFromCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw)
    if (Date.now() - data.timestamp > CACHE_TTL) return null
    return data
  } catch {
    return null
  }
}

function saveToCache(banks, products, creditTypes) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({
      banks, products, creditTypes,
      timestamp: Date.now()
    }))
  } catch {}
}

export function useBanksData() {
  const [banks, setBanks] = useState([])
  const [products, setProducts] = useState([])
  const [creditTypes, setCreditTypes] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadData = useCallback(async (force = false) => {
    if (!force) {
      const cached = loadFromCache()
      if (cached) {
        setBanks(cached.banks)
        setProducts(cached.products)
        setCreditTypes(cached.creditTypes)
        setLoading(false)
        return
      }
    }

    try {
      setLoading(true)
      setError(null)
      const [banksData, productsData, typesData] = await Promise.all([
        fetchBanks(),
        fetchProducts(),
        fetchCreditTypes()
      ])
      setBanks(banksData)
      setProducts(productsData)
      setCreditTypes(typesData)
      saveToCache(banksData, productsData, typesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const refresh = useCallback(() => loadData(true), [loadData])

  return { banks, products, creditTypes, loading, error, refresh }
}

// Вспомогательные функции для работы с данными (как раньше, но теперь на лету)
export function getBankById(banks, id) {
  return banks.find(b => b.id === id)
}

export function getProductsByType(products, type) {
  return products.filter(c => c.type === type)
}

export function getProductsByBank(products, bankId) {
  return products.filter(c => c.bankId === bankId)
}

export function getProductById(products, id) {
  return products.find(c => c.id === id)
}

export function getUniqueTypes(products) {
  return [...new Set(products.map(c => c.type))]
}