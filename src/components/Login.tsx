import React, { useState } from 'react';
import { Lock, User } from 'lucide-react';
import { User as UserType } from '../types/auth';

interface LoginProps {
  onLogin: (user: UserType) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock authentication logic
      if (email === 'admin@example.com' && password === 'admin') {
        onLogin({
          id: '1',
          email,
          role: 'SUPER_ADMIN',
          name: 'Super Admin'
        });
      } else if (email === 'panel@example.com' && password === 'admin') {
        onLogin({
          id: '2',
          email,
          role: 'PANEL_ADMIN',
          name: 'Panel Admin'
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-800 p-8 rounded-xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-300 to-green-300 bg-clip-text text-transparent">
            Crypto Admin Panel
          </h1>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-500 p-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-transparent"
                placeholder="Password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-700 bg-gray-900 text-orange-300 focus:ring-orange-300"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400">
                Remember me
              </label>
            </div>
            <button type="button" className="text-sm text-orange-300 hover:text-orange-400">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-orange-400 to-green-400 hover:from-orange-500 hover:to-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          <div className="mb-4 text-gray-400">
            <p>Demo Credentials:</p>
            <p>Super Admin: admin@example.com / admin</p>
            <p>Panel Admin: panel@example.com / admin</p>
          </div>
          <span className="text-gray-400">Need help? </span>
          <button className="text-orange-300 hover:text-orange-400">Contact support</button>
        </div>
      </div>
    </div>
  );
}