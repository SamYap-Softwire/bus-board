import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './pages/Layout';
import Bus from './pages/Bus';
import Metro from './pages/Metro';
import BusMap from './pages/BusMap';
import MetroMap from './pages/MetroMap';
import reportWebVitals from './reportWebVitals';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Bus />}/>
          <Route path="metro" element={<Metro />}/>
          <Route path="busmap" element={<BusMap />}/>
          <Route path="metromap" element={<MetroMap />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();


// TODO: Add Loading 
// TODO: Add API Key to API Calls (optional)
// TODO: Add Clock Ticking Functionality (30 seconds) (optional)
// TODO: Delete all console log 


/*
Reason for [] 
Not included in TFL services (e.g. national express and random bus like MetroBus)
*/