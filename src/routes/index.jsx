import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import Banks from '../pages/Banks'
import Calc from '../pages/Calc'

function AppRoutes() {

    return (
        <Routes>
            <Route path='/' element={<Home/>} />
            <Route 
                path='/calc'
                element={<Calc />}
            />
            <Route 
                path='/banks'
                element={
                    <Banks />
                }
            />
           
        </Routes>
    )
}

export default AppRoutes