import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveChat from './pages/LiveChat';
import Keywords from './pages/Keywords';
import Broadcast from './pages/Broadcast';
import Customers from './pages/Customers';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BotSandbox from './pages/BotSandbox';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="chat" element={<LiveChat />} />
          <Route path="keywords" element={<Keywords />} />
          <Route path="broadcast" element={<Broadcast />} />
          <Route path="customers" element={<Customers />} />
          <Route path="sandbox" element={<BotSandbox />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
