import React, { useEffect } from 'react';
import config from '../config/config';
import { initializeDataTable } from '../utils/dataTableUtils';

function ConfigTest() {
  useEffect(() => {
    // Test DataTable initialization
    const testDataTable = async () => {
      try {
        await initializeDataTable('test-table');
        console.log('DataTable initialized successfully');
      } catch (error) {
        console.error('DataTable initialization failed:', error);
      }
    };

    // Test after a short delay to ensure DOM is ready
    const timer = setTimeout(testDataTable, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container mt-4">
      <h2>Configuration Test</h2>
      <div>Env: {config.env}</div>
      <div>API URL: {config.apiBaseUrl}</div>
      <div>App Name: {config.appName}</div>
      
      <h3 className="mt-4">DataTable Test</h3>
      <table id="test-table" className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>John Doe</td>
            <td>john@example.com</td>
            <td>Admin</td>
          </tr>
          <tr>
            <td>Jane Smith</td>
            <td>jane@example.com</td>
            <td>Student</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default ConfigTest;
