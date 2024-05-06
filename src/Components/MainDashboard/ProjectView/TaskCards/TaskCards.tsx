// TaskCards.tsx

import React from 'react';
import { Card } from 'react-bootstrap';

interface Task {
  taskid: number;
  title: string;
  developerName: string;
  description: string;
  state: 'todo' | 'doing' | 'done';
}

interface TaskCardProps {
  task: Task;
  onClick: (taskId: number) => void; // Add onClick prop to handle click events
}

const TaskCards: React.FC<TaskCardProps> = ({ task, onClick }) => {
  let cardColor: string;
  switch (task.state) {
    case 'todo':
      cardColor = 'warning';
      break;
    case 'doing':
      cardColor = 'info';
      break;
    case 'done':
      cardColor = 'success';
      break;
    default:
      cardColor = 'light';
  }

  const handleClick = () => {
    onClick(task.taskid); // Pass taskId to the onClick handler
  };

  return (
    <Card bg={cardColor} text="white" style={{ width: '18rem', cursor: 'pointer' }} onClick={handleClick}>
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        <Card.Text>{task.developerName}</Card.Text>
        <Card.Text>{task.description}</Card.Text>
        <Card.Text>Status: {task.state}</Card.Text>
      </Card.Body>
    </Card>
  );
};

export default TaskCards;
