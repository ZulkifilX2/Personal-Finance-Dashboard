import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import Upload from './components/Upload';
import TransactionList from './components/TransactionList';
import Forecast from './components/Forecast';
import { LayoutDashboard, List, BarChart3, Upload as UploadIcon } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            FinDash
          </h1>
          <nav className="flex space-x-4">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'dashboard' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <LayoutDashboard className="w-4 h-4 inline-block mr-2" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'transactions' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List className="w-4 h-4 inline-block mr-2" />
              Transactions
            </button>
            <button 
              onClick={() => setActiveTab('upload')}
              className={`px-3 py-2 rounded-md text-sm font-medium ${activeTab === 'upload' ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <UploadIcon className="w-4 h-4 inline-block mr-2" />
              Upload
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div key={refreshKey} className="space-y-8">
            <Dashboard />
            <Forecast />
          </div>
        )}
        {activeTab === 'transactions' && (
          <div key={refreshKey}>
            <TransactionList />
          </div>
        )}
        {activeTab === 'upload' && (
          <div className="max-w-xl mx-auto">
            <Upload onUploadSuccess={handleUploadSuccess} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
