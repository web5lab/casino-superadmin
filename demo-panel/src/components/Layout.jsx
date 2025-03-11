import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Wallet, Home, Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { currentUserSelector, UserSelector } from '../store/global.Selctor';
import { setCurrentUser } from '../store/global.Slice';

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [balance, setBalance] = useState(1000); // Dummy INR balance
  const users = useSelector(UserSelector);
  const currentUser = useSelector(currentUserSelector)
  const dispatch = useDispatch()


  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const switchUser = (user) => {
    dispatch(setCurrentUser(user))
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center px-4 font-bold text-xl">
                🎰 CryptoCasino
              </Link>
            </div>
            <div className="flex items-center space-x-4 relative">
              <Link
                to="/wallet"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
              >
                <Wallet className="w-5 h-5 mr-2" />
                {currentUser.userId} (₹{currentUser.balance})
              </Link>
              <button
                onClick={toggleMenu}
                className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              {menuOpen && (
                <div className="absolute top-12 right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
                  {users.map((user) => (
                    <button
                      onClick={() => switchUser(user)}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700"
                    >
                      {user.userId}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl mb-4">Current User: {currentUser.userId}</h1>
        <Outlet />
      </main>
    </div>
  );
}