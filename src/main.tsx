import { createRoot } from 'react-dom/client'
import './index.css'
import AppRouter from '@routes/AppRouter.tsx'
// styles
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById('root')!).render(
     <AppRouter />
)
