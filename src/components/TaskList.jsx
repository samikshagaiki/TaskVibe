
import { useState } from 'react';
import { Box, List } from '@mui/material';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import TaskCard from './TaskCard';

const SortableTask = ({
  task,
  onUpdate,
  onDelete,
  onStartEdit,
  onCancelEdit,
  onSaveEdit,
  onEditChange,
  isEditing,
  editingTask,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: task._id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      sx={{ mb: 1 }}
    >
      <TaskCard
        task={task}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onStartEdit={onStartEdit}
        onCancelEdit={onCancelEdit}
        onSaveEdit={onSaveEdit}
        onEditChange={onEditChange}
        isEditing={isEditing}
        editingTask={editingTask}
      />
    </Box>
  );
};

const TaskList = ({ tasks, onUpdate, onDelete, onReorder }) => {
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((task) => task._id === active.id);
    const newIndex = tasks.findIndex((task) => task._id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reorderedTasks = arrayMove(tasks, oldIndex, newIndex);

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
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={verticalListSortingStrategy}
      >
        <List sx={{ width: '100%' }}>
          {tasks.map((task) => (
            <SortableTask
              key={task._id}
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
          ))}
        </List>
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;