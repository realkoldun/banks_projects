const API_BASE = `${import.meta.env.BASE_URL}api`
async function request(path) {
  const url = `${API_BASE}${path}.json`
  const res = await fetch(url)
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
  return request('/products')
}
export async function fetchProductById(id) {
  return request(`/products/${id}`)
}
export async function fetchCreditTypes() {
  return request('/credit-types')
}
