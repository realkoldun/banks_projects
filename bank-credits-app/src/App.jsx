import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Compare from './pages/Compare'
import Calculator from './pages/Calculator'
import Rating from './pages/Rating'
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
          <Route path="/rating" element={<Rating />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>© 2025 Оптимизация кредитных услуг · Все данные основаны на открытых источниках банков РБ</p>
      </footer>
    </div>
  )
}

export default App
