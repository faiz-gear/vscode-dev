import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'virtual:svg-icons-register'
import { ThemeProvider } from 'styled-components'

import './assets/css/index.less'
import theme, { AppThemeProvider } from '@/assets/theme'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AppThemeProvider>
        <App />
      </AppThemeProvider>
    </ThemeProvider>
  </React.StrictMode>
)
