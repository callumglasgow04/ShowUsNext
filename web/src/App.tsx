import { ThemeProvider } from '@mui/material/styles'
import { Box, CssBaseline } from '@mui/material'
import { theme } from './theme/theme'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Navbar } from './components/NavBar/Navbar'
import { Home } from './pages/Home'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import Account from './pages/Account/Account'
import type { JSX } from '@emotion/react/jsx-runtime'
import { useAuth } from './features/auth/authContext'

function isAuthed() {
  return !!localStorage.getItem("access_token");
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>
}

function LoggedInRedirect({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={
            <LoggedInRedirect>
              <Login />
            </LoggedInRedirect>}
          />
          <Route path='/register' element={
            <LoggedInRedirect>
              <Register />
            </LoggedInRedirect>}
          />

          <Route path='/account' element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App