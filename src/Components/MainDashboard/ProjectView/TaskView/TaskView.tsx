import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import './TaskView.css';

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
  const [newComment, setNewComment] = useState<string>('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const response = await fetch(`api/tasks/${taskId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch task');
        }
        const data = await response.json();
        setTask(data);
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
  };

  const handleSave = async () => {
  };

  const handleAddComment = () => {
    if (task) {
        const newCommenta = newComment.trim();
        if (!newCommenta) {
            return;
        }
        setTask({
            ...task,
            comments: [...task.comments, newCommenta]
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
              <h2>{task.title}</h2>
              <h3>{task.developerName}</h3>
            <label>Description:</label>
              <p>{task.description}</p>
            <label>Status:</label>
            <p>{task.state}</p>

            <h3>Comments:</h3>
            <ul>
                {task.comments.map((comment, index) => (
                    <li key={index}>{comment}</li>
                ))}
            </ul>

            <div className="add-comment-section">
              <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add a comment" />
              <Button onClick={handleAddComment}>Add Comment</Button>
            </div>

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
