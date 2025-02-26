import BudgetApp from './components/budget/BudgetApp'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <BudgetApp />
      </div>
    </ThemeProvider>
  )
}

export default App