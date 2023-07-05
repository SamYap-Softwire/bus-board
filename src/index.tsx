import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ReactDOM from 'react-dom/client';
import './index.css';
import Layout from './pages/Layout';
import Bus from './pages/Bus';
import Metro from './pages/Metro';
import Map from './pages/BusMap';
import reportWebVitals from './reportWebVitals';

export default function App(){
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Bus />}/>
          <Route path="metro" element={<Metro />}/>
          <Route path="map" element={<Map />}/>
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


// TODO: Refactor Code 
// TODO: Add Styles 
// TODO: Make Metro Map
// TODO: Combine Bus and Metro Page (optional)
// TODO: Add API Key to API Calls (optional)
// TODO: Add Clock Ticking Functionality (optional)


// TODO: Change initial location of map to city of london in the center