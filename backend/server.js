const express = require('express');
const app = express();
const evaluationController = require('./evaluationController');
const port = 3000;

app.listen(port, () => {
  console.log(`Servidor backend escuchando en el puerto ${port}`);
});
app.use(express.json());

app.post('/evaluacion', (req, res) => {
  const evaluationData = req.body;
  evaluationController.saveEvaluation(evaluationData);
  res.send('Datos de evaluación recibidos correctamente');
});
