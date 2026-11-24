import { useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Sidebar from './components/Sidebar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Evaluation from './pages/Evaluation.jsx';
import MyReports from './pages/MyReports.jsx';
import Results from './pages/Results.jsx';
import Settings from './pages/Settings.jsx';
import UploadReport from './pages/UploadReport.jsx';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <BrowserRouter>
      <div className="flex min-h-screen w-full overflow-x-hidden bg-[#F8FAFC] text-[#0F172A]">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <Navbar onOpenSidebar={() => setSidebarOpen(true)} />

          <main className="mx-auto w-full min-w-0 max-w-[1200px] flex-1 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadReport />} />
              <Route path="/results" element={<Results />} />
              <Route path="/reports" element={<MyReports />} />
              <Route path="/evaluation" element={<Evaluation />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          <footer className="border-t border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-2 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>LabBridge · Educational Laboratory Report Understanding</span>
              <span>
                For educational support only. Always consult a qualified healthcare professional.
              </span>
            </div>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}
