import {createRoot} from 'react-dom/client'
import './index.css'
import {App} from './App.tsx'
import {ThemeProvider} from "next-themes";
import {BrowserRouter} from "react-router-dom";

createRoot(document.getElementById('root')!).render(
  <>
      <BrowserRouter>
              <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
              <App />
          </ThemeProvider>
      </BrowserRouter>
  </>,
)