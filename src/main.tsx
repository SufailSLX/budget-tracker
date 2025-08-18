import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from "@/components/ui/theme-provider"

createRoot(document.getElementById("root")!).render(
  <ThemeProvider defaultTheme="dark" storageKey="expense-tracker-theme">
    <App />
  </ThemeProvider>
);
