const CACHE_KEY = 'exchange-rates-cache'
const CACHE_TTL = 60 * 60 * 1000 // 1 час

/**
 * Получить курсы валют относительно BYN через API НБ РБ.
 * Документация: https://www.nbrb.by/api/exrates/rates?periodicity=0
 *
 * API возвращает курсы в BYN за 1 единицу иностранной валюты.
 * Например: USD = 3.15 означает 1 USD = 3.15 BYN.
 *
 * Мы храним rates как "сколько BYN нужно для 1 единицы валюты".
 * BYN = 1 (базовая).
 */
export async function getExchangeRates() {
  // Проверка кэша
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
    // Запрос к API НБ РБ — все официальные курсы на сегодня
    const res = await fetch('https://api.nbrb.by/exrates/rates?periodicity=0')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const nbrbRates = await res.json()

    // Парсим нужные валюты
    const rates = {
      BYN: 1
    }

    // Для каждой нужной валюты ищем её курс
    const needed = ['USD', 'EUR', 'RUB', 'CNY']
    needed.forEach(code => {
      const found = nbrbRates.find(r => r.Cur_Abbreviation === code)
      if (found) {
        // Cur_OfficialRate — курс за Cur_Scale единиц
        // Например: RUB — 3.3527 за 100 RUB, USD — 3.1539 за 1 USD
        rates[code] = found.Cur_OfficialRate / found.Cur_Scale
      }
    })

    // Проверяем, что хотя бы USD загрузился
    if (!rates.USD) throw new Error('USD rate not found')

    // Сохраняем в кэш
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ data: rates, timestamp: Date.now() }))
    } catch {}

    return rates
  } catch (err) {
    // При ошибке пытаемся использовать кэш (даже просроченный)
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

/**
 * Конвертировать сумму из BYN в указанную валюту.
 * rate — это "сколько BYN за 1 единицу валюты".
 * Например BYN→USD: amountBYN / USD_rate
 */
export function convertFromBYN(amountBYN, rateToCurrency) {
  if (!rateToCurrency || rateToCurrency === 0) return amountBYN
  return amountBYN / rateToCurrency
}

/**
 * Конвертировать сумму из указанной валюты в BYN.
 */
export function convertToBYN(amount, rateFromCurrency) {
  if (!rateFromCurrency || rateFromCurrency === 0) return amount
  return amount * rateFromCurrency
}