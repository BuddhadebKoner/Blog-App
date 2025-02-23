import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryProvider } from './lib/react-query/QueryProvider.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <QueryProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </QueryProvider>
  </BrowserRouter>
)