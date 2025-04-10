import { useState } from 'react'
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Signin from './components/Signin'
import Signup from './components/Signup'
import Home from './components/Home'
import Dashboard from './components/Dashboard'

function App() {
  

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/Signin',
      element: <Signin />
    },
    {
      path: '/Signup',
      element: <Signup />
    },
    {
      path: '/Dashboard/:user',  
      element: <Dashboard />
    }
  ])

  return (
    <>
      <div>
        <RouterProvider router={router} />
      </div>
    </>
  )
}

export default App
