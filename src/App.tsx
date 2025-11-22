import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Practice from './pages/Practice';
import Lessons from './pages/Lessons';
import SettingsModal from './components/SettingsModal';
import { ToastContainer, type ToastItem } from './components/Toast';
import { onUserChange, logout, loginWithGoogle, firebaseEnabled } from './lib/firebase';
import { useI18n } from './lib/i18n';
import './styles/styles.css';

export default function App() {
  const { t, locale } = useI18n();
  const [user, setUser] = useState<import('firebase/auth').User | null>(null);
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const unsub = onUserChange((u) => {
      setUser(u);
    });
    return () => { unsub && unsub(); };
  }, []);

  function pushToast(message: string) {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    setToasts((prev) => [...prev, { id, message }]);
  }

  function dismissToast(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
        <Helmet htmlAttributes={{ lang: locale }}>
          <title>Keyboard Master</title>
        </Helmet>

        {/* Sidebar */}
        <Sidebar user={user} onLogout={logout} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto h-screen">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/settings" element={<div className="p-8">Settings Page (Coming Soon)</div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <SettingsModal
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          minExamWpm={30}
          onSave={() => { }}
        />

        <ToastContainer items={toasts} onDismiss={dismissToast} />
      </div>
    </BrowserRouter>
  );
}
