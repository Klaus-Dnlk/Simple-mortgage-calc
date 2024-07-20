import { AppBar, Toolbar, Button } from '@mui/material'
import { Link, NavLink } from 'react-router-dom'
import AppRoutes from './routes'
import './App.css'
import CookiesBanner from './components/CookiesBanner'

const cookies = document.cookie
console.log("cookies", cookies);
function App() {
  return (
    <div sx={{ flexGrow: 1 }}>
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
        </Toolbar>
      </AppBar>
      {!document.cookie && <CookiesBanner />}
      <AppRoutes />
    </div>
  )
}

export default App
