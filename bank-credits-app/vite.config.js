import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath, pathToFileURL } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = join(__dirname, 'src', 'data', 'banksData.js')
const publicApiDir = join(__dirname, 'public', 'api')

async function loadData() {
  const url = pathToFileURL(DATA_FILE).href + `?t=${Date.now()}`
  return await import(url)
}

function writeApi({ banks, creditProducts, creditTypes }) {
  mkdirSync(publicApiDir, { recursive: true })
  writeFileSync(join(publicApiDir, 'banks.json'), JSON.stringify(banks, null, 2))
  writeFileSync(join(publicApiDir, 'products.json'), JSON.stringify(creditProducts, null, 2))
  writeFileSync(join(publicApiDir, 'credit-types.json'), JSON.stringify(creditTypes, null, 2))
  console.log('✅ public/api/*.json regenerated')
}

function apiJsonPlugin() {
  return {
    name: 'api-json-generator',
    async buildStart() {
      const data = await loadData()
      writeApi(data)
    },
    async configureServer(server) {
      const data = await loadData()
      writeApi(data)

      server.watcher.add(DATA_FILE)
      server.watcher.on('change', async (file) => {
        if (file === DATA_FILE) {
          try {
            const data = await loadData()
            writeApi(data)
            server.ws.send({ type: 'full-reload' })
          } catch (err) {
            console.error('Failed to regenerate API:', err)
          }
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), apiJsonPlugin()],
  base: '/banks_projects/',
})
