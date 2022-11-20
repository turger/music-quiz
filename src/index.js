import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Info from './Info'
import Points from './Points'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: '/info',
    element: <Info />,
  },
  {
    path: '/points',
    element: <Points />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
