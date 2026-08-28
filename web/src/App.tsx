import { ThemeProvider } from '@mui/material/styles'
import { Box, CssBaseline } from '@mui/material'
import { theme } from './theme/theme'
import { Navbar } from './components/NavBar/Navbar'
import { Home } from './pages/Home'
import Login from './pages/Login/Login'

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />

      <Box component="main">
        <Home/>
        <Login />
      </Box>
    </ThemeProvider>
  )
}

export default App