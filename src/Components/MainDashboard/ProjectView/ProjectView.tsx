import React, { useState } from 'react';
import TaskCards from './TaskCards/TaskCards';
import TaskView from './TaskView/TaskView';

const ProjectView: React.FC = () => {
  const [showTaskView, setShowTaskView] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTaskClick = (taskId: string) => {
    setShowTaskView(true);
    setSelectedTaskId(taskId);
  };

  const handleCloseTaskView = () => {
    setShowTaskView(false);
    setSelectedTaskId(null);
  };

  return (
    <div>
      <h1>Project View</h1>
      <TaskCards onCardClick={handleTaskClick} />
      {showTaskView && selectedTaskId && <TaskView onClose={handleCloseTaskView} />}
    </div>
  );
};

export default ProjectView;
