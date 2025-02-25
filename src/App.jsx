import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './components/Login';


function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (loggedInUser) => {
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