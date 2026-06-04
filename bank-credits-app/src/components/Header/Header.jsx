import { NavLink } from 'react-router-dom'
import { HEADER } from '../../locales'
import './header.css'
function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <NavLink to="/" className="logo">
          {HEADER.logoPrefix}<span>{HEADER.logoSuffix}</span>{HEADER.logoSuffixSpan}
        </NavLink>
        <nav className="nav">
          {HEADER.nav.map(item => (
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
