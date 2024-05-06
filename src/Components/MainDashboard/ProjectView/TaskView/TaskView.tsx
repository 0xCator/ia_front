import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { Task } from '../ProjectView';

interface TaskViewProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
}

const TaskView: React.FC<TaskViewProps> = ({ task, onClose, onUpdateTask }) => {
  const [newComment, setNewComment] = useState<string>('');

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const updatedTask = { ...task, comments: [...task.comments, newComment] };
      onUpdateTask(updatedTask);
      setNewComment('');
    }
  };

  const getBorderColor = () => {
    switch (task.state) {
      case 'to-do':
        return '#FFC107'; // Yellow for to-do
      case 'doing':
        return '#2196F3'; // Blue for doing
      case 'done':
        return '#4CAF50'; // Green for done
      default:
        return '#000'; // Default black
    }
  };

  return (
    <Dialog open onClose={onClose} PaperProps={{ style: { border: `2px solid ${getBorderColor()}`, minWidth: '600px', minHeight: '400px' } }}>
      <DialogTitle style={{ backgroundColor: '#f0f0f0', borderBottom: `2px solid ${getBorderColor()}` }}>
        Task ID: {task.taskid}
      </DialogTitle>
      <DialogContent dividers>
        <div style={{ marginBottom: '16px' }}>
          <strong>Title:</strong> {task.title}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Developer:</strong> {task.developerName}
        </div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Description:</strong>
          <div style={{ marginTop: '8px', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>{task.description}</div>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <strong>Status:</strong> {task.state}
        </div>

        <div style={{ marginBottom: '16px' }}>
          <strong>Comments:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '8px', listStyleType: 'none' }}>
            {task.comments.map((comment, index) => (
              <li key={index} style={{ marginBottom: '8px', borderLeft: `4px solid ${getBorderColor()}`, paddingLeft: '8px' }}>{comment}</li>
            ))}
          </ul>
        </div>

        <TextField
          label="Add a comment"
          variant="outlined"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button onClick={handleAddComment} variant="contained" color="primary">
          Add Comment
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskView;

