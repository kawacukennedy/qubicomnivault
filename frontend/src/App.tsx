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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/connect" element={<Connect />} />
        <Route path="/app" element={<Dashboard />} />
        <Route path="/app/tokenize" element={<Tokenize />} />
        <Route path="/app/positions/:id" element={<PositionDetail />} />
        <Route path="/app/settings" element={<Settings />} />
        <Route path="/app/pools" element={<Pools />} />
        <Route path="/app/governance" element={<Governance />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;
