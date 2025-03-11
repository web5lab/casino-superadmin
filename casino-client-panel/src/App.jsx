import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Layout from './components/Layout.jsx';
import WalletPage from './components/WalletPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import TransactionsPage from './components/TransactionsPage.jsx';
import UsersPage from './components/UsersPage.jsx';
import SettingsPage from './components/SettingsPage.jsx';
import AnalyticsPage from './components/AnalyticsPage.jsx';
import CompliancePage from './components/CompliancePage.jsx';
import WithdrawalRequestsPage from './components/WithdrawalRequestsPage.jsx';
import NotificationsPage from './components/NotificationsPage.jsx';
import SubAdminsPage from './components/SubAdminsPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <PrivateRoute>
              <Layout>
                <WalletPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <PrivateRoute>
              <Layout>
                <TransactionsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/users"
          element={
            <PrivateRoute>
              <Layout>
                <UsersPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <Layout>
                <SettingsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <PrivateRoute>
              <Layout>
                <AnalyticsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/compliance"
          element={
            <PrivateRoute>
              <Layout>
                <CompliancePage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/withdrawals"
          element={
            <PrivateRoute>
              <Layout>
                <WithdrawalRequestsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <PrivateRoute>
              <Layout>
                <NotificationsPage />
              </Layout>
            </PrivateRoute>
          }
        />
        <Route
          path="/sub-admins"
          element={
            <PrivateRoute>
              <Layout>
                <SubAdminsPage />
              </Layout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;