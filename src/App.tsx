import React from 'react';
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { User } from './types/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <BrowserRouter>
      <Layout user={user}>
      </Layout>
    </BrowserRouter>
  );
}


export default App