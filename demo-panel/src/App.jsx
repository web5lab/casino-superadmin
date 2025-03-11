import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import CryptoInterface from './components/CryptoInterface';
import CasinoGame from './pages/CasinoGame';
import { useDispatch } from 'react-redux';
import { GetUserData } from './store/global.Action';

function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(GetUserData())
    
  }, [])
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="wallet" element={<CryptoInterface />} />
          <Route path="game/:id" element={<CasinoGame />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
export default App;
