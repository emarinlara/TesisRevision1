import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

function App() {
  const [datosEstudiante, setDatosEstudiante] = useState({
    carnet: '',
    nombre: '',
    profesor1: '',
    profesor2: '',
    profesor3: '',
    confirmacion1: false,
    confirmacion2: false,
    confirmacion3: false
  });

  const [evaluaciones, setEvaluaciones] = useState({
    Presentación: null,
    Investigación: null,
    Proyecto: null
  });

  const [comentarios, setComentarios] = useState('');
  const [resultado, setResultado] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [error, setError] = useState('');

  const pesos = {
    Presentación: 0.20,
    Investigación: 0.30,
    Proyecto: 0.50
  };

  const valores = {
    insuficiente: 0.40,
    suficiente: 0.70,
    bueno: 0.80,
    excelente: 1.00
  };

  // Las funciones se mantienen igual
  const validarCarnet = (carnet) => {
    return /^\d{9}$/.test(carnet);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name === 'carnet') {
      if (value.length > 9) return;
      if (value !== '' && !/^\d*$/.test(value)) return;
    }
    
    setDatosEstudiante(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'carnet' && value.length === 9) {
      if (!validarCarnet(value)) {
        setError('El carnet debe ser un número de 9 dígitos');
      } else {
        setError('');
      }
    }
  };

  const handleEvaluacionChange = (criterio, valor) => {
    setEvaluaciones(prev => ({
      ...prev,
      [criterio]: valores[valor]
    }));
  };

  const handleComentariosChange = (e) => {
    setComentarios(e.target.value);
  };

  const datosCompletos = () => {
    return datosEstudiante.carnet &&
           validarCarnet(datosEstudiante.carnet) &&
           datosEstudiante.nombre &&
           datosEstudiante.profesor1 &&
           datosEstudiante.profesor2 &&
           datosEstudiante.profesor3 &&
           datosEstudiante.confirmacion1 &&
           datosEstudiante.confirmacion2 &&
           datosEstudiante.confirmacion3;
  };

  const todosRadiosSeleccionados = () => {
    return Object.values(evaluaciones).every(value => value !== null);
  };

  const hayComentarios = () => {
    return comentarios.trim().length > 0;
  };

  const handleCalcular = () => {
    const total = Object.entries(evaluaciones).reduce((sum, [criterio, valor]) => {
      return sum + (valor * pesos[criterio]);
    }, 0);

    const resultadoFinal = (total * 100).toFixed(2);
    setResultado(resultadoFinal);
    setMostrarResultado(true);
  };

  const generarPDF = async () => {
    try {
      const doc = new jsPDF();
      
      doc.setFontSize(16);
      doc.text('Primera revisión Comité de Tesis (40%)', 105, 20, { align: 'center' });
      
      doc.setFontSize(12);
      doc.text('Datos del Estudiante:', 20, 40);
      doc.text(`Carnet: ${datosEstudiante.carnet}`, 20, 50);
      doc.text(`Nombre: ${datosEstudiante.nombre}`, 20, 60);
      
      doc.text('Comité Evaluador:', 20, 80);
      doc.text(`1. ${datosEstudiante.profesor1}`, 20, 90);
      doc.text(`2. ${datosEstudiante.profesor2}`, 20, 100);
      doc.text(`3. ${datosEstudiante.profesor3}`, 20, 110);
      
      doc.text('Evaluaciones:', 20, 130);
      Object.entries(evaluaciones).forEach(([criterio, valor], index) => {
        const porcentaje = (valor * 100).toFixed(0);
        doc.text(`${criterio}: ${porcentaje}%`, 20, 140 + (index * 10));
      });
      
      doc.setFontSize(14);
      doc.text(`Resultado Final: ${resultado}%`, 20, 180);
      
      doc.setFontSize(12);
      doc.text('Comentarios:', 20, 200);
      const comentariosLineas = doc.splitTextToSize(comentarios, 170);
      doc.text(comentariosLineas, 20, 210);
      
      const fecha = new Date().toLocaleDateString();
      doc.text(`Fecha de evaluación: ${fecha}`, 20, 270);
      
      doc.save(`Evaluacion_40_${datosEstudiante.carnet}.pdf`);

      setDatosEstudiante({
        carnet: '',
        nombre: '',
        profesor1: '',
        profesor2: '',
        profesor3: '',
        confirmacion1: false,
        confirmacion2: false,
        confirmacion3: false
      });
      setEvaluaciones({
        Presentación: null,
        Investigación: null,
        Proyecto: null
      });
      setComentarios('');
      setResultado(null);
      setMostrarResultado(false);
      
    } catch (error) {
      console.error('Error al generar PDF:', error);
      setError('Error al generar el PDF');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg shadow-sm">
            Primera revisión Comité de Tesis (40%)
          </h1>
          
          <div className="space-y-8">
            {/* Sección de datos del estudiante */}
            <div className="space-y-4 p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                Datos del Estudiante
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <input
                    type="text"
                    name="carnet"
                    placeholder="Carnet (9 dígitos)"
                    value={datosEstudiante.carnet}
                    onChange={handleInputChange}
                    className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                    maxLength="9"
                  />
                  {datosEstudiante.carnet && !validarCarnet(datosEstudiante.carnet) && (
                    <p className="text-red-500 text-sm mt-1 pl-1">
                      El carnet debe ser un número de 9 dígitos
                    </p>
                  )}
                </div>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre del Estudiante"
                  value={datosEstudiante.nombre}
                  onChange={handleInputChange}
                  className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Sección de profesores */}
            <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                Comité Evaluador
              </h2>
              <div className="space-y-6">
                {[1, 2, 3].map((num) => (
                  <div key={num} className="p-4 bg-gray-50 rounded-lg">
                    <input
                      type="text"
                      name={`profesor${num}`}
                      placeholder={`Nombre del Profesor ${num}`}
                      value={datosEstudiante[`profesor${num}`]}
                      onChange={handleInputChange}
                      className="p-3 border rounded-lg w-full focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                    />
                    <div className="mt-3">
                      <label className="inline-flex items-center hover:text-blue-600 transition-colors duration-200">
                        <input
                          type="checkbox"
                          name={`confirmacion${num}`}
                          checked={datosEstudiante[`confirmacion${num}`]}
                          onChange={handleInputChange}
                          className="form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                        />
                        <span className="ml-2 text-gray-700">
                          Confirmo que he leído el documento de tesis
                        </span>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tabla de evaluación */}
            {datosCompletos() && (
              <div className="space-y-6 p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                  Evaluación
                </h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 border rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Criterio
                        </th>
                        {Object.entries(valores).map(([valor, _]) => (
                          <th key={valor} className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            {valor} ({(_) * 100}%)
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {Object.entries(evaluaciones).map(([criterio, valor]) => (
                        <tr key={criterio} className="hover:bg-gray-50 transition-colors duration-150">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                            {criterio} ({pesos[criterio] * 100}%)
                          </td>
                          {Object.entries(valores).map(([valorNombre, valorPeso]) => (
                            <td key={valorNombre} className="px-6 py-4 whitespace-nowrap text-center">
                              <input
                                type="radio"
                                name={criterio}
                                value={valorNombre}
                                checked={valor === valorPeso}
                                onChange={() => handleEvaluacionChange(criterio, valorNombre)}
                                className="form-radio h-4 w-4 text-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors duration-200"
                              />
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Comentarios */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Comentarios
                  </label>
                  <textarea
                    value={comentarios}
                    onChange={handleComentariosChange}
                    rows="4"
                    className="mt-1 block w-full border rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition-all duration-200"
                    placeholder="Ingrese sus comentarios aquí..."
                  />
                </div>

                {/* Botones y Resultado */}
                <div className="space-y-4 pt-4">
                  <button
                    onClick={handleCalcular}
                    disabled={!todosRadiosSeleccionados()}
                    className="w-full md:w-auto px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
                  >
                    Calcular Resultado
                  </button>

                  {mostrarResultado && (
                    <div className="p-6 bg-blue-50 rounded-lg border border-blue-200 shadow-sm">
                      <p className="text-lg font-semibold text-blue-800">
                        Resultado de la evaluación: {resultado}%
                      </p>
                    </div>
                  )}

                  <button
                    onClick={generarPDF}
                    disabled={!mostrarResultado || !hayComentarios()}
                    className="w-full md:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
                  >
                    Generar PDF
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="text-red-500 mt-4">
                {error}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
