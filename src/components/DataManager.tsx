import React, { useState, useRef } from 'react';
import { useI18n } from '../lib/i18n';
import { 
  exportUserData, 
  importUserData, 
  downloadExportData, 
  generateProgressReport, 
  generateCertificate,
  createBackupSummary,
  validateImportFile,
  type ExportData,
  type ImportResult,
} from '../lib/dataExport';
import { saveSettings, loadSettings } from '../lib/firebase';
import type { User } from 'firebase/auth';

interface Props {
  user?: import('firebase/auth').User | null;
}

export default function DataManager({ user }: Props) {
  const { t } = useI18n();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);
  const [certificateData, setCertificateData] = useState<ExportData | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [reportData, setReportData] = useState<string>('');
  const [showBackupSummary, setShowBackupSummary] = useState(false);
  const [backupSummary, setBackupSummary] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const exportData = await exportUserData(user);
      if (exportData) {
        downloadExportData(exportData);
        setBackupSummary(createBackupSummary(exportData));
        setShowBackupSummary(true);
      }
    } catch (error) {
      console.error('Export failed:', error);
      alert(t('exportFailed'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    setImportResult(null);
    
    try {
      const validation = await validateImportFile(file);
      
      if (!validation.valid) {
        setImportResult({
          success: false,
          message: validation.error || t('invalidFile'),
        });
        return;
      }
      
      const importResult = await importUserData(user!, validation.data!, {
        overwriteProgress: false,
        overwriteSettings: false,
        mergeAchievements: true,
        importTestHistory: true,
      });
      
      setImportResult(importResult);
      
      if (importResult.success) {
        // Reload settings to apply imported data
        if (user) {
          const settings = await loadSettings(user.uid);
          // Settings would be automatically applied through the import process
        }
      }
    } catch (error) {
      console.error('Import failed:', error);
      setImportResult({
        success: false,
        message: t('importFailed'),
      });
    } finally {
      setIsImporting(false);
      // Clear file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleGenerateReport = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const exportData = await exportUserData(user);
      if (exportData) {
        const report = generateProgressReport(exportData);
        setReportData(report);
        setShowReport(true);
      }
    } catch (error) {
      console.error('Report generation failed:', error);
      alert(t('reportGenerationFailed'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleGenerateCertificate = async () => {
    if (!user) return;
    
    setIsExporting(true);
    try {
      const exportData = await exportUserData(user);
      if (exportData) {
        setCertificateData(exportData);
        setShowCertificate(true);
      }
    } catch (error) {
      console.error('Certificate generation failed:', error);
      alert(t('certificateGenerationFailed'));
    } finally {
      setIsExporting(false);
    }
  };

  const downloadReport = () => {
    if (!reportData) return;
    
    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyboard-master-progress-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadCertificate = () => {
    if (!certificateData) return;
    
    const certificate = generateCertificate(certificateData);
    const blob = new Blob([certificate], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keyboard-master-certificate-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConflictResolution = async (conflictType: string, action: 'overwrite' | 'merge') => {
    if (!user || !importResult) return;
    
    setIsImporting(true);
    try {
      const options = {
        overwriteProgress: conflictType === 'progress' && action === 'overwrite',
        overwriteSettings: conflictType === 'settings' && action === 'overwrite',
        mergeAchievements: conflictType === 'achievements' && action === 'merge',
        importTestHistory: conflictType === 'testHistory' && action === 'merge',
      };
      
      // We need to re-read the file to get the data for conflict resolution
      if (fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0];
        const validation = await validateImportFile(file);
        
        if (validation.valid && validation.data) {
          const result = await importUserData(user!, validation.data, options);
          setImportResult(result);
          
          if (result.success) {
            setTimeout(() => {
              setImportResult(null);
            }, 2000);
          }
        }
      }
    } catch (error) {
      console.error('Conflict resolution failed:', error);
      setImportResult({
        success: false,
        message: t('conflictResolutionFailed'),
      });
    } finally {
      setIsImporting(false);
    }
  };

  if (!user) {
    return (
      <div className="p-8 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">{t('loginRequired')}</h2>
          <p className="text-gray-600">{t('loginToAccessData')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dataManager')}</h1>
        <p className="text-gray-600">{t('dataManagerDescription')}</p>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('exportData')}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex flex-col items-center justify-center p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l4-4m0 0l-4 4m4-4v1a3 3 0 00-3 3H7a3 3 0 00-3-3v-1m-4-4l4-4m0 0l-4 4" />
            </svg>
            <span className="font-medium">{t('exportAll')}</span>
            <span className="text-sm opacity-75">{t('exportAllDescription')}</span>
          </button>
          
          <button
            onClick={handleGenerateReport}
            disabled={isExporting}
            className="flex flex-col items-center justify-center p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2a2 2 0 002-2m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 00-2 2h2a2 2 0 002 2m0 0V5a2 2 0 012-2h2a2 2 0 012 2z" />
            </svg>
            <span className="font-medium">{t('generateReport')}</span>
            <span className="text-sm opacity-75">{t('generateReportDescription')}</span>
          </button>
          
          <button
            onClick={handleGenerateCertificate}
            disabled={isExporting}
            className="flex flex-col items-center justify-center p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-6 h-6 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h14M8 7v8m-8 4h14m-4 4v8m-4-4h6v4m0 0v6m0-6h6v6" />
            </svg>
            <span className="font-medium">{t('generateCertificate')}</span>
            <span className="text-sm opacity-75">{t('generateCertificateDescription')}</span>
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">{t('importData')}</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('selectFile')}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            disabled={isImporting}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <p className="text-sm text-gray-500 mt-2">
            {t('importFileDescription')}
          </p>
        </div>

        {isImporting && (
          <div className="flex items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            <span className="ml-3 text-gray-600">{t('importing')}</span>
          </div>
        )}
      </div>

      {/* Import Result */}
      {importResult && (
        <div className={`rounded-lg p-6 mb-6 ${
          importResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
        }`}>
          <h3 className={`text-lg font-semibold mb-4 ${
            importResult.success ? 'text-green-800' : 'text-red-800'
          }`}>
            {importResult.success ? t('importSuccessful') : t('importFailed')}
          </h3>
          
          <p className={`mb-4 ${
            importResult.success ? 'text-green-700' : 'text-red-700'
          }`}>
            {importResult.message}
          </p>
          
          {importResult.importedItems && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {importResult.importedItems.progress}
                </div>
                <div className="text-sm text-gray-600">{t('lessons')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {importResult.importedItems.settings}
                </div>
                <div className="text-sm text-gray-600">{t('settings')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {importResult.importedItems.achievements}
                </div>
                <div className="text-sm text-gray-600">{t('achievements')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {importResult.importedItems.testHistory}
                </div>
                <div className="text-sm text-gray-600">{t('testHistory')}</div>
              </div>
            </div>
          )}
          
          {importResult.conflicts && importResult.conflicts.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">{t('conflictsDetected')}</h4>
              <div className="space-y-3">
                {importResult.conflicts.map((conflict, index) => (
                  <div key={index} className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-yellow-800">{conflict.description}</h5>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleConflictResolution(conflict.type, 'overwrite')}
                          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        >
                          {t('overwrite')}
                        </button>
                        <button
                          onClick={() => handleConflictResolution(conflict.type, 'merge')}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          {t('merge')}
                        </button>
                        <button
                          onClick={() => handleConflictResolution(conflict.type, 'skip' as any)}
                          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                        >
                          {t('skip')}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Backup Summary Modal */}
      {showBackupSummary && backupSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('backupSummary')}</h3>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('totalSize')}:</span>
                <span className="font-medium">{backupSummary.totalSize}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('itemsIncluded')}:</span>
              </div>
              <div className="grid grid-cols-2 gap-4 ml-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600">{backupSummary.itemCounts.lessons}</div>
                  <div className="text-sm text-gray-600">{t('lessons')}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600">{backupSummary.itemCounts.achievements}</div>
                  <div className="text-sm text-gray-600">{t('achievements')}</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600">{backupSummary.itemCounts.tests}</div>
                  <div className="text-sm text-gray-600">{t('tests')}</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('lastBackup')}:</span>
                <span className="font-medium">{backupSummary.lastBackup}</span>
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setShowBackupSummary(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {t('close')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('progressReport')}</h3>
              <div className="flex gap-2">
                <button
                  onClick={downloadReport}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  {t('download')}
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                >
                  {t('close')}
                </button>
              </div>
            </div>
            
            <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap">
              {reportData}
            </pre>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      {showCertificate && certificateData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-3xl w-full mx-4 max-h-96 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{t('achievementCertificate')}</h3>
              <div className="flex gap-2">
                <button
                  onClick={downloadCertificate}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                >
                  {t('download')}
                </button>
                <button
                  onClick={() => setShowCertificate(false)}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                >
                  {t('close')}
                </button>
              </div>
            </div>
            
            <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800 whitespace-pre-wrap font-mono">
              {generateCertificate(certificateData)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}