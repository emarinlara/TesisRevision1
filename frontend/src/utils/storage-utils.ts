// Funciones de utilidad para manejo de almacenamiento con períodos lectivos

// Constantes para los períodos
const PERIODO_RANGES = {
  1: { start: '01', end: '04', label: 'Ene-Abr' },
  2: { start: '05', end: '08', label: 'May-Ago' },
  3: { start: '09', end: '12', label: 'Sep-Dic' }
};

// Inicializar el almacenamiento
const initializeStorage = () => {
  const storage = localStorage.getItem('periodos');
  if (!storage) {
    localStorage.setItem('periodos', JSON.stringify({}));
  }
};

// Generar los períodos disponibles para un año
const generatePeriodosForYear = (year) => {
  return [1, 2, 3].map(num => ({
    id: `${year}-${num}`,
    label: `${year}-${num} (${PERIODO_RANGES[num].label})`
  }));
};

// Obtener el período actual basado en la fecha
const getCurrentPeriod = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  for (const [periodo, range] of Object.entries(PERIODO_RANGES)) {
    if (currentMonth >= parseInt(range.start) && currentMonth <= parseInt(range.end)) {
      return `${currentYear}-${periodo}`;
    }
  }
  
  return `${currentYear}-1`; // Por defecto retorna el primer período
};

// Validar si un período está activo
const isPeriodoActive = (periodoId) => {
  const [year, period] = periodoId.split('-');
  const range = PERIODO_RANGES[period];
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;
  
  return parseInt(year) === currentYear &&
         currentMonth >= parseInt(range.start) &&
         currentMonth <= parseInt(range.end);
};

// Crear un nuevo período
const createPeriod = (periodoId) => {
  const periodos = JSON.parse(localStorage.getItem('periodos') || '{}');
  if (!periodos[periodoId]) {
    periodos[periodoId] = {
      comites: {}
    };
    localStorage.setItem('periodos', JSON.stringify(periodos));
  }
  return periodos[periodoId];
};

// Guardar un comité en un período específico
const saveCommittee = (periodoId, carnetEstudiante, comiteData) => {
  const periodos = JSON.parse(localStorage.getItem('periodos') || '{}');
  if (!periodos[periodoId]) {
    periodos[periodoId] = { comites: {} };
  }
  
  periodos[periodoId].comites[carnetEstudiante] = {
    estudiante: comiteData.estudiante,
    profesores: comiteData.profesores,
    revision1: {
      realizada: false,
      resultado: null,
      comentarios: '',
      fecha: null
    },
    revision2: {
      realizada: false,
      resultado: null,
      comentarios: '',
      fecha: null
    }
  };
  
  localStorage.setItem('periodos', JSON.stringify(periodos));
};

// Obtener un comité específico de un período
const getCommittee = (periodoId, carnetEstudiante) => {
  const periodos = JSON.parse(localStorage.getItem('periodos') || '{}');
  return periodos[periodoId]?.comites[carnetEstudiante];
};

// Actualizar la revisión de un comité
const updateRevision = (periodoId, carnetEstudiante, revisionNumber, data) => {
  const periodos = JSON.parse(localStorage.getItem('periodos') || '{}');
  if (periodos[periodoId]?.comites[carnetEstudiante]) {
    const revisionKey = `revision${revisionNumber}`;
    periodos[periodoId].comites[carnetEstudiante][revisionKey] = {
      ...periodos[periodoId].comites[carnetEstudiante][revisionKey],
      ...data,
      realizada: true,
      fecha: new Date().toISOString()
    };
    localStorage.setItem('periodos', JSON.stringify(periodos));
  }
};

// Obtener todos los comités de un período
const getAllCommittees = (periodoId) => {
  const periodos = JSON.parse(localStorage.getItem('periodos') || '{}');
  return periodos[periodoId]?.comites || {};
};

// Verificar si existe una revisión previa
const hasCompletedRevision = (periodoId, carnetEstudiante, revisionNumber) => {
  const comite = getCommittee(periodoId, carnetEstudiante);
  return comite?.[`revision${revisionNumber}`]?.realizada || false;
};

// Obtener todos los períodos disponibles
const getAllPeriods = () => {
  const periodos = JSON.parse(localStorage.getItem('periodos') || '{}');
  return Object.keys(periodos).map(periodoId => {
    const [year, period] = periodoId.split('-');
    return {
      id: periodoId,
      label: `${year}-${period} (${PERIODO_RANGES[period].label})`
    };
  });
};

export {
  initializeStorage,
  generatePeriodosForYear,
  getCurrentPeriod,
  isPeriodoActive,
  createPeriod,
  saveCommittee,
  getCommittee,
  updateRevision,
  getAllCommittees,
  hasCompletedRevision,
  getAllPeriods,
  PERIODO_RANGES
};
