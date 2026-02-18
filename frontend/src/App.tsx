import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import PublicRoute from './components/publicRoute'
import ProtectedRoute from './components/protectedRoute'
import SelectRole from './pages/SelectRole'
import Navbar from './components/Navbar'
import Account from './pages/Account'
import { useAppData } from './context/AppContext'
import Resturant from './pages/Resturant'

const App = () => {
  const { user }= useAppData();

  if(user && user.role === "seller"){
    return <Resturant/>
  }

  return <> 
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route element={<PublicRoute/>}>
          <Route path="/login" element={<Login/>} />
        </Route>
        <Route element={<ProtectedRoute/>}>
          <Route path="/" element={<Home/>} />
          <Route path="/select-role" element={<SelectRole/>} />
          <Route path="/account" element={<Account/>} />
        </Route>
      </Routes>
    </BrowserRouter> 
  </>
}

export default App