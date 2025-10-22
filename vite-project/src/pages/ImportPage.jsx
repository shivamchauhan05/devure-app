import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import ImportData from '../components/ImportData';

const ImportPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/reports"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <FiArrowLeft className="mr-2" />
            Back to Reports
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Import Data</h1>
              <p className="text-gray-600 mt-2">
                Import your data from Excel files to quickly populate the system
              </p>
            </div>
          </div>
        </div>

        {/* Import Component */}
        <ImportData />
      </div>
    </div>
  );
};

export default ImportPage;