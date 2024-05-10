import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { Task, Comment } from '../ProjectView';
import { Typography, CircularProgress } from '@mui/material'; 
import { Developer } from '../ProjectView';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import GetAppIcon from '@mui/icons-material/GetApp';
import { User, getUserData } from '../../../../Services/userData';
import { addTaskCommentApi, taskUplaodAttachment, taskDwonloadattachment, taskGetAttachmentName } from '../../../../Services/constants';
import { useEffect } from 'react';


interface TaskViewProps {
  task: Task;
  onClose: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: number) => void;
  developers: Developer[] | undefined;
  showAlert: (t: 'error' | 'info') => void;
}

const TaskView: React.FC<TaskViewProps> = ({ task, onClose, onUpdateTask, developers, onDeleteTask, showAlert }) => {
  const [newComment, setNewComment] = useState<string>('');
  const [editing, setEditing] = useState<boolean>(false);
  const [editedTask, setEditedTask] = useState<Task>(task);
  const [selectedDeveloper, setSelectedDeveloper] = useState<string>(task.developerId.toString());
  const [loadingAttachment, setLoadingAttachment] = useState<boolean>(false); // State for loading attachment
  const userData: User = getUserData()!.user;

  useEffect(() => {
    // Function to update comment colors based on their state
    const updateCommentColors = () => {
      const updatedComments = task.comments.map((comment) => {
        if (comment.state === 'sent') {
          return { ...comment, color: getBorderColor() };
        } else {
          return { ...comment, color: 'gray' };
        }
      });
      setEditedTask((prevState) => ({
        ...prevState,
        comments: updatedComments,
      }));
    };

    updateCommentColors();

    fetch(`${taskGetAttachmentName}${task.taskid}/attachmentname`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('userData')}`,
        'Access-Control-Allow-Origin': '*',
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.text();
    }).then(data => {
      task.attachment = data;
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });

  }, [task.comments, task.taskid, task.attachment]);

  const handleDownloadAttachment = () => {
    fetch(`${taskDwonloadattachment}/${task.taskid}/attachmentfile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('userData')}`,
        'Access-Control-Allow-Origin': '*',
      }
    }).then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    }).then(blob => {
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', (task.attachment as string));
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    }
    ).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  };

  const handleAddComment = () => {
    if (newComment && newComment.trim() !== '') {
      const newCommentObj: Comment = {
        content: newComment,
        state: 'load',
        author: userData.unique_name,
        color: getBorderColor(),
      };
      const updatedTask: Task = {
        title: task.title,
        description: task.description,
        state: task.state,
        developerId: task.developerId,
        taskid: task.taskid,
        developerName: task.developerName,
        draggable: task.draggable,
        comments: [...task.comments, newCommentObj],
      };

      fetch(`${addTaskCommentApi}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userData')}`,
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({
          content: newComment,
          taskid: task.taskid,
          userid: userData.nameid,
          parentcommentid: null
        })
      }).then(response => {
        if (!response.ok) {
          newCommentObj.state = 'fail';
          throw new Error('Network response was not ok');
        }
        newCommentObj.state = 'sent';
        setEditedTask(updatedTask);
        return response.json();
      }
      ).catch(error => {
        newCommentObj.state = 'fail';
        setEditedTask(updatedTask);
        console.error('There has been a problem with your fetch operation:', error);
      });


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
      draggable: editedTask.draggable,
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
  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      handleAttachmentUpload(event.target.files);
    }
  };

  const handleAttachmentUpload = (files: FileList) => {
    setLoadingAttachment(true); // Set loading state to true when upload starts
    const file = files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      fetch(`${taskUplaodAttachment}/${task.taskid}/uploadattachment`, {
        method: 'POST',
        headers: {
           'Authorization': `Bearer ${localStorage.getItem('userData')}`,
            'Access-Control-Allow-Origin': '*',
        },
        body: formData
      }).then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        setLoadingAttachment(false); // Set loading state to false when upload completes
        showAlert('info');
        return response.json();
      }
      ).catch(error => {
        setLoadingAttachment(false); // Set loading state to false if there's an error
        console.error('There has been a problem with your fetch operation:', error);
      });
    }
  }

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
              {task.attachment && (
                <IconButton onClick={handleDownloadAttachment} color="inherit">
                  <GetAppIcon />
                </IconButton>
              )}
            {loadingAttachment? (
                <CircularProgress />
            ) : (
            <>
              {userData.role === 'Developer' && Number(userData.nameid) === Number(task.developerId) && (
                <>
                  <input
                    accept="image/*,application/pdf"
                    style={{ display: 'none' }}
                    id="attachment-input"
                    type="file"
                    onChange={handleAttachmentChange}
                  />
                  <label htmlFor="attachment-input">
                    <IconButton component="span">
                      <AttachFileIcon />
                    </IconButton>
                  </label>
                </>
              )}
            </>
            )}
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
                    style={{ marginBottom: '8px', borderLeft: `4px solid ${comment.state === 'sent' ? getBorderColor() : 'gray'}`, paddingLeft: '8px' }}
                  >
                    <strong>{comment.author}</strong>: {comment.content}
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

