import React, { useState } from 'react';
import { FiDownload, FiFileText, FiFile, FiGrid } from 'react-icons/fi';
import { exportAPI } from '../services/api';

const ExportDropdown = ({ activeReport, timeRange, filters, getStartDateForRange }) => {
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  const handleExport = async (format) => {
    try {
      setExporting(true);
      setExportError('');

      const params = {
        startDate: getStartDateForRange(timeRange),
        endDate: new Date().toISOString().split('T')[0],
        format,
        ...filters
      };

      let response;
      let filename;

      switch (activeReport) {
        case 'sales':
          response = await exportAPI.exportSales(params);
          filename = 'sales-report';
          break;
        case 'expenses':
          response = await exportAPI.exportExpenses(params);
          filename = 'expenses-report';
          break;
        case 'profit':
          response = await exportAPI.exportProfitLoss(params);
          filename = 'profit-loss-report';
          break;
        case 'inventory':
          response = await exportAPI.exportInventory(params);
          filename = 'inventory-report';
          break;
        default:
          response = await exportAPI.exportSales(params);
          filename = 'sales-report';
      }

      // Create blob and download
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const extension = format === 'excel' ? 'xlsx' : format;
      link.download = `${filename}-${new Date().toISOString().split('T')[0]}.${extension}`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Export error:', error);
      setExportError('Failed to export. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative inline-block">
      {/* Export Error */}
      {exportError && (
        <div className="absolute bottom-full mb-2 bg-red-50 border border-red-200 rounded-md p-2 text-red-700 text-sm">
          {exportError}
        </div>
      )}

      {/* Export Dropdown */}
      <div className="relative group">
        <button
          disabled={exporting}
          className="flex items-center px-4 py-2 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          {exporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
              Exporting...
            </>
          ) : (
            <>
              <FiDownload className="mr-2" />
              Export
            </>
          )}
        </button>

        {/* Dropdown Menu */}
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
          <div className="py-1">
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiFileText className="mr-2 text-green-600" />
              Export as CSV
            </button>
            
            <button
              onClick={() => handleExport('pdf')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiFile className="mr-2 text-red-600" />
              Export as PDF
            </button>
            
            <button
              onClick={() => handleExport('excel')}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <FiGrid className="mr-2 text-green-600" />
              Export as Excel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportDropdown;