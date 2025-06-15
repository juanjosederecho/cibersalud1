import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Sintoma {
  id: string;
  nombre: string;
  descripcion: string;
  icono?: string;
  relacionados?: string[];
}

export interface SintomaEspecifico {
  nombre: string;
  descripcion: string;
  icono: string;
}

export interface Enfermedad {
  id: string;
  nombre: string;
  descripcion: string;
  sintomas_principales: string[];
  sintomas_especificos: string[];
  factores_riesgo: string[];
  cuidados_caseros: string[];
  alimentos_recomendados: string[];
  evitar: string[];
  senales_alarma: string[];
  prevalencia: string;
  imagen: string;
}

export interface Consulta {
  id: string;
  fecha: string;
  nombrePaciente: string;
  sintomasSeleccionados: string[];
  enfermedadDiagnosticada: Enfermedad | null;
  probabilidad: number;
}

interface DatabaseStructure {
  sintomas_generales: Sintoma[];
  sintomas_especificos?: Record<string, SintomaEspecifico>;
  enfermedades: Enfermedad[];
  centros_salud: any[];
  medicina_tradicional: any[];
}

interface ConsultaContextType {
  // Estado actual de la consulta
  nombrePaciente: string;
  setNombrePaciente: React.Dispatch<React.SetStateAction<string>>;
  sintomasSeleccionados: string[];
  setSintomasSeleccionados: React.Dispatch<React.SetStateAction<string[]>>;
  
  // Base de datos médica
  database: DatabaseStructure | null;
  loading: boolean;
  
  // Historial de consultas
  historialConsultas: Consulta[];
  
  // Función para realizar diagnóstico
  realizarDiagnostico: () => Enfermedad | null;
  
  // Función para guardar consulta
  guardarConsulta: (consulta: Consulta) => void;
  
  // Función para nueva consulta
  nuevaConsulta: () => void;
}

const ConsultaContext = createContext<ConsultaContextType | undefined>(undefined);

export const useConsulta = () => {
  const context = useContext(ConsultaContext);
  if (context === undefined) {
    throw new Error('useConsulta debe ser usado dentro de un ConsultaContextProvider');
  }
  return context;
};

interface ConsultaContextProviderProps {
  children: ReactNode;
}

export const ConsultaContextProvider: React.FC<ConsultaContextProviderProps> = ({ children }) => {
  const [nombrePaciente, setNombrePacienteState] = useState('');
  const [sintomasSeleccionados, setSintomasSeleccionados] = useState<string[]>([]);
  const [database, setDatabase] = useState<DatabaseStructure | null>(null);
  const [loading, setLoading] = useState(true);
  const [historialConsultas, setHistorialConsultas] = useState<Consulta[]>([]);

  // Función para setear el nombre del paciente y persistirlo
  const setNombrePaciente = (nombre: string) => {
    setNombrePacienteState(nombre);
    if (nombre.trim()) {
      localStorage.setItem('cibersalud_nombrePaciente', nombre);
    } else {
      localStorage.removeItem('cibersalud_nombrePaciente');
    }
  };

  // Cargar base de datos médica y datos persistentes
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const response = await fetch('/data/enfermedades_database.json');
        const data = await response.json();
        setDatabase(data);
        
        // Cargar historial del localStorage
        const historialGuardado = localStorage.getItem('cibersalud_historial');
        if (historialGuardado) {
          setHistorialConsultas(JSON.parse(historialGuardado));
        }

        // Cargar nombre del paciente del localStorage
        const nombreGuardado = localStorage.getItem('cibersalud_nombrePaciente');
        if (nombreGuardado) {
          setNombrePacienteState(nombreGuardado);
        }
      } catch (error) {
        console.error('Error cargando base de datos:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDatabase();
  }, []);

  // Algoritmo de diagnóstico
  const realizarDiagnostico = (): Enfermedad | null => {
    if (!database || sintomasSeleccionados.length === 0) return null;

    let mejorCandidato: Enfermedad | null = null;
    let mayorCoincidencias = 0;

    // Calcular coincidencias para cada enfermedad
    database.enfermedades.forEach(enfermedad => {
      const coincidencias = enfermedad.sintomas_principales.filter(
        sintoma => sintomasSeleccionados.includes(sintoma)
      ).length;

      if (coincidencias > mayorCoincidencias) {
        mayorCoincidencias = coincidencias;
        mejorCandidato = enfermedad;
      }
    });

    return mejorCandidato;
  };

  // Guardar consulta en el historial
  const guardarConsulta = (consulta: Consulta) => {
    const nuevoHistorial = [consulta, ...historialConsultas];
    setHistorialConsultas(nuevoHistorial);
    localStorage.setItem('cibersalud_historial', JSON.stringify(nuevoHistorial));
  };

  // Iniciar nueva consulta
  const nuevaConsulta = () => {
    setNombrePaciente('');
    setSintomasSeleccionados([]);
  };

  const value: ConsultaContextType = {
    nombrePaciente,
    setNombrePaciente,
    sintomasSeleccionados,
    setSintomasSeleccionados,
    database,
    loading,
    historialConsultas,
    realizarDiagnostico,
    guardarConsulta,
    nuevaConsulta,
  };

  return (
    <ConsultaContext.Provider value={value}>
      {children}
    </ConsultaContext.Provider>
  );
};
