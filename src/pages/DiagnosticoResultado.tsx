import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsulta } from '../context/ConsultaContext';
import { AlertTriangle, Phone, MapPin, Heart, Home, CheckCircle, XCircle } from 'lucide-react';

export const DiagnosticoResultado: React.FC = () => {
  const {
    nombrePaciente,
    sintomasSeleccionados,
    database,
    realizarDiagnostico,
    guardarConsulta,
    nuevaConsulta,
  } = useConsulta();
  
  const [enfermedadDiagnosticada, setEnfermedadDiagnosticada] = useState(null);
  const [probabilidad, setProbabilidad] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!nombrePaciente || sintomasSeleccionados.length === 0) {
      navigate('/consulta');
      return;
    }

    const resultado = realizarDiagnostico();
    if (resultado) {
      setEnfermedadDiagnosticada(resultado);
      
      // Calcular probabilidad basada en coincidencias de síntomas
      const coincidencias = resultado.sintomas_principales.filter(
        sintoma => sintomasSeleccionados.includes(sintoma)
      ).length;
      const probabilidadCalculada = Math.min((coincidencias / resultado.sintomas_principales.length) * 100, 95);
      setProbabilidad(Math.round(probabilidadCalculada));

      // Guardar consulta en el historial
      const consulta = {
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        nombrePaciente,
        sintomasSeleccionados,
        enfermedadDiagnosticada: resultado,
        probabilidad: Math.round(probabilidadCalculada),
      };
      guardarConsulta(consulta);
    }
  }, []);

  const handleNuevaConsulta = () => {
    nuevaConsulta();
    navigate('/consulta');
  };

  const getSintomasNombres = () => {
    if (!database) return [];
    return sintomasSeleccionados.map(id => {
      const sintoma = database.sintomas_generales.find(s => s.id === id);
      return sintoma ? sintoma.nombre : id;
    });
  };

  if (!enfermedadDiagnosticada) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="bg-white rounded-xl shadow-lg p-6 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            No se pudo determinar un diagnóstico
          </h2>
          <p className="text-gray-600 mb-6">
            Con los síntomas proporcionados no podemos sugerir una condición específica.
          </p>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-red-800">Recomendación Importante:</span>
            </div>
            <p className="text-red-700 text-sm">
              Te recomendamos acudir al centro de salud más cercano para una evaluación médica profesional.
            </p>
          </div>
          <button
            onClick={handleNuevaConsulta}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors duration-200"
          >
            Intentar Nueva Consulta
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-3xl">
      {/* Header del diagnóstico */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-amber-100">
        <div className="text-center mb-4">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-gray-800">Diagnóstico Preliminar</h2>
          <p className="text-gray-600">Para {nombrePaciente}</p>
        </div>

        {/* Síntomas reportados */}
        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <h3 className="font-medium text-blue-800 mb-2">Síntomas reportados:</h3>
          <div className="flex flex-wrap gap-2">
            {getSintomasNombres().map((sintoma, index) => (
              <span key={index} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm">
                {sintoma}
              </span>
            ))}
          </div>
        </div>

        {/* Resultado del diagnóstico */}
        <div className="border border-orange-200 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <img
              src={enfermedadDiagnosticada.imagen}
              alt={enfermedadDiagnosticada.nombre}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                {enfermedadDiagnosticada.nombre}
              </h3>
              <p className="text-gray-600 mb-3">
                {enfermedadDiagnosticada.descripcion}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Probabilidad:</span>
                <div className="bg-gray-200 rounded-full h-2 flex-1 max-w-32">
                  <div
                    className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                    style={{ width: `${probabilidad}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-green-600">{probabilidad}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cuidados caseros recomendados */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-green-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Home className="w-6 h-6 text-green-600" />
          Cuidados Caseros Recomendados
        </h3>
        <div className="grid gap-3">
          {enfermedadDiagnosticada.cuidados_caseros.map((cuidado, index) => (
            <div key={index} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{cuidado}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Alimentos recomendados del altiplano */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-amber-100">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          🌾 Alimentos del Altiplano Recomendados
        </h3>
        <div className="grid gap-3">
          {enfermedadDiagnosticada.alimentos_recomendados.map((alimento, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">🥘</span>
              <span className="text-gray-700">{alimento}</span>
            </div>
          ))}
        </div>
        
        {enfermedadDiagnosticada.evitar.length > 0 && (
          <div className="mt-4 pt-4 border-t border-amber-200">
            <h4 className="font-medium text-red-700 mb-2">Evitar:</h4>
            <div className="grid gap-2">
              {enfermedadDiagnosticada.evitar.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Señales de alarma */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-6 h-6" />
          ⚠️ Señales de Alarma - Acudir URGENTEMENTE al Médico
        </h3>
        <div className="grid gap-3">
          {enfermedadDiagnosticada.senales_alarma.map((senal, index) => (
            <div key={index} className="flex items-start gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 font-medium">{senal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Información de contacto */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
        <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6" />
          Centros de Salud en Huancané - Rosaspata
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Centro de Salud Huancané: 051-561234</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Puesto de Salud Rosaspata: 051-567890</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Hospital Puno: 051-369710</span>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex gap-4">
        <button
          onClick={handleNuevaConsulta}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors duration-200 font-medium"
        >
          Nueva Consulta
        </button>
        <button
          onClick={() => navigate('/recomendaciones')}
          className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
        >
          Ver Más Recomendaciones
        </button>
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6 text-center">
        <p className="text-sm text-gray-600">
          <strong>Importante:</strong> Este diagnóstico es orientativo. Para un diagnóstico definitivo y tratamiento apropiado, 
          consulta con un profesional de la salud en el centro médico más cercano.
        </p>
        <div className="flex justify-center items-center gap-2 mt-2 text-amber-500">
          <span>🏔️</span>
          <span className="text-xs font-medium">CIBERSALUD 360 - Altiplano de Puno</span>
          <span>🦙</span>
        </div>
      </div>
    </div>
  );
};
