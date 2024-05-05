import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd'; // Import from react-beautiful-dnd
import TaskCards from '../TaskCards/TaskCards';
import { Task } from '../ProjectView'; 

interface ColumnProps {
  title: string;
  tasks: Task[];
  onClick: (taskId: number) => void; // Add onClick prop
}

const Column: React.FC<ColumnProps> = ({ title, tasks, onClick }) => {
  return (
    <div>
      <h3>{title}</h3>
      <Droppable droppableId={title.toLowerCase().replace(/\s+/g, '-')}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {tasks.map((task, index) => (
              <Draggable key={task.taskid} draggableId={task.taskid.toString()} index={index}>
                {(provided, snapshot) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <TaskCards task={task} onClick={onClick} /> {/* Pass onClick prop */}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Column;

