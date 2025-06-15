import React, { useState } from 'react';
import { useConsulta } from '../context/ConsultaContext';
import { BookOpen, ChevronDown, ChevronUp, Heart, MapPin, Leaf } from 'lucide-react';

export const Recomendaciones: React.FC = () => {
  const { database, loading, nombrePaciente } = useConsulta();
  const [enfermedadExpandida, setEnfermedadExpandida] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando recomendaciones...</p>
        </div>
      </div>
    );
  }

  const toggleEnfermedad = (enfermedadId: string) => {
    setEnfermedadExpandida(
      enfermedadExpandida === enfermedadId ? null : enfermedadId
    );
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Header de la página */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <BookOpen className="w-8 h-8 text-amber-600" />
          <h2 className="text-2xl font-bold text-gray-800">Recomendaciones de Salud</h2>
        </div>
        <p className="text-gray-600">
          {nombrePaciente 
            ? `Hola ${nombrePaciente}, aquí tienes consejos específicos para el cuidado de la salud en el altiplano de Puno`
            : 'Consejos específicos para el cuidado de la salud en el altiplano de Puno'
          }
        </p>
        
        {/* Elementos decorativos andinos */}
        <div className="flex justify-center items-center gap-2 mt-3 text-amber-400">
          <span className="text-lg">🏔️</span>
          <span className="text-sm">•</span>
          <span className="text-lg">🌾</span>
          <span className="text-sm">•</span>
          <span className="text-lg">🦙</span>
          <span className="text-sm">•</span>
          <span className="text-lg">🌾</span>
          <span className="text-sm">•</span>
          <span className="text-lg">🏔️</span>
        </div>
      </div>

      {/* Información general del altiplano */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <MapPin className="w-6 h-6 text-blue-600" />
          <h3 className="text-xl font-bold text-blue-800">Cuidados Especiales para el Altiplano</h3>
        </div>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-700 mb-2">Características del Altiplano de Puno:</h4>
            <ul className="space-y-1 text-blue-600">
              <li>• Altitud: 3,812 - 5,500 msnm</li>
              <li>• Clima frígido-seco</li>
              <li>• Cambios bruscos de temperatura</li>
              <li>• Baja humedad ambiental</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-700 mb-2">Cuidados Generales:</h4>
            <ul className="space-y-1 text-blue-600">
              <li>• Hidratación constante</li>
              <li>• Protección contra el frío</li>
              <li>• Alimentación nutritiva local</li>
              <li>• Vigilancia de síntomas respiratorios</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Lista de enfermedades con recomendaciones */}
      <div className="space-y-4">
        {database?.enfermedades.map((enfermedad) => (
          <div key={enfermedad.id} className="bg-white rounded-xl shadow-lg border border-amber-100 overflow-hidden">
            {/* Header de la enfermedad */}
            <button
              onClick={() => toggleEnfermedad(enfermedad.id)}
              className="w-full p-4 text-left hover:bg-amber-50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={enfermedad.imagen}
                    alt={enfermedad.nombre}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {enfermedad.nombre}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {enfermedad.descripcion.substring(0, 100)}...
                    </p>
                  </div>
                </div>
                {enfermedadExpandida === enfermedad.id ? (
                  <ChevronUp className="w-6 h-6 text-amber-600" />
                ) : (
                  <ChevronDown className="w-6 h-6 text-amber-600" />
                )}
              </div>
            </button>

            {/* Contenido expandido */}
            {enfermedadExpandida === enfermedad.id && (
              <div className="border-t border-amber-100 p-6 space-y-6">
                {/* Descripción completa */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Descripción:</h4>
                  <p className="text-gray-700">{enfermedad.descripcion}</p>
                  <div className="mt-2 text-sm text-blue-600">
                    <strong>Prevalencia en el altiplano:</strong> {enfermedad.prevalencia}
                  </div>
                </div>

                {/* Cuidados caseros */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Cuidados Caseros
                  </h4>
                  <div className="grid gap-2">
                    {enfermedad.cuidados_caseros.map((cuidado, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-gray-700">{cuidado}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Alimentos del altiplano */}
                <div className="bg-amber-50 rounded-lg p-4">
                  <h4 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    🌾 Alimentos del Altiplano Recomendados
                  </h4>
                  <div className="grid gap-2">
                    {enfermedad.alimentos_recomendados.map((alimento, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-amber-600 mt-1">🥘</span>
                        <span className="text-amber-800">{alimento}</span>
                      </div>
                    ))}
                  </div>
                  
                  {enfermedad.evitar.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-amber-200">
                      <h5 className="font-medium text-red-700 mb-2">Evitar:</h5>
                      <div className="grid gap-1">
                        {enfermedad.evitar.map((item, index) => (
                          <div key={index} className="flex items-start gap-2">
                            <span className="text-red-500 mt-1">✗</span>
                            <span className="text-red-700 text-sm">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Factores de riesgo específicos */}
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Factores de Riesgo en el Altiplano:</h4>
                  <div className="grid gap-2">
                    {enfermedad.factores_riesgo.map((factor, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-orange-500 mt-1">⚠️</span>
                        <span className="text-gray-700 text-sm">{factor}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Señales de alarma */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-3">🚨 Señales de Alarma - Acudir URGENTEMENTE al Médico:</h4>
                  <div className="grid gap-2">
                    {enfermedad.senales_alarma.map((senal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <span className="text-red-600 mt-1">⚠️</span>
                        <span className="text-red-700 font-medium text-sm">{senal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Medicina tradicional del altiplano */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mt-8">
        <div className="flex items-center gap-2 mb-4">
          <Leaf className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-bold text-green-800">Medicina Tradicional del Altiplano</h3>
        </div>
        <p className="text-green-700 mb-4 text-sm">
          Plantas medicinales tradicionalmente usadas en el altiplano de Puno para complementar el tratamiento médico:
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          {database?.medicina_tradicional.map((planta, index) => (
            <div key={index} className="bg-white rounded-lg p-3 border border-green-200">
              <h4 className="font-medium text-green-800">{planta.nombre}</h4>
              <p className="text-sm text-green-600 mb-1">{planta.uso}</p>
              <p className="text-xs text-gray-600">Preparación: {planta.preparacion}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-green-600">
          <strong>Nota:</strong> La medicina tradicional debe usarse como complemento, no como reemplazo del tratamiento médico profesional.
        </div>
      </div>

      {/* Información de contacto */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-6">
        <h3 className="text-xl font-bold text-blue-800 mb-4">Centros de Salud - Huancané y Rosaspata</h3>
        <div className="space-y-2 text-blue-700">
          {database?.centros_salud.map((centro, index) => (
            <div key={index} className="flex items-center justify-between">
              <span className="font-medium">{centro.nombre}</span>
              <span className="text-sm">{centro.telefono}</span>
            </div>
          ))}
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
          <span>🌾</span>
          <span>🦙</span>
        </div>
        <p className="text-sm text-gray-600">
          <strong>CIBERSALUD 360</strong> - Cuidando la salud del altiplano de Puno
        </p>
      </div>
    </div>
  );
};
