import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Task } from '../ProjectView';

interface TaskCardProps {
  task: Task;
  onClick: (taskId: number) => void;
}

const TaskCards: React.FC<TaskCardProps> = ({ task, onClick }) => {
  let cardBorderColor: string;
  switch (task.state) {
    case 'to-do':
      cardBorderColor = '#FFC107'; // Yellow for to-do
      break;
    case 'doing':
      cardBorderColor = '#2196F3'; // Blue for doing
      break;
    case 'done':
      cardBorderColor = '#4CAF50'; // Green for done
      break;
    default:
      cardBorderColor = '#000'; // Default black
  }

  const handleClick = () => {
    onClick(task.taskid);
  };

  return (
    <Card
      style={{ border: `2px solid ${cardBorderColor}`, borderRadius: '8px', cursor: 'pointer' }}
      onClick={handleClick}
    >
      <CardContent style={{ backgroundColor: '#fff' }}>
        <Typography variant="h5" component="div">
            #{task.taskid} {task.title}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          {task.developerName}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TaskCards;

