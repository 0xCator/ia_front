import React, { useState, useEffect } from 'react';
import { Container, Grid } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskView from './TaskView/TaskView';
import { useParams } from 'react-router-dom';
import TaskCreationForm from './TaskCreationForm/TaskCreationForm';
import Column from './ProjectColumn/PrjectColumn';
import NavBar from './NavBar/NavBar'; // Import the NavBar component

export interface Task {
  taskid: number;
  title: string;
  developerName: string;
  description: string;
  state: 'to-do' | 'doing' | 'done';
  comments: string[];
}

const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [doingTasks, setDoingTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [showAddTaskForm, setShowAddTaskForm] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const tasks: Task[] = [
      { taskid: 1, title: 'Task 1', developerName: 'Ahmad Abo-Tahoun', description: 'Description 1', state: 'done', comments: ['Comment 1', 'Comment 2'] },
      { taskid: 2, title: 'Task 2', developerName: 'Ahmad Nader', description: 'Description 2', state: 'doing', comments: ['Comment 1'] },
      { taskid: 3, title: 'Task 3', developerName: 'Mazin Sayed', description: 'Description 2', state: 'doing', comments: ['Comment 1'] },
      { taskid: 4, title: 'Task 4', developerName: 'Hazem Mahmoud', description: 'Description 2', state: 'to-do', comments: ['Comment 1'] },
    ];
    setTasks(tasks);
    setDoneTasks(tasks.filter((task: Task) => task.state === 'done'));
    setDoingTasks(tasks.filter((task: Task) => task.state === 'doing'));
    setTodoTasks(tasks.filter((task: Task) => task.state === 'to-do'));
  }, [projectId]);

  const handleTaskClick = (taskId: number) => {
      setSelectedTaskId(taskId);
  };

  const filteredTasks = (tasks: Task[]) => {
    const searchLowerCase = searchQuery.toLowerCase();
    if (searchLowerCase === '') {
      return tasks;
    }
    if (!isNaN(Number(searchLowerCase[0]))) {
      return tasks.filter(task => task.taskid.toString().includes(searchLowerCase));
    } else {
      return tasks.filter(task => task.developerName.toLowerCase().includes(searchLowerCase));
    }
  };

  // Handle drag end
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    const t = Array.from(todoTasks);
    const d = Array.from(doingTasks);
    const dn = Array.from(doneTasks);

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = source.droppableId;
      if (sourceColumn === 'to-do') {
        t.splice(source.index, 1);
      } else if (sourceColumn === 'doing') {
        d.splice(source.index, 1);
      } else if (sourceColumn === 'done') {
        dn.splice(source.index, 1);
      }
    }

    if (source.droppableId === destination.droppableId) {
      if (destination.droppableId === 'to-do') {
        t.splice(source.index, 1);
        t.splice(destination.index, 0, tasks.find(task => task.taskid === parseInt(draggableId))!);
        setTodoTasks(t);
        return;
      } else if (destination.droppableId === 'doing') {
        d.splice(source.index, 1);
        d.splice(destination.index, 0, tasks.find(task => task.taskid === parseInt(draggableId))!);
        setDoingTasks(d);
        return;
      } else if (destination.droppableId === 'done') {
        dn.splice(source.index, 1);
        dn.splice(destination.index, 0, tasks.find(task => task.taskid === parseInt(draggableId))!);
        setDoneTasks(dn);
        return;
      }
    }

    if (destination.droppableId === 'to-do') {
      t.splice(destination.index, 0, tasks.find(task => task.taskid === parseInt(draggableId))!);
      t[destination.index].state = "to-do";
    } else if (destination.droppableId === 'doing') {
      d.splice(destination.index, 0, tasks.find(task => task.taskid === parseInt(draggableId))!);
      d[destination.index].state = "doing";
    } else if (destination.droppableId === 'done') {
      dn.splice(destination.index, 0, tasks.find(task => task.taskid === parseInt(draggableId))!);
      dn[destination.index].state = "done";
    }

    setTodoTasks(t);
    setDoingTasks(d);
    setDoneTasks(dn);
  };

    const handleTaskUpdate = (task: Task) => {
        const index = tasks.findIndex(t => t.taskid === task.taskid);

        if(index === -1) {
            return;
        }

        const newTasks = Array.from(tasks);
        newTasks[index] = task;
        setTasks(newTasks);
    };



  return (
    <div className="dashboard-container">
      <NavBar onSearch={setSearchQuery} projectName={`Project ${projectId}`} tasks={tasks} setTasks={setTasks} />
      <Container className="container">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Column title="To Do" onClick={handleTaskClick} tasks={filteredTasks(todoTasks)} />
                </Grid>
                <Grid item xs={4}>
                  <Column title="Doing" onClick={handleTaskClick} tasks={filteredTasks(doingTasks)} />
                </Grid>
                <Grid item xs={4}>
                  <Column title="Done" onClick={handleTaskClick} tasks={filteredTasks(doneTasks)} />
                </Grid>
              </Grid>
            </DragDropContext>
          </Grid>
        </Grid>
      </Container>
      {selectedTaskId !== null && (
        <TaskView
          task={tasks.find(task => task.taskid === selectedTaskId)!}
          onClose={() => setSelectedTaskId(null)} onUpdateTask={handleTaskUpdate}
        />
      )}
    </div>
  );
};
export default ProjectView;

