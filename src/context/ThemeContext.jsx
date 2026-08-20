import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      const stored = localStorage.getItem('findclo_theme')
      // Default is DARK for new visitors.
      // Only restore 'light' if the user explicitly saved it.
      return stored === 'light' ? 'light' : 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    try {
      // Persist the user's explicit choice to localStorage.
      // On the next visit the anti-FOUC script in index.html
      // reads this and applies it before React hydrates,
      // so there is zero flash-of-wrong-theme.
      localStorage.setItem('findclo_theme', theme)
      document.documentElement.setAttribute('data-theme', theme)
      if (theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } catch (e) {
      console.error('Error saving theme preference', e)
    }
  }, [theme])

  const toggleTheme = () => {
    setThemeState(prev => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (newTheme) => {
    setThemeState(newTheme === 'dark' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
