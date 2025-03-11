import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';


export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header />
        <main className="pt-16">
          {children}
        </main>
      </div>
    </div>
  );
}