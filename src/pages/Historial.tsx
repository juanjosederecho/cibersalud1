import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useConsulta } from '../context/ConsultaContext';
import { History, Calendar, User, ClipboardPlus, Trash2, RotateCcw } from 'lucide-react';

export const Historial: React.FC = () => {
  const { historialConsultas, nuevaConsulta, nombrePaciente } = useConsulta();
  const navigate = useNavigate();

  const handleNuevaConsulta = () => {
    nuevaConsulta();
    navigate('/consulta');
  };

  const formatearFecha = (fechaISO: string) => {
    const fecha = new Date(fechaISO);
    return {
      fecha: fecha.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
      hora: fecha.toLocaleTimeString('es-PE', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };
  };

  const limpiarHistorial = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todo el historial de consultas?')) {
      localStorage.removeItem('cibersalud_historial');
      window.location.reload();
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header de la página */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <History className="w-8 h-8 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-800">Historial de Consultas</h2>
        </div>
        <p className="text-gray-600">
          {nombrePaciente 
            ? `Hola ${nombrePaciente}, aquí está el registro de tus consultas médicas anteriores en CIBERSALUD 360`
            : 'Registro de tus consultas médicas anteriores en CIBERSALUD 360'
          }
        </p>
        
        {/* Elementos decorativos andinos */}
        <div className="flex justify-center items-center gap-2 mt-3 text-amber-400">
          <span className="text-lg">🏔️</span>
          <span className="text-sm">•</span>
          <span className="text-lg">📋</span>
          <span className="text-sm">•</span>
          <span className="text-lg">🦙</span>
          <span className="text-sm">•</span>
          <span className="text-lg">📋</span>
          <span className="text-sm">•</span>
          <span className="text-lg">🏔️</span>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={handleNuevaConsulta}
          className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-6 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
        >
          <ClipboardPlus className="w-5 h-5" />
          Nueva Consulta
        </button>
        
        {historialConsultas.length > 0 && (
          <button
            onClick={limpiarHistorial}
            className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Limpiar Historial
          </button>
        )}
      </div>

      {/* Lista de consultas */}
      {historialConsultas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-amber-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <History className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No hay consultas registradas
          </h3>
          <p className="text-gray-600 mb-6">
            Cuando realices tu primera consulta médica, aparecerá aquí en tu historial.
          </p>
          <button
            onClick={handleNuevaConsulta}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-3 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-colors duration-200 font-medium flex items-center gap-2 mx-auto"
          >
            <ClipboardPlus className="w-5 h-5" />
            Realizar Primera Consulta
          </button>
          
          {/* Decoración andina para estado vacío */}
          <div className="flex justify-center items-center gap-4 mt-8 text-amber-300">
            <span className="text-3xl">🦙</span>
            <span className="text-lg">•</span>
            <span className="text-3xl">🌾</span>
            <span className="text-lg">•</span>
            <span className="text-3xl">🏔️</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {historialConsultas.map((consulta) => {
            const fechaFormateada = formatearFecha(consulta.fecha);
            
            return (
              <div key={consulta.id} className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden">
                <div className="p-6">
                  {/* Header de la consulta */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">
                          {consulta.nombrePaciente}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{fechaFormateada.fecha}</span>
                          </div>
                          <span>{fechaFormateada.hora}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Probabilidad */}
                    <div className="text-right">
                      <div className="text-sm text-gray-600">Probabilidad</div>
                      <div className="text-xl font-bold text-green-600">
                        {consulta.probabilidad}%
                      </div>
                    </div>
                  </div>

                  {/* Diagnóstico */}
                  {consulta.enfermedadDiagnosticada && (
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-4">
                      <div className="flex items-start gap-3">
                        <img
                          src={consulta.enfermedadDiagnosticada.imagen}
                          alt={consulta.enfermedadDiagnosticada.nombre}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">
                            {consulta.enfermedadDiagnosticada.nombre}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {consulta.enfermedadDiagnosticada.descripcion.substring(0, 120)}...
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Síntomas reportados */}
                  <div className="border-t border-gray-200 pt-4">
                    <h5 className="font-medium text-gray-700 mb-2">Síntomas reportados:</h5>
                    <div className="flex flex-wrap gap-2">
                      {consulta.sintomasSeleccionados.map((sintoma, index) => (
                        <span
                          key={index}
                          className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm"
                        >
                          {sintoma}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Botón para repetir consulta */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button
                      onClick={() => {
                        // Pre-cargar datos de la consulta anterior
                        // setNombrePaciente(consulta.nombrePaciente);
                        // setSintomasSeleccionados(consulta.sintomasSeleccionados);
                        navigate('/consulta');
                      }}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200 text-sm font-medium flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      Repetir Consulta
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Información adicional */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
        <h3 className="text-lg font-bold text-green-800 mb-3">💡 Acerca del Historial</h3>
        <div className="text-sm text-green-700 space-y-2">
          <p>• El historial se guarda localmente en tu dispositivo para proteger tu privacidad.</p>
          <p>• Puedes consultar tus diagnósticos anteriores en cualquier momento.</p>
          <p>• Los datos médicos están basados en información epidemiológica del altiplano de Puno.</p>
          <p>• Recuerda que este es un sistema de orientación, no reemplaza la consulta médica profesional.</p>
        </div>
      </div>

      {/* Footer con información de contacto */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
        <h3 className="text-lg font-bold text-blue-800 mb-3">🏥 Centros de Salud - Huancané y Rosaspata</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Centro de Salud Huancané:</strong> 051-561234</p>
          <p><strong>Puesto de Salud Rosaspata:</strong> 051-567890</p>
          <p><strong>Hospital Nacional Puno:</strong> 051-369710</p>
        </div>
        <div className="mt-3 text-xs text-blue-600">
          <strong>Colegio CONAMIR de Rosaspata</strong>
        </div>
      </div>

      {/* Footer con elementos andinos */}
      <div className="text-center mt-8">
        <div className="flex justify-center items-center gap-4 text-amber-400 text-2xl mb-2">
          <span>🦙</span>
          <span>🏔️</span>
          <span>📋</span>
          <span>🌾</span>
          <span>🦙</span>
        </div>
        <p className="text-sm text-gray-600">
          <strong>CIBERSALUD 360</strong> - Registro médico digital para el altiplano de Puno
        </p>
      </div>
    </div>
  );
};
