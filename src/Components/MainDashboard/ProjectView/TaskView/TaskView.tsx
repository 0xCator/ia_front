import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';

interface TaskViewProps {
  taskId: number;
  onClose: () => void;
}

interface Task {
  taskid: number;
  title: string;
  developerName: string;
  description: string;
  state: 'todo' | 'doing' | 'done';
  comments: string[];
}

const TaskView: React.FC<TaskViewProps> = ({ taskId, onClose }) => {
  const [task, setTask] = useState<Task | null>({
    taskid: taskId,
    title: 'Fake Task',
    developerName: 'Ahmad Naders',
    description: 'Task description',
    state: 'done',
    comments: ['Comment 1', 'Comment 2', 'Comment 3']
  }
  
  );
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState<string>('ahmad comment');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`api/tasks/${taskId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }
        const data = await response.json();
        setTask(data);
        setEditedTask(data); // Initialize editedTask with fetched data
      } catch (error) {
        console.error('Error fetching task:', error);
      }
    };

    fetchTask();

    // Cleanup function
    return () => {
      // Cleanup code if needed
    };
  }, [taskId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, field: keyof Task) => {
    if (editedTask) {
      setEditedTask({ ...editedTask, [field]: e.target.value });
    }
  };

  const handleSave = async () => {
    try {
      if (editedTask) {
        const response = await fetch(`your-api-endpoint/tasks/${editedTask.taskid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(editedTask),
        });
        if (!response.ok) {
          throw new Error('Failed to save task');
        }
        console.log('Task saved successfully');
        onClose();
      }
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  const handleAddComment = () => {
    if (newComment.trim() !== '' && editedTask) {
      setEditedTask(prevState => {
        if (prevState) {
          return {
            ...prevState,
            comments: [...prevState.comments, newComment],
          };
        }
        return prevState;
      });
      setNewComment('');
    }
  };

  return (
    <div className="task-card-floating-page">

      <h1>Task ID == {task?.taskid}</h1>
      {task ? (
        <>
          <div>
            <label>Title:</label>
            {editedTask ? (
              <input type="text" value={editedTask.title} onChange={(e) => handleChange(e, 'title')} />
            ) : (
              <h2>{task.title}</h2>
            )}
            <label>Developer Name:</label>
            {editedTask ? (
              <input type="text" value={editedTask.developerName} onChange={(e) => handleChange(e, 'developerName')} />
            ) : (
              <h3>{task.developerName}</h3>
            )}
            <label>Description:</label>
            {editedTask ? (
              <textarea value={editedTask.description} onChange={(e) => handleChange(e, 'description')} />
            ) : (
              <p>{task.description}</p>
            )}
            <label>Status:</label>
            <p>{task.state}</p>

            <h3>Comments:</h3>
            <ul>
              {editedTask?.comments.map((comment, index) => (
                <li key={index}>{comment}</li>
              ))}
            </ul>

            <div className="add-comment-section">
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment" />
              <Button onClick={handleAddComment}>Add Comment</Button>
            </div>

            {editedTask ? (
              <>
                <Button onClick={handleSave}>Save</Button>
                <Button onClick={() => setEditedTask(null)}>Cancel</Button>
              </>
            ) : (
              <Button onClick={() => setEditedTask(task)}>Edit</Button>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
      <Button onClick={onClose}>Close</Button>
    </div>
  );
};

export default TaskView;
