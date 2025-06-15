import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ClipboardPlus, BookOpen, History } from 'lucide-react';
import { useConsulta } from '../context/ConsultaContext';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { nuevaConsulta } = useConsulta();

  const handleIniciarConsulta = (e: React.MouseEvent) => {
    e.preventDefault();
    // Limpiar completamente la consulta actual
    nuevaConsulta();
    // Navegar a la página de consulta
    navigate('/consulta');
  };

  const navItems = [
    {
      path: '/consulta',
      icon: ClipboardPlus,
      label: 'Iniciar Consulta',
      description: 'Nueva consulta médica',
      onClick: handleIniciarConsulta,
    },
    {
      path: '/recomendaciones',
      icon: BookOpen,
      label: 'Recomendaciones',
      description: 'Consejos de salud',
    },
    {
      path: '/historial',
      icon: History,
      label: 'Historial',
      description: 'Consultas anteriores',
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-amber-200 shadow-lg z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            // Si es el botón de Iniciar Consulta, usar onClick personalizado
            if (item.path === '/consulta') {
              return (
                <button
                  key={item.path}
                  onClick={item.onClick}
                  className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md scale-105'
                      : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                  }`}
                >
                  <Icon className={`w-6 h-6 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
                  <span className="text-xs font-medium text-center leading-tight">
                    {item.label}
                  </span>
                  <span className="text-xs opacity-75 text-center">
                    {item.description}
                  </span>
                </button>
              );
            }
            
            // Para otros botones, usar Link normal
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white shadow-md scale-105'
                    : 'text-gray-600 hover:text-amber-600 hover:bg-amber-50'
                }`}
              >
                <Icon className={`w-6 h-6 mb-1 ${isActive ? 'animate-pulse' : ''}`} />
                <span className="text-xs font-medium text-center leading-tight">
                  {item.label}
                </span>
                <span className="text-xs opacity-75 text-center">
                  {item.description}
                </span>
              </Link>
            );
          })}
        </div>
        
        {/* Decoración andina en la navegación */}
        <div className="flex justify-center pb-1">
          <div className="w-16 h-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full"></div>
        </div>
      </div>
    </nav>
  );
};
