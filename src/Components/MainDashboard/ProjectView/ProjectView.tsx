import React, { useState, useEffect } from 'react';
import { Alert, Container, Grid, Skeleton } from '@mui/material';
import { DragDropContext } from 'react-beautiful-dnd';
import TaskView from './TaskView/TaskView'; import { useParams } from 'react-router-dom'; import Column from './ProjectColumn/PrjectColumn'; import NavBar from './NavBar/NavBar'; // Import the NavBar component
import { projectTaskApi} from '../../../Services/constants';
import { projectUpdateTaskStateApi } from '../../../Services/constants';
import { projectApi } from '../../../Services/constants';
import { getTaskCommentApi } from '../../../Services/constants';
import { taskGetAttachmentName, projectUpdateTaskApi, projectDeleteTaskApi} from '../../../Services/constants';
import { CheckCircleOutline, AlarmOn, DoneAll } from '@mui/icons-material'; // Import the icons
import { useNavigate } from 'react-router-dom';
import { getUserData, User} from '../../../Services/userData';


const initialState = {
  attachmentUploaded: false,
  showAlert: false,
  loading: true,
};

export interface Developer {
    id: number;
    name: string;
    username: string;
}

export interface Project {
    projectId: number;
    projectName: string;
    developers: Developer[];
    teamLeaderId:number;
}

export interface Comment {
    content?: string;
    author?: string;
    state: 'sent' | 'load' | 'fail' | null;
    color?: string;
}

export interface Task {
  taskid: number;
  title: string;
  developerName: string;
  developerId: number;
  description: string;
  state: 'to-do' | 'doing' | 'done';
  attachment?: string;
  comments: Comment[];
  draggable: boolean;
}

