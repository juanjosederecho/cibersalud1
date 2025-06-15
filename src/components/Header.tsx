import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Phone } from 'lucide-react';
import { useConsulta } from '../context/ConsultaContext';

export const Header: React.FC = () => {
  const { nombrePaciente } = useConsulta();

  const handleIrAlMedico = () => {
    const mensaje = encodeURIComponent("Hola, necesito orientación médica desde CIBERSALUD 360");
    const whatsappUrl = `https://wa.me/51900973658?text=${mensaje}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-red-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        {/* Título Principal */}
        <div className="text-center mb-2">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Heart className="w-8 h-8 text-red-200" fill="currentColor" />
            <h1 className="text-3xl font-bold tracking-wide">
              CIBERSALUD 360
            </h1>
            <Heart className="w-8 h-8 text-red-200" fill="currentColor" />
          </div>
          <p className="text-amber-100 text-lg font-medium">
            Atención Médica Digital para el Altiplano de Puno
          </p>
          {nombrePaciente && (
            <p className="text-amber-200 text-sm font-medium mt-1">
              👋 Hola {nombrePaciente}
            </p>
          )}
        </div>

        {/* Información Regional */}
        <div className="bg-white/10 rounded-lg p-3 mb-3">
          <div className="flex items-center justify-center gap-4 text-center">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm font-medium">Huancané - Rosaspata</span>
            </div>
            <div className="text-amber-200">•</div>
            <div className="text-sm font-medium">Colegio CONAMIR</div>
            <div className="text-amber-200">•</div>
            <div className="text-sm">Altiplano 3,812 msnm</div>
          </div>
        </div>

        {/* Botón de Emergencia */}
        <div className="text-center">
          <button 
            onClick={handleIrAlMedico}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full font-bold text-sm transition-colors duration-200 shadow-md hover:scale-105"
          >
            <Phone className="w-4 h-4 inline mr-2" />
            IR AL MÉDICO
          </button>
          <p className="text-xs text-amber-100 mt-1">
            ⚠️ Esta app no reemplaza la consulta médica profesional
          </p>
        </div>

        {/* Decoración andina */}
        <div className="flex justify-center items-center gap-2 mt-3 text-amber-200">
          <span className="text-lg">🏔️</span>
          <span className="text-sm">•</span>
          <span className="text-lg">🦙</span>
          <span className="text-sm">•</span>
          <span className="text-lg">🌾</span>
          <span className="text-sm">•</span>
          <span className="text-lg">🦙</span>
          <span className="text-sm">•</span>
          <span className="text-lg">🏔️</span>
        </div>
      </div>
    </header>
  );
};
