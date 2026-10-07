import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import { Droplets } from 'lucide-react';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const WaterQuality = lazy(() => import('./pages/WaterQuality'));
const SensorManagement = lazy(() => import('./pages/SensorManagement'));
const AquaIntelligence = lazy(() => import('./pages/AquaIntelligence'));
const CitizenReporting = lazy(() => import('./pages/CitizenReporting'));
const Reports = lazy(() => import('./pages/Reports'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const WaterDoctor = lazy(() => import('./pages/WaterDoctor'));
const WaterCalculator = lazy(() => import('./pages/WaterCalculator'));
const WaterPassport = lazy(() => import('./pages/WaterPassport'));
const WatershedSimulator = lazy(() => import('./pages/WatershedSimulator'));
const TestStripScanner = lazy(() => import('./pages/TestStripScanner'));

const PageLoader = () => (
  <div className="flex-1 min-h-[60vh] flex flex-col items-center justify-center p-8">
    <div className="relative flex items-center justify-center mb-3">
      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
        <Droplets className="w-6 h-6 text-blue-600 animate-pulse" />
      </div>
    </div>
    <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">
      Loading Telemetry Grid...
    </span>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/quality" element={<WaterQuality />} />
              <Route path="/sensors" element={<SensorManagement />} />
              <Route path="/intelligence" element={<AquaIntelligence />} />
              <Route path="/doctor" element={<WaterDoctor />} />
              <Route path="/calculator" element={<WaterCalculator />} />
              <Route path="/passport" element={<WaterPassport />} />
              <Route path="/simulator" element={<WatershedSimulator />} />
              <Route path="/scanner" element={<TestStripScanner />} />
              <Route path="/reporting" element={<CitizenReporting />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
