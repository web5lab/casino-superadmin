import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { Dashboard } from './Dashboard';
import { Transactions } from './pages/Transactions';
import { Casinos } from './pages/Casinos';
import { CasinoDetails } from './pages/CasinoDetails';
import { Currencies } from './pages/Currencies';
import { Users } from './pages/Users';
import { History } from './pages/History';
import { Settings } from './pages/Settings';

export function Layout({ user }) {
  return (
    <div className="min-h-screen bg-gray-900">
      <TopBar user={user} />
      <div className="flex">
        <Sidebar currentUser={user} />
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/currencies" element={<Currencies />} />
            <Route path="/casinos" element={<Casinos />} />
            <Route path="/casinos/:id" element={<CasinoDetails />} />
            <Route path="/users" element={user.role === 'SUPER_ADMIN' ? <Users /> : <Navigate to="/dashboard" replace />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}


