import React, { useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { Home } from './pages/Home';
import { Favorites } from './pages/Favorites';
import { About } from './pages/About';
import { All } from './pages/All';
import { General } from './pages/General';
import { Technology } from './pages/Technology';
import { Politics } from './pages/Politics';
import { Sports } from './pages/Sports';
import { Business } from './pages/Business';
import { Entertainment } from './pages/Entertainment';
import { Health } from './pages/Health';
import { Science } from './pages/Science';
import { ToastContainer } from './components/Toast';
import { AppProvider } from './context/AppContext';
import './i18n';

function AppContent() {
  // Simple hash-based routing
  const getActivePage = () => {
    const hash = window.location.hash.slice(1) || 'home';
    return hash;
  };

  const [activePage, setActivePage] = React.useState(getActivePage);

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(getActivePage());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const renderPage = () => {
    switch (activePage) {
      case 'favorites':
        return <Favorites />;
      case 'about':
        return <About />;
      case 'all':
        return <All />;
      case 'general':
        return <General />;
      case 'technology':
        return <Technology />;
      case 'politics':
        return <Politics />;
      case 'sports':
        return <Sports />;
      case 'business':
        return <Business />;
      case 'entertainment':
        return <Entertainment />;
      case 'health':
        return <Health />;
      case 'science':
        return <Science />;
      case 'home':
      default:
        return <Home />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navbar />
      {activePage === 'home' && <CategoryBar />}
      <main>
        {renderPage()}
      </main>
      <ToastContainer />
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;