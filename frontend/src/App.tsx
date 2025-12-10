import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Connect from './pages/Connect';
import Dashboard from './pages/Dashboard';
import Tokenize from './pages/Tokenize';
import PositionDetail from './pages/PositionDetail';
import Settings from './pages/Settings';
import Pools from './pages/Pools';
import Governance from './pages/Governance';
import ToastContainer from './components/ToastContainer';
import ProtectedRoute from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/app" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
        <Route path="/app/tokenize" element={<ProtectedRoute><AppLayout><Tokenize /></AppLayout></ProtectedRoute>} />
        <Route path="/app/positions/:id" element={<ProtectedRoute><AppLayout><PositionDetail /></AppLayout></ProtectedRoute>} />
        <Route path="/app/settings" element={<ProtectedRoute><AppLayout><Settings /></AppLayout></ProtectedRoute>} />
        <Route path="/app/pools" element={<ProtectedRoute><AppLayout><Pools /></AppLayout></ProtectedRoute>} />
        <Route path="/app/governance" element={<ProtectedRoute><AppLayout><Governance /></AppLayout></ProtectedRoute>} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
