import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App'
import Info from './Info'
import Points from './Points'
import Admin from './admin/Admin'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
  {
    path: ':gameId',
    element: <App />,
  },
  {
    path: ':gameId/answer/:songId',
    element: <App />,
  },
  {
    path: '/info',
    element: <Info />,
  },
  {
    path: ':gameId/points',
    element: <Points />,
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
