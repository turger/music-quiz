import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Info from './Info'
import Points from './Points'

const songCount = 12

const router = createBrowserRouter([
  {
    path: '/',
    element: <App songCount={songCount} />,
  },
  {
    path: '/info',
    element: <Info songCount={songCount} />,
  },
  {
    path: '/points',
    element: <Points songCount={songCount} />,
  },
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
