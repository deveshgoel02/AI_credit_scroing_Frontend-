import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/assess', label: 'Assessment' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/financial-inclusion', label: 'Financial Inclusion' },
  { to: '/monitoring', label: 'Monitoring' },
  { to: '/responsible-ai', label: 'Responsible AI' },
]

function getInitialTheme() {
  if (typeof window === 'undefined') return 'light'
  return localStorage.getItem('crediai-theme') || 'light'
}

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('crediai-theme', theme)
  }, [theme])

  return (
    <button
      onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
      className="rounded-full border px-3 py-1.5 text-xs font-semibold"
      style={{ borderColor: 'var(--border-hairline)', color: 'var(--text-secondary)' }}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? '☀ Light' : '● Dark'}
    </button>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur"
      style={{ borderColor: 'var(--border-hairline)', background: 'color-mix(in srgb, var(--surface-0) 88%, transparent)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <NavLink to="/" className="flex items-center gap-2 text-lg font-extrabold tracking-tight">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-black text-white"
            style={{ background: 'var(--brand)' }}
          >
            C
          </span>
          CrediAI
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-[var(--brand)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="rounded-lg border px-2 py-1.5 text-sm md:hidden"
            style={{ borderColor: 'var(--border-hairline)' }}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t px-5 py-3 md:hidden" style={{ borderColor: 'var(--border-hairline)' }}>
          {LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'text-[var(--brand)]' : 'text-[var(--text-secondary)]'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}
