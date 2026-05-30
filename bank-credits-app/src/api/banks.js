const API_BASE = '/api'

async function request(url) {
  const res = await fetch(`${API_BASE}${url}`)
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  return res.json()
}

export async function fetchBanks() {
  return request('/banks')
}

export async function fetchBankById(id) {
  return request(`/banks/${id}`)
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams()
  if (params.bankId) query.set('bankId', params.bankId)
  if (params.type) query.set('type', params.type)
  if (params.sortBy) query.set('sortBy', params.sortBy)
  if (params.order) query.set('order', params.order)
  const qs = query.toString()
  return request(`/products${qs ? `?${qs}` : ''}`)
}

export async function fetchProductById(id) {
  return request(`/products/${id}`)
}

export async function fetchCreditTypes() {
  return request('/credit-types')
}