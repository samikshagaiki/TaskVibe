import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import TaskList from '../components/TaskList';
import Chatbot from '../components/Chatbot';
import { BotCharacter } from '../components/BotCharacter';
import BackgroundParticles from '../components/BackgroundParticles';
import { Box, Typography, TextField, Select, MenuItem, Button, Alert, Link } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const Tasks = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', priority: 'medium' });
  const [error, setError] = useState('');
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show speech bubble after a brief delay
    const timer = setTimeout(() => {
      setShowSpeechBubble(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

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
        headers: { Authorization: `Bearer ${localStorage.getToken('token')}` },
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

  const handleGoToAddTask = () => {
    navigate('/add-task');
  };

  return (
    <>
      <BackgroundParticles />
      <Box sx={{ p: 4, maxWidth: 800, mx: 'auto', position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" sx={{ mb: 4, color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
          Your Tasks
        </Typography>
        
        {/* Bot Character with tasks overview message */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', position: 'relative' }}>
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* Speech Bubble - positioned above the bot */}
            <AnimatePresence>
              {showSpeechBubble && (
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: 10 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0 }}
                  style={{
                    marginBottom: '20px',
                    width: 'max-content',
                    maxWidth: '90vw',
                    zIndex: 10,
                  }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      bgcolor: 'white',
                      borderRadius: '16px',
                      px: 3,
                      py: 1.5,
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      border: '2px solid #90caf9',
                      display: 'inline-block',
                      maxWidth: '300px',
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        color: '#1f2937',
                        fontWeight: 500,
                        fontSize: '1rem',
                        whiteSpace: 'normal',
                        wordBreak: 'break-word',
                      }}
                    >
                      These are your tasks! {tasks.length === 0 ? 'You have no tasks yet. ' : ''}
                      If you want to add a task, {' '}
                      <Link 
                        component="button"
                        onClick={handleGoToAddTask}
                        sx={{ 
                          color: '#1976d2',
                          textDecoration: 'underline',
                          cursor: 'pointer',
                          display: 'inline',
                          fontWeight: 'bold',
                          '&:hover': {
                            color: '#1565c0',
                          }
                        }}
                      >
                        click here
                      </Link>
                      !
                    </motion.div>

                    {/* Tail pointing down */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '10px solid transparent',
                        borderRight: '10px solid transparent',
                        borderTop: '10px solid #90caf9',
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 'calc(100% - 2px)',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 0,
                        borderLeft: '8px solid transparent',
                        borderRight: '8px solid transparent',
                        borderTop: '8px solid white',
                      }}
                    />
                  </Box>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bot Character */}
            <BotCharacter size={150} />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TaskList
          tasks={tasks}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onReorder={reorderTasks}
        />
        
        <Chatbot onAddTask={addTask} user={user} />
      </Box>
    </>
  );
};

export default Tasks;