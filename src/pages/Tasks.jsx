import { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from '../components/TaskList';
import Chatbot from '../components/Chatbot';
import BackgroundParticles from '../components/BackgroundParticles';
import { Box, Typography, TextField, Select, MenuItem, Button, Alert } from '@mui/material';

const Tasks = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/api/tasks', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setTasks(res.data);
        setError('');
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch tasks');
        console.error('Fetch tasks error:', err);
      }
    };
    fetchTasks();
  }, []);

  const addTask = async (task) => {
    try {
      const res = await axios.post('/api/tasks', task, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks([...tasks, res.data]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
      console.error('Add task error:', err);
    }
  };

  const updateTask = async (id, updatedTask) => {
    try {
      const res = await axios.put(`/api/tasks/${id}`, updatedTask, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.map(task => (task._id === id ? res.data : task)));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update task');
      console.error('Update task error:', err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setTasks(tasks.filter(task => task._id !== id));
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete task');
      console.error('Delete task error:', err);
    }
  };

  const reorderTasks = async (reorderedTasks) => {
    try {
      const updates = reorderedTasks.map((task, index) => ({
        id: task._id,
        order: index,
      }));
      await Promise.all(
        updates.map(update =>
          axios.put(`/api/tasks/${update.id}`, { order: update.order }, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
        )
      );
      setTasks(reorderedTasks);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reorder tasks');
      console.error('Reorder tasks error:', err);
    }
  };

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      setError('Task title is required');
      return;
    }
    addTask(newTask);
    setNewTask({ title: '', description: '', priority: 'medium' });
  };

  return (
    
    <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ mb: 4, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
        Your Tasks
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
        <TextField
          label="Task Title"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          sx={{ flex: 1, minWidth: 200 }}
          variant="outlined"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
        <TextField
          label="Description"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          sx={{ flex: 1, minWidth: 200 }}
          variant="outlined"
          InputLabelProps={{ style: { color: 'white' } }}
          InputProps={{ style: { color: 'white' } }}
        />
        <Select
          value={newTask.priority}
          onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
          sx={{ minWidth: 120, color: 'white' }}
          variant="outlined"
        >
          <MenuItem value="low">Low</MenuItem>
          <MenuItem value="medium">Medium</MenuItem>
          <MenuItem value="high">High</MenuItem>
        </Select>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleAddTask}
        >
          Add Task
        </Button>
      </Box>
      <TaskList
        tasks={tasks}
        onUpdate={updateTask}
        onDelete={deleteTask}
        onReorder={reorderTasks}
      />
      <Chatbot onAddTask={addTask} user={user} />
    </Box>
  );
};

export default Tasks;