const ProjectView = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [todoTasks, setTodoTasks] = useState<Task[]>([]);
  const [doingTasks, setDoingTasks] = useState<Task[]>([]);
  const [doneTasks, setDoneTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();
  const user: User = getUserData()!.user;
  const [state, setState] = useState(initialState);

 const showAlert = () => {
    setState(prevState => ({
      ...prevState,
      showAlert: true,
    }));

    // Automatically close the alert after 3 seconds
    setTimeout(() => {
      handleCloseAlert();
    }, 3000);
  };

  const handleCloseAlert = () => {
    setState(prevState => ({
      ...prevState,
      showAlert: false,
    }));
  };


    const statusIntToString = (status: number) => {
        switch (status) {
            case 0:
                return 'to-do';
            case 1:
                return 'doing';
            case 2:
                return 'done';
            default:
                return 'to-do';
        }
    }
    const statusStringToInt = (status: string) => {
        switch (status) {
            case 'to-do':
                return 0;
            case 'doing':
                return 1;
            case 'done':
                return 2;
            default:
                return 0;
        }
    }
  const getProjectData = () => {
    // Set loading to true when fetching project data
    setState(prevState => ({
      ...prevState,
      loading: true,
    }));

    fetch(`${projectApi}${projectId}`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userData')}`,
      }
    }).then(response => {
      if(response.status === 404) {
          navigate('/dashboard');
      }

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      const project = {
          projectId: data.id,
          projectName: data.name,
          developers: data.assignedDevelopers,
          teamLeaderId: data.teamLeaderId,
      };
      if(user.nameid != project.teamLeaderId && project.developers.findIndex((dev: Developer) => dev.id == user.nameid) === -1) {
          navigate('/dashboard');
          return;
      }
      setProject(project);

      // Set loading to false after fetching project data
      setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }

  const getTaskData = () => {
    // Set loading to true when fetching task data
    setState(prevState => ({
      ...prevState,
      loading: true,
    }));

    fetch(`${projectTaskApi}${projectId}`,{
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('userData')}`,
      }
    }).then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
    }).then(data => {
      const tasks = data.map((task: any) => {
          return {
              taskid: task.id,
              title: task.name,
              developerName: task.assignedDev.name,
              developerId: task.assignedDev.id,
              description: task.description,
              state: statusIntToString(task.status),
              comments: []
          }
      });
      setTasks(tasks);
      
      tasks.forEach((element: Task) => {
          fetch(`${getTaskCommentApi}${element.taskid}`,{
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('userData')} `,
              }
          }).then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          }).then(data => {
              const comments = data.map((comment: any) => {
                  return {
                      content: comment.content,
                      author: comment.commenterInfo.name,
                      state: 'sent',
                  }
              });
              element.comments = comments;
          }).catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
          });

          fetch(`${taskGetAttachmentName}${element.taskid}/attachmentname`,{
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('userData')}`,
              }
          }).then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.text();
          }).then(data => {
              element.attachment = data;
          }).catch(error => {
              console.error('There has been a problem with your fetch operation:', error);
          });
      });

      for (let i = 0; i < tasks.length; i++) {
          tasks[i].draggable = Number(tasks[i].developerId) === Number(user.nameid);
      }
          
      updateTasks(tasks);
      
      // Set loading to false after fetching task data
      setState(prevState => ({
        ...prevState,
        loading: false,
      }));
    }).catch(error => {
      console.error('There has been a problem with your fetch operation:', error);
    });
  }

  useEffect(() => {
    getProjectData();
    getTaskData();
  }, []);

    const updateTasks = (tasks: Task[]) => {

        const customSort = (a: Task, b: Task) => {
            if(Number(a.developerId) === Number(user.nameid)) return -1;
            if(Number(b.developerId) === Number(user.nameid)) return 1;
            return 0;
        }


        setTasks(tasks);
        setTodoTasks(tasks.filter((task: Task) => task.state === 'to-do').sort(customSort));
        setDoingTasks(tasks.filter((task: Task) => task.state === 'doing').sort(customSort));
        setDoneTasks(tasks.filter((task: Task) => task.state === 'done').sort(customSort));
    }
    const onAddTask = () => {
        getTaskData();
        updateTasks(tasks);
    }

    const updateTaskState = (taskId: number, state: string) => { 
        fetch(`${projectUpdateTaskStateApi}${taskId}/status?newStatus=${statusStringToInt(state)}`, { 
            method: 'PATCH', 
            headers: { 
                'Accept': '*/*',
                'Authorization': `Bearer ${localStorage.getItem('userData')}`,
            },
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return;
        }).catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
    }

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
      return tasks.filter(task => (task.developerName.toLowerCase().includes(searchLowerCase) || task.title.toLowerCase().includes(searchLowerCase)));
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
      updateTaskState(t[destination.index].taskid,"to-do");
    } else if (destination.droppableId === 'doing') {
      d.splice(destination.index, 0, tasks.find(task => task.taskid === parseInt(draggableId))!);
      d[destination.index].state = "doing";
      updateTaskState(d[destination.index].taskid,"doing");
    } else if (destination.droppableId === 'done') {
      const task = tasks.find(task => task.taskid === parseInt(draggableId))!;
      if(task && !task.attachment){
        showAlert();
        return;
      }
      dn.splice(destination.index, 0, tasks.find(task => task.taskid === parseInt(draggableId))!);
      dn[destination.index].state = "done";
      updateTaskState(dn[destination.index].taskid,"done");
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

       fetch(`${projectUpdateTaskApi}${task.taskid}`,{
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('userData')}`,
            },
            body: JSON.stringify({
                name: task.title,
                description: task.description,
                projectID: projectId,
                assignedDevID: task.developerId,
            })

           }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return;
        }).catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });

        newTasks[index] = task;

        updateTasks(newTasks);
    };


 const handleTaskDelete = (taskId: number) => {
    const newTasks = tasks.filter(task => task.taskid !== taskId);

     fetch(`${projectDeleteTaskApi}${taskId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('userData')}`,
        }}).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            updateTasks(newTasks);
            return;
        }).catch(error => {
            console.error('There has been a problem with your fetch operation:', error);
        });
 }

  return (
    <> 
      <NavBar onSearch={setSearchQuery} projectName={project?.projectName} tasks={tasks} setTasks={setTasks} project={project!} onAddTask={onAddTask}/>  
      <Container className="container">
        <Grid container spacing={2} sx={{mt:8}}>
          <Grid item xs={12}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Column title="To Do" icon={<AlarmOn />} onClick={handleTaskClick} tasks={filteredTasks(todoTasks)} loading={state.loading} />
                </Grid>
                <Grid item xs={4}>
                  <Column title="Doing" icon={<CheckCircleOutline />} onClick={handleTaskClick} tasks={filteredTasks(doingTasks)} loading={state.loading} />
                </Grid>
                <Grid item xs={4}>
                  <Column title="Done" icon={<DoneAll />} onClick={handleTaskClick} tasks={filteredTasks(doneTasks)} loading={state.loading} />
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
          developers={project?.developers}
          onDeleteTask={handleTaskDelete}
        />
      )}
      {state.showAlert && (
       <Alert 
        severity="error" 
        onClose={handleCloseAlert} 
        sx={{ position: 'fixed', bottom: 20, right: 20 }}
      >
        Please upload an attachment before marking the task as "done".
      </Alert>
      )}
    </>
  );
};


export default ProjectView;

