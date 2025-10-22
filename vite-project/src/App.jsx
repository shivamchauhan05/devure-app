import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Welcome from './pages/Welcome';
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import Expenses from './pages/Expenses';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import AddProduct from './forms/AddProduct';
import AddInvoice from './forms/AddInvoice';
import AddCustomer from './forms/AddCustomer';
import AddExpense from './forms/AddExpense';
import ImportPage from './pages/ImportPage';
import Profile from './pages/Profile';
import CompleteProfile from './pages/CompleteProfile';
import Help from './pages/HelpSupport'

const ProtectedRoute = ({ children }) => {
  const { currentUser, loading ,needsProfileCompletion} = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return currentUser ? children : <Navigate to="/login" />;
};

// Layout with sidebar and header
const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function AppContent() {
  const { currentUser,needsProfileCompletion } = useAuth();
  
  if (!currentUser) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }
  
  return (
    <Routes>
       {/* Check if profile needs completion */}
      {needsProfileCompletion() ? (
        // If profile needs completion, show CompleteProfile page
        <>
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="*" element={<Navigate to="/complete-profile" />} />
        </>
      ) : (
        <>
      {/* Welcome page - without sidebar & header */}
      <Route path="/" element={<Welcome />} />
      
      {/* All other pages - with sidebar & header */}
      <Route path="/dashboard" element={
        <MainLayout>
          <Dashboard />
        </MainLayout>
      } />
      <Route path="/sales" element={
        <MainLayout>
          <Sales />
        </MainLayout>
      } />
      <Route path="/inventory" element={
        <MainLayout>
          <Inventory />
        </MainLayout>
      } />
      <Route path="/customers" element={
        <MainLayout>
          <Customers />
        </MainLayout>
      } />
      <Route path="/invoices" element={
        <MainLayout>
          <Invoices />
        </MainLayout>
      } />
      <Route path="/expenses" element={
        <MainLayout>
          <Expenses />
        </MainLayout>
      } />
      <Route path="/reports" element={
        <MainLayout>
          <Reports />
        </MainLayout>
      } />
      <Route path="/settings" element={
        <MainLayout>
          <Settings />
        </MainLayout>
      } />
      <Route path="/addProduct" element={
        <MainLayout>
          <AddProduct />
        </MainLayout>
      } />
      <Route path="/addInvoice" element={
        <MainLayout>
          <AddInvoice />
        </MainLayout>
      } />
      <Route path="/addCustomer" element={
        <MainLayout>
          <AddCustomer />
        </MainLayout>
      } />
      <Route path="/addExpense" element={
        <MainLayout>
          <AddExpense />
        </MainLayout>
      } />
      <Route path="/import" element={
        <MainLayout>
          <ImportPage />
        </MainLayout>
      } />
      <Route path="/profile" element={
  <MainLayout>
    <Profile />
  </MainLayout>
} />
<Route path="/help" element={
  <MainLayout>
    <Help />
  </MainLayout>
} />
       <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;