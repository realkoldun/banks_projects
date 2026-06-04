export function calcPayment(amount, ratePerMonth, term, type) {
  if (type === 'annuity') {
    if (ratePerMonth === 0) return amount / term
    const k = Math.pow(1 + ratePerMonth, term)
    return amount * (ratePerMonth * k) / (k - 1)
  }
  return amount / term + amount * ratePerMonth
}
export function buildSchedule(amount, ratePerMonth, term, monthlyPayment, type) {
  const schedule = []
  let balance = amount
  const basePrincipal = amount / term
  for (let i = 1; i <= term; i++) {
    const interest = balance * ratePerMonth
    let principal
    if (type === 'annuity') {
      principal = monthlyPayment - interest
    } else {
      principal = basePrincipal
    }
    balance -= principal
    if (balance < 0) balance = 0
    schedule.push({
      month: i,
      payment: interest + principal,
      principal,
      interest,
      balance
    })
  }
  return schedule
}
