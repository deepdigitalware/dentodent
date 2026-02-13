import React, { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { Download, Upload, Database, FileJson, Settings, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { useContent } from '@/contexts/ContentContext';

const BackupManagement = () => {
  const { content, apiUrl } = useContent();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importPreview, setImportPreview] = useState(null);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Get all content from API
      const response = await fetch(`${apiUrl}/api/content`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      });
      
      if (response.ok) {
        const allContent = await response.json();
        
        // Create backup data
        const backupData = {
          version: '1.0',
          timestamp: new Date().toISOString(),
          content: allContent
        };
        
        // Create and download file
        const dataStr = JSON.stringify(backupData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `dentodent-backup-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        toast.success('Backup exported successfully!');
      } else {
        throw new Error('Failed to fetch content');
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export backup');
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImportFile(file);
      
      // Read file for preview
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          setImportPreview(data);
        } catch (err) {
          toast.error('Invalid JSON file');
          setImportFile(null);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleImport = async () => {
    if (!importFile) return;
    
    setIsImporting(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target.result);
          
          // Validate backup data
          if (!data.content || typeof data.content !== 'object') {
            throw new Error('Invalid backup file format');
          }
          
          // Import each content section
          const sections = Object.keys(data.content);
          let successCount = 0;
          
          for (const section of sections) {
            try {
              const response = await fetch(`${apiUrl}/api/content/${section}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
                },
                body: JSON.stringify({ data: data.content[section] })
              });
              
              if (response.ok) {
                successCount++;
              }
            } catch (err) {
              console.error(`Failed to import section ${section}:`, err);
            }
          }
          
          toast.success(`Imported ${successCount} of ${sections.length} sections successfully!`);
          
          // Reset form
          setImportFile(null);
          setImportPreview(null);
          if (document.getElementById('import-file-input')) {
            document.getElementById('import-file-input').value = '';
          }
        } catch (err) {
          console.error('Import error:', err);
          toast.error('Failed to import backup: Invalid file format');
        } finally {
          setIsImporting(false);
        }
      };
      reader.readAsText(importFile);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import backup');
      setIsImporting(false);
    }
  };

  const handleCancelImport = () => {
    setImportFile(null);
    setImportPreview(null);
    if (document.getElementById('import-file-input')) {
      document.getElementById('import-file-input').value = '';
    }
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Backup & Migration</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Download className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-800">Export Content</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Create a backup of all your website content including text, images, and settings. 
            This backup can be used to restore your site or migrate to another installation.
          </p>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-blue-800">What's included</h4>
                <ul className="text-sm text-blue-700 mt-1 list-disc list-inside">
                  <li>All content sections (Hero, About, Services, etc.)</li>
                  <li>Blog posts and articles</li>
                  <li>Image metadata and references</li>
                  <li>Site configuration and settings</li>
                </ul>
              </div>
            </div>
          </div>
          
          <Button
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Database className="w-4 h-4 mr-2" />
            {isExporting ? 'Exporting...' : 'Export Backup'}
          </Button>
        </motion.div>

        {/* Import Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg border border-gray-200 p-6"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Upload className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-800">Import Content</h3>
          </div>
          
          <p className="text-gray-600 mb-6">
            Restore your website content from a backup file or migrate content from another installation.
            This will overwrite your current content.
          </p>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="font-medium text-yellow-800">Important</h4>
                <ul className="text-sm text-yellow-700 mt-1 list-disc list-inside">
                  <li>This will overwrite all existing content</li>
                  <li>Always create a backup before importing</li>
                  <li>Only import files from trusted sources</li>
                </ul>
              </div>
            </div>
          </div>
          
          {!importFile ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-400 transition-colors"
                 onClick={() => document.getElementById('import-file-input')?.click()}>
              <FileJson className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-gray-500">JSON backup files only</p>
              <input
                id="import-file-input"
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-800">{importFile.name}</h4>
                    <p className="text-sm text-gray-600">
                      {(importFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    onClick={handleCancelImport}
                    variant="outline"
                    size="sm"
                  >
                    Remove
                  </Button>
                </div>
                
                {importPreview && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-gray-600">Version:</div>
                      <div className="font-medium">{importPreview.version || 'Unknown'}</div>
                      
                      <div className="text-gray-600">Date:</div>
                      <div className="font-medium">
                        {importPreview.timestamp 
                          ? new Date(importPreview.timestamp).toLocaleString() 
                          : 'Unknown'}
                      </div>
                      
                      <div className="text-gray-600">Sections:</div>
                      <div className="font-medium">
                        {importPreview.content 
                          ? Object.keys(importPreview.content).length 
                          : 0} sections
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-3">
                <Button
                  onClick={handleImport}
                  disabled={isImporting}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isImporting ? 'Importing...' : 'Import Backup'}
                </Button>
                <Button
                  onClick={handleCancelImport}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* System Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-8 bg-white rounded-lg border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="w-6 h-6 text-gray-600" />
          <h3 className="text-lg font-semibold text-gray-800">System Information</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Content Sections</h4>
            <p className="text-2xl font-bold text-blue-600">
              {Object.keys(content).length}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">API Endpoint</h4>
            <p className="text-sm font-mono text-gray-600 truncate">
              {apiUrl}
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-medium text-gray-800 mb-2">Last Backup</h4>
            <p className="text-sm text-gray-600">
              Not available
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BackupManagement;