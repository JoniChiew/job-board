import React from 'react'; 
import ReactDOM from 'react-dom/client'; 
import { AppProvider } from './AppContext.js'; 
import App from './App.js'; 
 
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(<AppProvider><App /></AppProvider>); 
