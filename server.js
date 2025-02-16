const express = require('express');
const app = express();

// Rutas y lógica del servidor aquí

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}`);
});
