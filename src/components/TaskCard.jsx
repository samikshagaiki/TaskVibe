import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, Typography, Button, TextField, MenuItem, Select, Box } from '@mui/material';
import Confetti from 'react-confetti'; // Import Confetti

const TaskCard = ({ 
  task, 
  onUpdate, 
  onDelete, 
  onStartEdit, 
  onCancelEdit, 
  onSaveEdit, 
  onEditChange, 
  isEditing, 
  editingTask 
}) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'grab',
  };

  const handleStatusChange = async (status) => {
    if (status === 'done') setShowConfetti(true);
    await onUpdate(task._id, { ...task, status });
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const handleEditClick = () => {
    onStartEdit(task);
  };

  const handleCancelClick = () => {
    onCancelEdit();
  };

  const handleSaveClick = () => {
    onSaveEdit();
  };

  const handleFieldChange = (field, value) => {
    onEditChange({ ...editingTask, [field]: value });
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Render Confetti when showConfetti is true */}
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}
      <Card sx={{ mb: 2, opacity: task.status === 'done' ? 0.7 : 1 }}>
        <CardContent>
          {isEditing ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Title"
                value={editingTask.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                fullWidth
              />
              <TextField
                label="Description"
                value={editingTask.description || ''}
                onChange={(e) => handleFieldChange('description', e.target.value)}
                multiline
                rows={3}
                fullWidth
              />
              <Select
                value={editingTask.priority}
                onChange={(e) => handleFieldChange('priority', e.target.value)}
                fullWidth
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button variant="contained" color="success" onClick={handleSaveClick}>
                  Save
                </Button>
                <Button variant="outlined" onClick={handleCancelClick}>
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <>
              <Typography variant="h6" sx={{ color: 'white' }}>
                {task.title}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                {task.description}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                Priority: {task.priority}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', opacity: 0.8 }}>
                Status: {task.status || 'pending'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleStatusChange('done')}
                  disabled={task.status === 'done'}
                >
                  Complete
                </Button>
                <Button variant="contained" color="warning" onClick={handleEditClick}>
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => onDelete(task._id)}
                >
                  Delete
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TaskCard;