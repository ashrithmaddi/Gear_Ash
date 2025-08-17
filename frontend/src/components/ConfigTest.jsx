import React from 'react';
import config from '../config/config';

const ConfigTest = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: '#f0f0f0', 
      padding: '10px', 
      borderRadius: '5px',
      fontSize: '12px',
      zIndex: 9999,
      display: config.isDevelopment ? 'block' : 'none'
    }}>
      <div><strong>Config Test</strong></div>
      <div>Env: {config.env}</div>
      <div>API: {config.apiBaseUrl}</div>
      <div>App: {config.appName}</div>
    </div>
  );
};

export default ConfigTest;
