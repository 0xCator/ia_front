import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';

interface Task {
  id: string;
  name: string;
  description: string;
}

interface TaskCardsProps {
  onCardClick: (taskId: string) => void;
}

const TaskCards: React.FC<TaskCardsProps> = ({ onCardClick }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        // Simulated fake data
        const fakeTasks: Task[] = [
          { id: '1', name: 'Fake Task 1', description: 'fake task 1' },
          { id: '2', name: 'Fake Task 2', description: 'fake task 2' },
        ];
        // Fetch tasks from API
        const response = await fetch('/api/tasks');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data.tasks);
      } catch (error) {
        // In case of error, set error state
        setError('Failed to fetch tasks');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Define fakeTasks array within the component
  const fakeTasks: Task[] = [
    { id: '1', name: 'Fake Task 1', description: 'This is a fake task.' },
    { id: '2', name: 'Fake Task 2', description: 'Another fake task.' },
  ];

  return (
    <div>
      <h2>Task Cards</h2>
      {isLoading && <p>Loading tasks...</p>}
      {error && <p>Error: {error}</p>}
      {/* Render tasks from API or fake data */}
      {(tasks.length > 0 ? tasks : fakeTasks).map(task => (
        <Card key={task.id} onClick={() => onCardClick(task.id)}>
          <Card.Body>
            <Card.Title>{task.name}</Card.Title>
            <Card.Text>{task.description}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default TaskCards;
