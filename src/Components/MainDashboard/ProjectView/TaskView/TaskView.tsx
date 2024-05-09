import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { Task } from '../ProjectView';
import { Typography } from '@mui/material';
import { Developer } from '../ProjectView';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import { User, getUserData } from '../../../../Services/userData';

interface TaskViewProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: number) => void;
  developers: Developer[] | undefined;
}

const TaskView: React.FC<TaskViewProps> = ({ task, onClose, onUpdateTask, developers, onDeleteTask }) => {
  const [newComment, setNewComment] = useState<string>('');
  const [editing, setEditing] = useState<boolean>(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>(task.developerId.toString());
  const userData: User = getUserData()!.user;

  const handleAddComment = () => {
    if (newComment.trim() !== '') {
      const updatedTask = { ...task, comments: [...task.comments, newComment] };
      onUpdateTask(updatedTask);
      setNewComment('');
    }
  };

  const handleEditClick = () => {
    setEditing(true);
  };

  const handleSaveClick = () => {
    const updatedTask: Task = {
      title: editedTask.title,
      description: editedTask.description,
      state: editedTask.state,
      developerId: Number(selectedDeveloper),
      comments: editedTask.comments,
      taskid: editedTask.taskid,
      developerName: developers?.find((developer) => developer.id === Number(selectedDeveloper))?.name || '',
    };
    onUpdateTask(updatedTask);
    setEditing(false);
  };

  const handleDeleteClick = () => {
    onDeleteTask(task.taskid);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTask((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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

  const handleDeveloperChange = (e: SelectChangeEvent) => {
    setSelectedDeveloper(e.target.value);
  };

  return (
    <Dialog
      open
      onClose={onClose}
      PaperProps={{ style: { border: `2px solid ${getBorderColor()}`, minWidth: '600px', minHeight: '400px' } }}
    >
      <DialogTitle
        style={{
          backgroundColor: `${getBorderColor()}`,
          borderBottom: `2px solid ${getBorderColor()}`,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {editing ? (
          <>
            <TextField label="Title" name="title" value={editedTask.title} onChange={handleInputChange} />
            <IconButton onClick={handleSaveClick} color="inherit">
              <SaveIcon />
            </IconButton>
          </>
        ) : (
          <>
            <div>
              #{task.taskid} {task.title}
            </div>
            <div>
              {userData.role === 'TeamLeader' && (
                <>
                  <IconButton onClick={handleEditClick} color="inherit">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={handleDeleteClick} color="inherit">
                    <DeleteIcon />
                  </IconButton>
                </>
              )}
            </div>
          </>
        )}
      </DialogTitle>
      <DialogContent dividers>
        {editing && (
          <Typography style={{ marginBottom: '16px' }}>
            <strong>Developer:</strong>
            <Select value={selectedDeveloper} onChange={handleDeveloperChange} sx={{ width: '100%' }}>
              {developers &&
                developers.map((developer) => (
                  <MenuItem key={developer.id} value={developer.id}>
                    {developer.name}
                  </MenuItem>
                ))}
            </Select>
          </Typography>
        )}
        {editing && (
          <TextField
            label="Description"
            name="description"
            value={editedTask.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
          />
        )}
        {!editing && (
          <Typography style={{ marginBottom: '16px' }}>
            <strong>Developer:</strong> {task.developerName}
          </Typography>
        )}
        {!editing && (
          <Typography style={{ marginBottom: '16px' }}>
            <strong>Description:</strong>
            <div style={{ marginTop: '8px', border: '1px solid #ccc', padding: '8px', borderRadius: '4px' }}>
              {task.description}
            </div>
          </Typography>
        )}
        {!editing && (
          <>
            <Typography style={{ marginBottom: '16px' }}>
              <strong>Comments:</strong>
              <ul style={{ paddingLeft: '20px', marginTop: '8px', listStyleType: 'none' }}>
                {task.comments.map((comment, index) => (
                  <li
                    key={index}
                    style={{ marginBottom: '8px', borderLeft: `4px solid ${getBorderColor()}`, paddingLeft: '8px' }}
                  >
                    {comment}
                  </li>
                ))}
              </ul>
            </Typography>
            <TextField
              label="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              fullWidth
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        {!editing && (
          <Button onClick={handleAddComment} variant="contained" color="primary">
            Add Comment
          </Button>
        )}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskView;
