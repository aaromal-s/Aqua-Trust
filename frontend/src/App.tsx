import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import WaterQuality from './pages/WaterQuality';
import SensorManagement from './pages/SensorManagement';
import AquaIntelligence from './pages/AquaIntelligence';
import CitizenReporting from './pages/CitizenReporting';
import Reports from './pages/Reports';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/quality" element={<WaterQuality />} />
          <Route path="/sensors" element={<SensorManagement />} />
          <Route path="/intelligence" element={<AquaIntelligence />} />
          <Route path="/reporting" element={<CitizenReporting />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
