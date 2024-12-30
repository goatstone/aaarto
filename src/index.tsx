import React from 'react';
import ReactDOM from 'react-dom/client';  // Use 'react-dom/client' instead of 'react-dom'
import { HashConnect, HashConnectConnectionState, SessionData } from 'hashconnect';

const App: React.FC = () => {
  return <h1>Hello, React and TypeScript!</h1>;
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);  // Create a root
  root.render(<App />);  // Render the App
}

console.log('HashConnect', HashConnect);
