import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';
import TaskCards from '../TaskCards/TaskCards';
import { Task } from '../ProjectView';
import { Box, Paper, Typography } from '@mui/material'; // Import Material-UI components
import { User, getUserData } from '../../../../Services/userData';

interface ColumnProps {
  title: string;
  tasks: Task[];
  icon: JSX.Element;
  onClick: (taskId: number) => void;
}

const Column: React.FC<ColumnProps> = ({ title, tasks, onClick, icon }) => {
    const user: User = getUserData()!.user;
  return (
    <Box p={2} width={300}>
      <Paper elevation={3}>
        <Box display="flex" alignItems="center" justifyContent="center" flexDirection="column" p={2}>
          {icon}
          <Typography variant="h6" align="center" gutterBottom>
            {title}
          </Typography>
        </Box>
        <Droppable droppableId={title.toLowerCase().replace(/\s+/g, '-')}>
          {(provided, snapshot) => (
            <Box ref={provided.innerRef} {...provided.droppableProps} p={2}>
              {tasks.map((task, index) => (
                <Draggable key={task.taskid} draggableId={task.taskid.toString()} index={index} 
                isDragDisabled={!task.draggable} >
                  {(provided, snapshot) => (
                    <Box
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...(provided.dragHandleProps)}
                      mb={2}
                    >
                      <TaskCards task={task} onClick={onClick} />
                    </Box>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </Paper>
    </Box>
  );
};

export default Column;

