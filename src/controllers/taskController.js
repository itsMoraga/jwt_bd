const { Task } = require('../models');

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error('Error en getTasks:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title)
      return res.status(400).json({ message: 'El título es obligatorio.' });

    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (status && !validStatuses.includes(status))
      return res.status(400).json({ message: `Estado inválido. Debe ser: ${validStatuses.join(', ')}.` });

    const task = await Task.create({
      title,
      description: description || null,
      status: status || 'pending',
      userId: req.user.id,
    });

    return res.status(201).json({ message: 'Tarea creada exitosamente.', task });
  } catch (error) {
    console.error('Error en createTask:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task)
      return res.status(404).json({ message: 'Tarea no encontrada.' });

    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (status && !validStatuses.includes(status))
      return res.status(400).json({ message: `Estado inválido. Debe ser: ${validStatuses.join(', ')}.` });

    await task.update({
      title: title || task.title,
      description: description !== undefined ? description : task.description,
      status: status || task.status,
    });

    return res.status(200).json({ message: 'Tarea actualizada.', task });
  } catch (error) {
    console.error('Error en updateTask:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOne({ where: { id, userId: req.user.id } });
    if (!task)
      return res.status(404).json({ message: 'Tarea no encontrada.' });

    await task.destroy();
    return res.status(200).json({ message: 'Tarea eliminada exitosamente.' });
  } catch (error) {
    console.error('Error en deleteTask:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
