import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import TaskCards from './TaskCards/TaskCards';
import TaskView from './TaskView/TaskView';
import { useParams } from 'react-router-dom'; // Import useParams
import TaskCreationForm from './TaskCreationForm/TaskCreationForm';

interface Task {
  taskid: number;
  title: string;
  developerName: string;
  description: string;
  state: 'todo' | 'doing' | 'done';
}

const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>(); // Get projectId from URL params
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks: Task[] = [
          { taskid: 1, title: 'Task 1', developerName: 'Ahmad Abo-Tahoun', description: 'Description 1', state: 'done' },
          { taskid: 2, title: 'Task 2', developerName: 'Ahmad Nader', description: 'Description 2', state: 'doing' },
          { taskid: 3, title: 'Task 3', developerName: 'Mazin Sayed', description: 'Description 2', state: 'doing' },
          { taskid: 4, title: 'Task 4', developerName: 'Hazem Mahmoud', description: 'Description 2', state: 'todo' },          
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

  const handleTaskClick = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const filteredTasks = tasks.filter(task => {
    const searchLowerCase = searchQuery.toLowerCase();
    if (!isNaN(Number(searchLowerCase[0]))) {
      // If the first character is a number, consider it as a task ID
      return task.taskid.toString().includes(searchLowerCase);
    } else {
      // Else developer name
      return task.developerName.toLowerCase().includes(searchLowerCase);
    }
  });
  
  return (
    <div className="dashboard-container" style={{ backgroundColor: '#212529', color: '#000' }}>  
      <Container>
        <Row>
          <Col>
            <h2>Project {projectId}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <input
              type="text"
              placeholder="Search tasks"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </Col>
        </Row>
        <Row> 
          <Col>
            <h3>To Do</h3>
            {filteredTasks
              .filter(task => task.state === 'todo')
              .map(task => (
                <TaskCards key={task.taskid} task={task} onClick={handleTaskClick} />
              ))}
          </Col>
          <Col>
            <h3>Doing</h3>
            {filteredTasks
              .filter(task => task.state === 'doing')
              .map(task => (
                <TaskCards key={task.taskid} task={task} onClick={handleTaskClick} />
              ))}
          </Col>
          <Col>
            <h3>Done</h3>
            {filteredTasks
              .filter(task => task.state === 'done')
              .map(task => (
                <TaskCards key={task.taskid} task={task} onClick={handleTaskClick} />
              ))}
          </Col>
        </Row>
      </Container>
      {selectedTaskId && <TaskView taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />}

      <div className="add-project-container" style={{  }}>
                <button className="add-project-button" onClick={() => setShowAddTaskForm(true)}>New</button>
                {showAddTaskForm && (
                    <div className="floating-form-overlay">
                        <div className="floating-form">
                            <TaskCreationForm onCancel={() => setShowAddTaskForm(false)} />
                        </div>
                    </div>
                )}
            </div>
    </div>
  );
};

export default ProjectView;
