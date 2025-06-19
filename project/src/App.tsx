import React, { useState, useEffect } from 'react';
import { AppProvider } from './contexts/AppContext';
import Layout from './components/Layout';
import './App.css';

function App() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading AgroSage...</p>
      </div>
    );
  }

  return (
    <AppProvider>
      <Layout />
    </AppProvider>
  );
}

export default App;