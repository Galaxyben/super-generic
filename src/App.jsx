import { Routes, Route } from 'react-router-dom';
import { CrmProvider } from './context/CrmContext';
import Sidebar from './components/Sidebar';
import ToastContainer from './components/Toast';
import Dashboard from './pages/Dashboard';
import Contacts from './pages/Contacts';
import Pipeline from './pages/Pipeline';
import Tasks from './pages/Tasks';
import './App.css';

export default function App() {
  return (
    <CrmProvider>
      <div className="app-layout">
        <Sidebar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/pipeline" element={<Pipeline />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </CrmProvider>
  );
}
