import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Bootstrap the React app into the #root div in index.html
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
