import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TaskCards from './TaskCards/TaskCards';
import TaskView from './TaskView/TaskView';
import { useParams } from 'react-router-dom'; // Import useParams
import './ProjectView.css';

interface Task {
  taskid: number;
  title: string;
  description: string;
  state: 'todo' | 'doing' | 'done';
}

const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>(); // Get projectId from URL params
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks: Task[] = [
          { taskid: 1, title: 'Task 1', description: 'Description 1', state: 'done' },
          { taskid: 2, title: 'Task 2', description: 'Description 2', state: 'todo' },
          { taskid: 3, title: 'Task 3', description: 'Description 3', state: 'doing' },
          { taskid: 4, title: 'Task 4', description: 'Description 4', state: 'todo' },
          { taskid: 5, title: 'Task 5', description: 'Description 5', state: 'doing' },
          { taskid: 6, title: 'Task 6', description: 'Description 6', state: 'todo' },
        ];
        setTasks(tasks);      
        const response = await fetch(`api/projects/${projectId}/tasks`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, [projectId]); // Fetch tasks whenever projectId changes

  const todoTasks = tasks.filter(task => task.state === 'todo');
  const doingTasks = tasks.filter(task => task.state === 'doing');
  const doneTasks = tasks.filter(task => task.state === 'done');

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  return (
    <div className="dashboard-container" style={{ backgroundColor: '#212529', color: '#000' }}>  
      <Container>
        <Row>
          <Col>
            <h2>Project Name</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <h3>To Do</h3>
            {todoTasks.map(task => (
              <TaskCards key={task.taskid} task={task} onClick={handleTaskClick} />
            ))}
          </Col>
          <Col>
            <h3>Doing</h3>
            {doingTasks.map(task => (
              <TaskCards key={task.taskid} task={task} onClick={handleTaskClick} />
            ))}
          </Col>
          <Col>
            <h3>Done</h3>
            {doneTasks.map(task => (
              <TaskCards key={task.taskid} task={task} onClick={handleTaskClick} />
            ))}
          </Col>
        </Row>
      </Container>
      {selectedTaskId && <TaskView taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />}
    </div>
  );
};

export default ProjectView;
