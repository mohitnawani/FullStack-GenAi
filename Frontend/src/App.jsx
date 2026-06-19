import { Routes, Route, Navigate } from "react-router"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useRef, useState } from "react"
import { checkAuth } from "./store/slices/authslice"
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const didCheckAuth = useRef(false)
  const [bootstrapped, setBootstrapped] = useState(false)

  // console.log("App rendered - isAuthenticated:", isAuthenticated, "loading:", loading)

  useEffect(() => {
    if (didCheckAuth.current) return
    didCheckAuth.current = true
    dispatch(checkAuth()).finally(() => setBootstrapped(true))
    console.log("Auth check dispatched")
  }, [dispatch])

  if (!bootstrapped || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    )
  }

  return (
      <Routes>
        <Route path='/' element={!isAuthenticated ? <Navigate to='/login' /> : <Navigate to='/dashboard' />} />
        <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to='/dashboard' />} />
        <Route path='/register' element={!isAuthenticated ? <RegisterPage /> : <Navigate to='/dashboard' />} />
        <Route path='/dashboard' element={isAuthenticated ? <DashboardPage /> : <Navigate to='/login' />} />
      </Routes>
  )
}

export default App
