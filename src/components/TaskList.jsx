import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Box, List } from '@mui/material';
import TaskCard from './TaskCard';

const TaskList = ({ tasks, onUpdate, onDelete, onReorder }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const reorderedTasks = Array.from(tasks);
    const [movedTask] = reorderedTasks.splice(result.source.index, 1);
    reorderedTasks.splice(result.destination.index, 0, movedTask);
    onReorder(reorderedTasks);
  };

  const handleStartEdit = (task) => {
    setEditingTaskId(task._id);
    setEditingTask({ ...task });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingTask(null);
  };

  const handleSaveEdit = async () => {
    if (editingTask) {
      await onUpdate(editingTask._id, editingTask);
      setEditingTaskId(null);
      setEditingTask(null);
    }
  };

  const handleEditChange = (updatedTask) => {
    setEditingTask(updatedTask);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <List
            {...provided.droppableProps}
            ref={provided.innerRef}
            sx={{ width: '100%' }}
          >
            {tasks.map((task, index) => (
              <Draggable key={task._id} draggableId={task._id} index={index}>
                {(provided) => (
                  <Box
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    sx={{ mb: 1 }}
                  >
                    <TaskCard
                      task={task}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                      onStartEdit={handleStartEdit}
                      onCancelEdit={handleCancelEdit}
                      onSaveEdit={handleSaveEdit}
                      onEditChange={handleEditChange}
                      isEditing={editingTaskId === task._id}
                      editingTask={editingTask}
                    />
                  </Box>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </List>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default TaskList;