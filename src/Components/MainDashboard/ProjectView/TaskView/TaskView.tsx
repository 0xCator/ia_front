import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './TaskView.css';

interface TaskViewProps {
  onClose: () => void;
}

interface TaskData {
  name: string;
  description: string;
  user: string;
  comments: string[];
}

const TaskView: React.FC<TaskViewProps> = ({ onClose }) => {
  const [taskData, setTaskData] = useState<TaskData>({
    name: 'Fake Task',
    description: 'Task description',
    user: 'Ahmad Nader',
    comments: ['Comment 1', 'Comment 2', 'Comment 3']
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<TaskData | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    // No need to fetch data, use fake data directly
  }, []);

  useEffect(() => {
    if (isEditing) {
      // Focus on the input field when editing starts
      const inputElement = document.getElementById('editedNameInput') as HTMLInputElement;
      if (inputElement) inputElement.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedTask(taskData); // Save current task data for editing
  };

  const handleSave = () => {
    // Update task data with edited values
    if (editedTask) {
      setTaskData(editedTask);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof TaskData) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [field]: e.target.value });
    }
  };

  const handleAddComment = async () => {
    try {
      if (newComment.trim() !== '') {
        // Simulating adding a comment by updating taskData
        setTaskData(prevState => ({
          ...prevState!,
          comments: [...prevState!.comments, newComment]
        }));
        setNewComment('');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  // Uncomment the following code for API request
  /*
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await fetch('API_ENDPOINT');
        if (!response.ok) {
          throw new Error('Failed to fetch task data');
        }
        const data = await response.json();
        setTaskData(data);
      } catch (error) {
        console.error('Error fetching task data:', error);
      }
    };
    fetchTaskData();
  }, []);
  */

  return (
    <div className="task-card-floating-page">
      <div>
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTask?.name}
              onChange={(e) => handleChange(e, 'name')}
              id="editedNameInput"
            />
            <input
              type="text"
              value={editedTask?.description}
              onChange={(e) => handleChange(e, 'description')}
            />
            <input
              type="text"
              value={editedTask?.user}
              onChange={(e) => handleChange(e, 'user')}
            />
          </>
        ) : (
          <>
            <h2>{taskData.name}</h2>
            <p>{taskData.description}</p>
            <p>User: {taskData.user}</p>
          </>
        )}
        <p>Comments:</p>
        <ul>
          {taskData.comments.map((comment, index) => (
            <li key={index}>{comment}</li>
          ))}
        </ul>
        {!isEditing && (
          <div className="add-comment-section">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            />
            <Button onClick={handleAddComment}>Add Comment</Button>
          </div>
        )}
        {isEditing ? (
          <>
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </>
        ) : (
          <Button onClick={handleEdit}>Edit</Button>
        )}
      </div>
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

export default TaskView;
