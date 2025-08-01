import { AppBar, Toolbar, Button, Box } from '@mui/material'
import { Link, NavLink } from 'react-router-dom'
import AppRoutes from './routes'
import ErrorBoundary from './components/ErrorBoundary'
import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='static'>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Button color='inherit' sx={{ mr: 2 }} component={Link} to='/'>
              Home
            </Button>
            <Button color='inherit' component={NavLink} to='/banks'>
              Banks
            </Button>
            <Button color='inherit' component={NavLink} to='/calc'>
              Calculator
            </Button>
            <Button color='inherit' component={NavLink} to='/patterns'>
              Patterns Demo
            </Button>
          </Toolbar>
        </AppBar>

        <AppRoutes />
      </Box>
    </ErrorBoundary>
  )
}

export default App
