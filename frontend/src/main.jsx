import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Apply saved theme immediately on load
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const container = document.getElementById('root');
if (!window.__expenseTrackerRoot) {
  window.__expenseTrackerRoot = createRoot(container);
}

window.__expenseTrackerRoot.render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);
