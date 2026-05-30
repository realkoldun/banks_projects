export const HEADER = {
  nav: [
    { path: '/', label: 'Главная' },
    { path: '/compare', label: 'Сравнение' },
    { path: '/calculator', label: 'Калькулятор' }
  ],
  logoPrefix: 'Креди',
  logoSuffix: 'т',
  logoSuffixSpan: 'Беларуси'
}

export const FOOTER = {
  text: '© 2025 Оптимизация кредитных услуг · Все данные основаны на открытых источниках банков РБ'
}

export const HOME = {
  title: 'Оптимизация кредитных услуг',
  subtitle: 'Анализ и сравнение кредитных продуктов банков Республики Беларусь. Найдите лучшие условия для ваших финансовых задач.',
  calcBtn: 'Рассчитать кредит',
  compareBtn: 'Сравнить банки',
  stats: [
    { key: 'banks', label: 'Банков в анализе' },
    { key: 'products', label: 'Кредитных продуктов' },
    { key: 'avgRate', label: 'Средняя ставка' },
    { key: 'maxAmount', label: 'Макс. сумма (BYN)' }
  ],
  banksTitle: 'Банки-участники',
  typesTitle: 'Типы кредитов',
  typeCount: (n) => `Доступно ${n} продуктов`,
  avgRateLabel: 'Средняя ставка',
  marketShare: (n) => `Доля рынка: ${n}%`,
  productsCount: 'Кредитных продуктов',
  minRate: 'Мин. ставка',
  physicalShare: 'Доля физ. лиц'
}

export const COMPARE = {
  title: 'Сравнение кредитов',
  subtitle: 'Сравните условия различных банков и выберите оптимальный вариант',
  allTypes: 'Все типы',
  sortByRate: 'По ставке (возр.)',
  sortByAmount: 'По сумме (убыв.)',
  sortByTerm: 'По сроку (убыв.)',
  noData: 'Нет кредитных продуктов для отображения',
  cols: ['Банк', 'Название', 'Тип', 'Ставка', 'Макс. сумма', 'Макс. срок']
}

export const CALCULATOR = {
  title: 'Кредитный калькулятор',
  subtitle: 'Рассчитайте ежемесячный платёж, переплату и сравните условия разных банков',
  productLabel: 'Кредитный продукт',
  paymentTypeLabel: 'Тип платежа',
  annuity: 'Аннуитетный',
  differentiated: 'Дифференцированный',
  amountLabel: 'Сумма кредита',
  termLabel: 'Срок кредита',
  months: (n) => `${n} мес`,
  years: (n) => `${(n / 12).toFixed(1)} лет`,
  monthlyPayment: 'Ежемесячный платёж',
  firstPayment: 'Первый платёж',
  totalAmount: 'Общая сумма',
  overpayment: 'Переплата',
  chartTitle: 'Структура выплат',
  principalLabel: 'Основной долг',
  interestLabel: 'Проценты',
  scheduleTitle: 'График платежей',
  firstMonths: '(первые 6 месяцев)',
  allMonths: (n) => `(все ${n} мес.)`,
  showAll: 'Показать весь график',
  collapse: 'Свернуть',
  scheduleCols: ['Месяц', 'Платёж', 'Основной долг', 'Проценты', 'Остаток'],
  compareBtn: '+ Сравнить с другим кредитом',
  hideCompare: 'Скрыть сравнение',
  selectCompare: 'Выберите кредит для сравнения',
  selectPlaceholder: '-- Выберите --',
  summaryPayment: 'Платёж',
  summaryOverpayment: 'Переплата',
  sumPayments: 'Сумма платежей',
  sumInterest: 'Проценты'
}

export const CREDIT_TABLE = {
  maxAmount: (amount, currency) => `${(amount / 1000).toFixed(0)} тыс. ${currency}`,
  maxTerm: (months) => {
    const y = Math.floor(months / 12)
    const m = months % 12
    return `${y} лет ${m} мес`
  }
}

export const FILTER = {
  typeLabel: 'Тип кредита',
  sortLabel: 'Сортировка'
}

export const SHARED = {
  rate: (n) => `${n}%`,
  rate_label: 'Процентная ставка',
  byn: 'BYN',
  noData: 'Нет данных',
  loading: 'Загрузка...',
  error: 'Ошибка загрузки',
  months: (n) => `${n} мес`,
  years: (n) => `${(n / 12).toFixed(1)} лет`,
  dash: '—',
  productsCountLabel: 'Кредитных продуктов',
  minRateLabel: 'Мин. ставка',
  physicalShareLabel: 'Доля физ. лиц',
  marketShareLabel: (n) => `Доля рынка: ${n}%`,
  rateValue: (n) => `${n}%`
}

export const CURRENCY = {
  label: 'Валюта',
  BYN: 'BYN',
  USD: 'USD',
  EUR: 'EUR',
  RUB: 'RUB',
  CNY: 'CNY',
  symbols: { BYN: 'Br', USD: '$', EUR: '€', RUB: '₽', CNY: '¥' }
}