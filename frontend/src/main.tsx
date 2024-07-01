import React from 'react'
import ReactDOM from 'react-dom/client'
import AllRoutes from './routes/routes'
import './index.css'
import { Toaster } from "@/components/ui/toaster"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <AllRoutes />
      <Toaster />
  </React.StrictMode>,
)