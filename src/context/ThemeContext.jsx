import { useEffect, useState } from 'react'
import { ThemeContext } from './theme-context.js'

export function ThemeProvider({ children }) {
  const [theme] = useState('light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme }}>
      {children}
    </ThemeContext.Provider>
  )
}
