import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { IniciarConsulta } from './pages/IniciarConsulta';
import { Recomendaciones } from './pages/Recomendaciones';
import { Historial } from './pages/Historial';
import { DiagnosticoResultado } from './pages/DiagnosticoResultado';
import { ConsultaContextProvider } from './context/ConsultaContext';
import './App.css';

function App() {
  return (
    <ConsultaContextProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-blue-50">
          {/* Hero Background con imagen del altiplano */}
          <div 
            className="fixed inset-0 opacity-10 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/images/altiplano-background.jpg')`,
              zIndex: -1
            }}
          />
          
          <div className="relative z-10">
            <Header />
            
            <main className="pb-20">
              <Routes>
                <Route path="/" element={<Navigate to="/consulta" replace />} />
                <Route path="/consulta" element={<IniciarConsulta />} />
                <Route path="/recomendaciones" element={<Recomendaciones />} />
                <Route path="/historial" element={<Historial />} />
                <Route path="/diagnostico" element={<DiagnosticoResultado />} />
              </Routes>
            </main>
            
            <Navigation />
          </div>
        </div>
      </Router>
    </ConsultaContextProvider>
  );
}

export default App;
