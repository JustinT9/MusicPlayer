import React from 'react';
import ReactDOM from 'react-dom/client';
import MusicPlayer from './MusicPlayer';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MusicPlayer />
  </React.StrictMode>
);

