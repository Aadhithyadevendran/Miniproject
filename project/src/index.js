import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/login.css'; 
import './styles/student.css';
import './styles/admin.css';
import { RoomProvider } from './RoomContext';

ReactDOM.render(
  <React.StrictMode>
    <RoomProvider>
      <App />
    </RoomProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
