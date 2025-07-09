// src/pages/AddTaskPage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Typography, TextField, Select, MenuItem, Button, Alert } from '@mui/material';
import { BotCharacter } from '../components/BotCharacter';
import BackgroundParticles from '../components/BackgroundParticles';
import { motion, AnimatePresence } from 'framer-motion';

const AddTaskPage = () => {
  const [task, setTask] = useState({ title: '', description: '', priority: 'medium' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show speech bubble after a brief delay
    const timer = setTimeout(() => {
      setShowSpeechBubble(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleAddTask = async () => {
    if (!task.title.trim()) {
      setError('Task title is required');
      return;
    }
    try {
      await axios.post('/api/tasks', task, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSuccess(true);
      setError('');
      // Clear form
      setTask({ title: '', description: '', priority: 'medium' });
      // Redirect to tasks page after a brief delay
      setTimeout(() => {
        navigate('/tasks');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add task');
      setSuccess(false);
    }
  };

  return (
    <>
      <BackgroundParticles />
      <Box sx={{ p: 4, maxWidth: 600, mx: 'auto', position: 'relative', zIndex: 1 }}>
        <Typography variant="h4" sx={{ mb: 4, color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Add New Task
        </Typography>
        
        {/* Bot Character with welcome message */}
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
                      maxWidth: '400px',
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
                      Welcome! You can add your tasks here. Fill in the details below and click 'Add Task' to create a new task.
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

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>Task added successfully! Redirecting to tasks page...</Alert>}
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            label="Task Title"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            variant="outlined"
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ 
              style: { color: 'white' },
              sx: {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
              }
            }}
          />
          <TextField
            label="Description"
            value={task.description}
            onChange={(e) => setTask({ ...task, description: e.target.value })}
            variant="outlined"
            multiline
            rows={3}
            InputLabelProps={{ style: { color: 'white' } }}
            InputProps={{ 
              style: { color: 'white' },
              sx: {
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'white',
                },
              }
            }}
          />
          <Select
            value={task.priority}
            onChange={(e) => setTask({ ...task, priority: e.target.value })}
            sx={{ 
              color: 'white',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.3)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
            }}
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
            sx={{ 
              mt: 2,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
            }}
          >
            Add Task
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default AddTaskPage;