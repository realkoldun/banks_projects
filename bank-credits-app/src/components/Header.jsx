import { NavLink } from 'react-router-dom'

const navItems = [
  { path: '/', label: 'Главная' },
  { path: '/compare', label: 'Сравнение' },
  { path: '/calculator', label: 'Калькулятор' },
  { path: '/rating', label: 'Рейтинг' }
]

function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          Креди<span>т</span>Беларуси
        </NavLink>
        <nav className="nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
