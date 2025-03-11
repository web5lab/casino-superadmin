import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { useDispatch, useSelector } from 'react-redux';
import { userSelector } from './store/global.Selctor';


function App() {
  const [users, setUser] = useState(null);
  const dispatch = useDispatch()
  const user = useSelector(userSelector)
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