import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import App from './App'
import Info from './Info'
import Points from './Points'
import Admin from './admin/Admin'

const songCount: number = 12

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to='/answer/1' replace />,
  },
  {
    path: '/answer/:id',
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
  {
    path: '/admin',
    element: <Admin />,
  },
])

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  )
} else {
  console.error('Cannot find <div id="root"></div> element for React')
}
