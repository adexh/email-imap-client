import ReactDOM from 'react-dom/client'
import AllRoutes from './routes/routes'
import './index.css'
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from './context/authContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  // <React.StrictMode>
    <AuthProvider>
      <AllRoutes />
      <Toaster />
    </AuthProvider>
  // </React.StrictMode>
)