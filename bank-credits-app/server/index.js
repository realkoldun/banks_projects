import express from 'express'
import cors from 'cors'
import { banks, creditProducts, creditTypes } from '../src/data/banksData.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.get('/api/banks', (req, res) => {
  res.json(banks)
})

app.get('/api/banks.json', (req, res) => {
  res.json(banks)
})

app.get('/api/banks/:id', (req, res) => {
  const bank = banks.find(b => b.id === req.params.id)
  if (!bank) return res.status(404).json({ error: 'Bank not found' })
  res.json(bank)
})

app.get('/api/products', (req, res) => {
  let result = [...creditProducts]
  const { bankId, type, sortBy, order } = req.query

  if (bankId) result = result.filter(c => c.bankId === bankId)
  if (type) result = result.filter(c => c.type === type)

  if (sortBy) {
    result.sort((a, b) => {
      const dir = order === 'desc' ? -1 : 1
      if (sortBy === 'rate') return dir * (a.rate - b.rate)
      if (sortBy === 'amount') return dir * (b.maxAmount - a.maxAmount)
      if (sortBy === 'term') return dir * (b.maxTerm - a.maxTerm)
      if (sortBy === 'name') return dir * a.name.localeCompare(b.name)
      return 0
    })
  }

  res.json(result)
})

app.get('/api/products.json', (req, res) => {
  res.json(creditProducts)
})

app.get('/api/products/:id', (req, res) => {
  const product = creditProducts.find(c => c.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

app.get('/api/credit-types', (req, res) => {
  res.json(creditTypes)
})

app.get('/api/credit-types.json', (req, res) => {
  res.json(creditTypes)
})

app.listen(PORT, () => {
  console.log(`🏦 Bank Credits API server running on http://localhost:${PORT}`)
})