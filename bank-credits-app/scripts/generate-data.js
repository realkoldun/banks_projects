import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { banks, creditProducts, creditTypes } from '../src/data/banksData.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public', 'api')

mkdirSync(publicDir, { recursive: true })

function writeJSON(filename, data) {
  const filepath = join(publicDir, filename)
  writeFileSync(filepath, JSON.stringify(data, null, 2))
  console.log(`✅ ${filename} (${data.length || Object.keys(data).length} записей)`)
}

writeJSON('banks.json', banks)
writeJSON('products.json', creditProducts)
writeJSON('credit-types.json', creditTypes)

console.log('\n📦 Все JSON-файлы сгенерированы в public/api/')