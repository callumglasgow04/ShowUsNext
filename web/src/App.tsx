import { ThemeProvider } from '@mui/material/styles'
import { Box, CssBaseline, Typography } from '@mui/material'
import { theme } from './theme/theme'
import { Navbar } from './components/NavBar/Navbar'
import { Home } from './pages/Home'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />

      <Box component="main">
        <Home/>
      </Box>
    </ThemeProvider>
  )
}

export default App