const CACHE_KEY = 'exchange-rates-cache'
const CACHE_TTL = 60 * 60 * 1000
export async function getExchangeRates() {
  try {
    const cached = localStorage.getItem(CACHE_KEY)
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < CACHE_TTL) {
        return data
      }
    }
  } catch {}
  try {
    const res = await fetch('https://api.nbrb.by/exrates/rates?periodicity=0')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const nbrbRates = await res.json()
    const rates = {
      BYN: 1
    }
    const needed = ['USD', 'EUR', 'RUB', 'CNY']
    needed.forEach(code => {
      const found = nbrbRates.find(r => r.Cur_Abbreviation === code)
      if (found) {
        rates[code] = found.Cur_OfficialRate / found.Cur_Scale
      }
    })
    if (!rates.USD) throw new Error('USD rate not found')
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: rates, timestamp: Date.now() }))
    } catch {}
    return rates
  } catch (err) {
    try {
      const cached = localStorage.getItem(CACHE_KEY)
      if (cached) {
        const { data } = JSON.parse(cached)
        return data
      }
    } catch {}
    throw err
  }
}
export function convertFromBYN(amountBYN, rateToCurrency) {
  if (!rateToCurrency || rateToCurrency === 0) return amountBYN
  return amountBYN / rateToCurrency
}
export function convertToBYN(amount, rateFromCurrency) {
  if (!rateFromCurrency || rateFromCurrency === 0) return amount
  return amount * rateFromCurrency
}
