import { createContext, ReactNode, useContext } from 'react'

const theme = {
  color: {
    primaryColor: '#0e639c',
    defaultColor: '#8a8a8a'
  },
  size: {
    small: 12,
    medium: 14,
    large: 16
  }
}

export type ThemeType = typeof theme
const ThemeContext = createContext<ThemeType>(theme)
export const AppThemeProvider = (props: { children: ReactNode }) => (
  <ThemeContext.Provider value={theme}>{props.children}</ThemeContext.Provider>
)
export const useThemeContext = () => useContext(ThemeContext)
export default theme
