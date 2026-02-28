const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.get('/', (req, res) => {
  res.json({ message: 'Task Manager API - v1.0.0' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Ruta no encontrada.' });
});

module.exports = app;
