import { AppRoutes } from "./routes"
import { ThemeProvider } from "./contexts/ThemeContext"
import { useAuthInit } from "./hooks/useAuthInit"

function App() {
  // Initialize Firebase authentication
  useAuthInit();
  
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  )
}

export default App
