// Скрипт генерации статичных JSON-файлов для продакшена
// Запуск: node scripts/generate-data.js

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public', 'api')

mkdirSync(publicDir, { recursive: true })

// Данные (дублируем из сервера)
const banks = [
  { id: 'belarusbank', name: 'Беларусбанк', logo: '🏦', marketShare: 45.6, physicalLoansShare: 60.7, deaRank: 22, totalCredits: 765700, color: '#3b82f6' },
  { id: 'belagroprombank', name: 'Белагропромбанк', logo: '🌾', marketShare: 12.3, physicalLoansShare: 15.2, deaRank: 21, totalCredits: 245000, color: '#10b981' },
  { id: 'priorbank', name: 'Приорбанк', logo: '⭐', marketShare: 5.8, physicalLoansShare: 6.1, deaRank: 6, totalCredits: 98000, color: '#f59e0b' },
  { id: 'belinvestbank', name: 'Белинвестбанк', logo: '🏭', marketShare: 6.2, physicalLoansShare: 7.3, deaRank: 12, totalCredits: 112000, color: '#8b5cf6' },
  { id: 'bank-belveb', name: 'Банк БелВЭБ', logo: '🌍', marketShare: 4.9, physicalLoansShare: 5.4, deaRank: 10, totalCredits: 87000, color: '#06b6d4' },
  { id: 'sberbank', name: 'Сбер Банк', logo: '💚', marketShare: 4.1, physicalLoansShare: 5.8, deaRank: 7, totalCredits: 76000, color: '#22c55e' },
  { id: 'alfa-bank', name: 'Альфа-банк', logo: '🔴', marketShare: 3.7, physicalLoansShare: 4.9, deaRank: 5, totalCredits: 68000, color: '#ef4444' },
  { id: 'mtbank', name: 'МТБанк', logo: '📱', marketShare: 3.2, physicalLoansShare: 4.2, deaRank: 3, totalCredits: 58000, color: '#ec4899' }
]

const creditProducts = [
  { id: 'consumer-3y', bankId: 'belarusbank', name: 'Кредит на потребительские нужды (до 3 лет)', type: 'consumer', rate: 18.2, maxTerm: 36, maxAmount: 30000, currency: 'BYN' },
  { id: 'dream', bankId: 'belarusbank', name: 'Кредит «На самае жаданае»', type: 'consumer', rate: 0.01, maxTerm: 48, maxAmount: 20000, currency: 'BYN' },
  { id: 'endless-card', bankId: 'belarusbank', name: 'Кредит «Бесконечная карта»', type: 'consumer', rate: 0.0001, maxTerm: 96, maxAmount: 15000, currency: 'BYN' },
  { id: 'belarusian-goods', bankId: 'belarusbank', name: 'Кредит «На родныя тавары»', type: 'consumer', rate: 4.0, maxTerm: 36, maxAmount: 25000, currency: 'BYN' },
  { id: 'auto-lada', bankId: 'belarusbank', name: 'Кредит «Лёгка ехаць с LADA»', type: 'auto', rate: 18.5, maxTerm: 120, maxAmount: 80000, currency: 'BYN' },
  { id: 'auto-geely', bankId: 'belarusbank', name: 'Кредит на GEELY (электромобили)', type: 'auto', rate: 16.25, maxTerm: 120, maxAmount: 100000, currency: 'BYN' },
  { id: 'education', bankId: 'belarusbank', name: 'Кредит на обучение', type: 'education', rate: 13.75, maxTerm: 132, maxAmount: 50000, currency: 'BYN' },
  { id: 'overdraft-magnet', bankId: 'belarusbank', name: 'Овердрафт «Магнит»', type: 'overdraft', rate: 5.0, maxTerm: 60, maxAmount: 10000, currency: 'BYN' },
  { id: 'consumer-prior', bankId: 'priorbank', name: 'Потребительский кредит', type: 'consumer', rate: 16.5, maxTerm: 60, maxAmount: 40000, currency: 'BYN' },
  { id: 'auto-prior', bankId: 'priorbank', name: 'Автокредит', type: 'auto', rate: 15.0, maxTerm: 84, maxAmount: 90000, currency: 'BYN' },
  { id: 'consumer-agro', bankId: 'belagroprombank', name: 'Потребительский кредит', type: 'consumer', rate: 17.5, maxTerm: 48, maxAmount: 25000, currency: 'BYN' },
  { id: 'mortgage-agro', bankId: 'belagroprombank', name: 'Ипотечный кредит', type: 'mortgage', rate: 12.0, maxTerm: 240, maxAmount: 200000, currency: 'BYN' },
  { id: 'consumer-alfa', bankId: 'alfa-bank', name: 'Потребительский кредит', type: 'consumer', rate: 15.9, maxTerm: 60, maxAmount: 50000, currency: 'BYN' },
  { id: 'auto-alfa', bankId: 'alfa-bank', name: 'Автокредит', type: 'auto', rate: 14.5, maxTerm: 96, maxAmount: 100000, currency: 'BYN' },
  { id: 'consumer-mt', bankId: 'mtbank', name: 'Потребительский кредит', type: 'consumer', rate: 16.0, maxTerm: 60, maxAmount: 35000, currency: 'BYN' },
  { id: 'auto-mt', bankId: 'mtbank', name: 'Автокредит', type: 'auto', rate: 15.5, maxTerm: 84, maxAmount: 85000, currency: 'BYN' },
  { id: 'consumer-sber', bankId: 'sberbank', name: 'Потребительский кредит', type: 'consumer', rate: 17.0, maxTerm: 60, maxAmount: 30000, currency: 'BYN' },
  { id: 'mortgage-belinvest', bankId: 'belinvestbank', name: 'Ипотечный кредит', type: 'mortgage', rate: 13.5, maxTerm: 240, maxAmount: 180000, currency: 'BYN' }
]

const creditTypes = {
  consumer: 'Потребительский',
  auto: 'Автокредит',
  mortgage: 'Ипотечный',
  education: 'На обучение',
  overdraft: 'Овердрафт'
}

function writeJSON(filename, data) {
  const filepath = join(publicDir, filename)
  writeFileSync(filepath, JSON.stringify(data, null, 2))
  console.log(`✅ ${filepath} (${data.length || Object.keys(data).length} записей)`)
}

writeJSON('banks.json', banks)
writeJSON('products.json', creditProducts)
writeJSON('credit-types.json', creditTypes)

console.log('\n📦 Все JSON-файлы сгенерированы в public/api/')