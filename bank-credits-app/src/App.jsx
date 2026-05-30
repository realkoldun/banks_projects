import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Compare from './pages/Compare'
import Calculator from './pages/Calculator'
import { FOOTER } from './locales'
import './App.css'

function App() {
  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/calculator" element={<Calculator />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>{FOOTER.text}</p>
      </footer>
    </div>
  )
}

export default App