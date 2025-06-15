import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useConsulta } from '../context/ConsultaContext';
import { User, ChevronRight, AlertCircle, Stethoscope } from 'lucide-react';

export const IniciarConsulta: React.FC = () => {
  const {
    nombrePaciente,
    setNombrePaciente,
    sintomasSeleccionados,
    setSintomasSeleccionados,
    database,
    loading,
  } = useConsulta();
  
  const [paso, setPaso] = useState(1);
  const [sintomasEspecificos, setSintomasEspecificos] = useState<string[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Solo establecer el paso inicial una vez al cargar la página
  useEffect(() => {
    setPaso(1); // Siempre empezar desde el paso 1 para nueva consulta
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando información médica del altiplano...</p>
        </div>
      </div>
    );
  }

  if (!database) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-600">
          <AlertCircle className="w-12 h-12 mx-auto mb-4" />
          <p>Error al cargar la base de datos médica</p>
        </div>
      </div>
    );
  }

  const handleSintomaToggle = (sintomaId: string) => {
    setSintomasSeleccionados(prev =>
      prev.includes(sintomaId)
        ? prev.filter(id => id !== sintomaId)
        : [...prev, sintomaId]
    );
  };

  const handleSintomaEspecificoToggle = (sintomaId: string) => {
    setSintomasEspecificos(prev =>
      prev.includes(sintomaId)
        ? prev.filter(id => id !== sintomaId)
        : [...prev, sintomaId]
    );
  };

  // Obtener síntomas específicos basados en síntomas generales seleccionados
  const getSintomasEspecificosDisponibles = () => {
    if (!database.sintomas_especificos) return [];
    
    const sintomasRelacionados = new Set<string>();
    sintomasSeleccionados.forEach(sintomaId => {
      const sintoma = database.sintomas_generales.find(s => s.id === sintomaId);
      if (sintoma && sintoma.relacionados) {
        sintoma.relacionados.forEach(rel => sintomasRelacionados.add(rel));
      }
    });

    return Array.from(sintomasRelacionados).slice(0, 5).map(id => ({
      id,
      ...database.sintomas_especificos[id]
    })).filter(Boolean);
  };

  const handleContinuar = () => {
    if (paso === 1 && nombrePaciente.trim()) {
      // Limpiar síntomas antes de pasar al siguiente paso
      setSintomasSeleccionados([]);
      setSintomasEspecificos([]);
      setPaso(2);
    } else if (paso === 2 && sintomasSeleccionados.length > 0) {
      setPaso(3);
    } else if (paso === 3) {
      navigate('/diagnostico');
    }
  };

  const puedeContinar = 
    (paso === 1 && nombrePaciente.trim()) ||
    (paso === 2 && sintomasSeleccionados.length > 0) ||
    (paso === 3);

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header de página */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Stethoscope className="w-8 h-8 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-800">
            {nombrePaciente ? `Consulta Médica para ${nombrePaciente}` : 'Iniciar Consulta Médica'}
          </h2>
        </div>
        <p className="text-gray-600">
          Sistema de diagnóstico para el altiplano de Puno
        </p>
        
        {/* Indicador de progreso */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            paso >= 1 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            1
          </div>
          <div className={`w-8 h-1 ${paso >= 2 ? 'bg-amber-500' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            paso >= 2 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <div className={`w-8 h-1 ${paso >= 3 ? 'bg-amber-500' : 'bg-gray-200'}`} />
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
            paso >= 3 ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            3
          </div>
        </div>
      </div>

      {/* Paso 1: Datos del paciente */}
      {paso === 1 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-6 h-6 text-amber-600" />
            <h3 className="text-xl font-semibold text-gray-800">Datos del Paciente</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                value={nombrePaciente}
                onChange={(e) => setNombrePaciente(e.target.value)}
                placeholder="Ingresa tu nombre completo (ej: María Quispe Mamani)"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Información Importante:</p>
                  <ul className="text-xs space-y-1">
                    <li>• Esta consulta es para orientación inicial solamente</li>
                    <li>• No reemplaza la visita al médico profesional</li>
                    <li>• Para emergencias, acude inmediatamente al centro de salud</li>
                    <li>• Centro de Salud Huancané: 051-561234</li>
                    <li>• Colegio CONAMIR de Rosaspata</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Paso 2: Síntomas Generales */}
      {paso === 2 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {nombrePaciente ? `${nombrePaciente}, selecciona tus síntomas principales` : 'Selecciona tus síntomas principales'}
            </h3>
            <p className="text-gray-600 text-sm">
              Marca todos los síntomas que tienes actualmente - Paso 1 de 2
            </p>
          </div>
          
          {/* Grid de 2 columnas sin scroll */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-hidden">
            {database.sintomas_generales.map((sintoma) => (
              <button
                key={sintoma.id}
                onClick={() => handleSintomaToggle(sintoma.id)}
                className={`p-4 text-left rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                  sintomasSeleccionados.includes(sintoma.id)
                    ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg scale-105'
                    : 'border-gray-200 hover:border-amber-300 hover:bg-amber-25'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{sintoma.icono}</div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 text-sm leading-tight">{sintoma.nombre}</h4>
                    <p className="text-xs text-gray-600 mt-1">{sintoma.descripcion}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    sintomasSeleccionados.includes(sintoma.id)
                      ? 'border-amber-500 bg-amber-500'
                      : 'border-gray-300'
                  }`}>
                    {sintomasSeleccionados.includes(sintoma.id) && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
          
          {sintomasSeleccionados.length > 0 && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800 font-medium">
                ✓ {sintomasSeleccionados.length} síntoma(s) seleccionado(s)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Paso 3: Síntomas Específicos */}
      {paso === 3 && (
        <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-100">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {nombrePaciente ? `${nombrePaciente}, síntomas más específicos` : 'Síntomas más específicos'}
            </h3>
            <p className="text-gray-600 text-sm">
              Basado en tus síntomas, selecciona detalles adicionales - Paso 2 de 2 (opcional)
            </p>
          </div>
          
          {getSintomasEspecificosDisponibles().length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-hidden">
              {getSintomasEspecificosDisponibles().map((sintoma) => (
                <button
                  key={sintoma.id}
                  onClick={() => handleSintomaEspecificoToggle(sintoma.id)}
                  className={`p-4 text-left rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                    sintomasEspecificos.includes(sintoma.id)
                      ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-green-300 hover:bg-green-25'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{sintoma.icono}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800 text-sm leading-tight">{sintoma.nombre}</h4>
                      <p className="text-xs text-gray-600 mt-1">{sintoma.descripcion}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      sintomasEspecificos.includes(sintoma.id)
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    }`}>
                      {sintomasEspecificos.includes(sintoma.id) && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No hay síntomas específicos disponibles para tu selección.</p>
              <p className="text-sm mt-2">Puedes continuar al diagnóstico.</p>
            </div>
          )}
          
          {sintomasEspecificos.length > 0 && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 font-medium">
                ✓ {sintomasEspecificos.length} síntoma(s) específico(s) seleccionado(s)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Botones de navegación */}
      <div className="flex justify-between mt-6">
        {paso > 1 && (
          <button
            onClick={() => setPaso(paso - 1)}
            className="px-6 py-3 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
          >
            Atrás
          </button>
        )}
        
        <button
          onClick={handleContinuar}
          disabled={!puedeContinar}
          className={`px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 ml-auto ${
            puedeContinar
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 shadow-md hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {paso === 1 ? 'Continuar a Síntomas' : paso === 2 ? 'Continuar' : 'Obtener Diagnóstico'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Elementos decorativos andinos */}
      <div className="flex justify-center items-center gap-4 mt-8 text-amber-400">
        <span className="text-2xl">🌾</span>
        <span className="text-lg">•</span>
        <span className="text-2xl">🦙</span>
        <span className="text-lg">•</span>
        <span className="text-2xl">🏔️</span>
      </div>
    </div>
  );
};
