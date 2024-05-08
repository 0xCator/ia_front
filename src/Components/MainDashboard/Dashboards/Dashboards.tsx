import React, { useState, useEffect } from 'react';
import ProjectSettings from './ProjectSettings/ProjectSettings';
import ProjectCreationForm from './ProjectCreationForm/ProjectCreationForm';
import ProjectCard from './ProjectCard/ProjectCard';
import { Button, Container, Paper, Box, Grid, Typography, Divider, IconButton } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';
import AddIcon from '@mui/icons-material/Add';
import { acceptRequestPath, projectsPath, rejectRequestPath } from '../../../Services/constants';
import { getUserData } from '../../../Services/userData';

    interface Project {
        id: number;
        name: string;
    }
    // Hide buttons depending on the role
    
    const Dashboard: React.FC = () => {
        const [ledProjects, setLedProjects] = useState<Project[]>([]);
        const [assignedProjects, setAssignedProjects] = useState<Project[]>([]);
        const [requestProjects, setRequestProjects] = useState<Project[]>([]);
        const [showAddProjectForm, setShowAddProjectForm] = useState<boolean>(false);
        const [showProjectSettings, setShowProjectSettings] = useState<boolean>(false);
        const [selectedProject, setSelectedProject] = useState<number>(-1);
        const [loading, setLoading] = useState<boolean>(true);

        useEffect(() => {
            fetchProjects();
        }, []);

        const fetchProjects = async () => {
            setLoading(true);
            try {
                const response = await fetch(projectsPath + '/user/' + getUserData()?.user.nameid, {
                    headers: {
                        Authorization: `Bearer ${getUserData()?.token}`
                    }
                });
                const data = await response.json();
                setLedProjects(data.createdProjects);
                setAssignedProjects(data.assignedProjects);
                setRequestProjects(data.projectRequests);
            } catch (error) {
                console.error('Error fetching projects:', error);
            } finally {
                setLoading(false);
            }
        };

        const handleShowProjectSettings = (projectID: number) => {
            setShowProjectSettings(true);
            setSelectedProject(projectID);
        };

        const handleCloseProjectSettings = () => {
            setShowProjectSettings(false);
            setSelectedProject(-1);
        };

        const handleAddProject = async () => {
            fetchProjects();
        }

        const handleAssignProject = async (projectID: number, projectName: string) => {
            try {
                // Make POST request to backend API to assign project
                await fetch(acceptRequestPath, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${getUserData()?.token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ projectID, UserID: getUserData()?.user.nameid})
                });
                // Update projects after assignment
                const removeRequest = requestProjects.filter(project => project.id !== projectID);
                setRequestProjects(removeRequest);
                const updatedProjects = assignedProjects.slice();
                updatedProjects.push({ id: projectID, name: projectName } as Project);
                setAssignedProjects(updatedProjects);
            } catch (error) {
                console.error('Error assigning project:', error);
            }
        };

        const handleDeleteProject = async (projectID: number) => {
            try {
                // Make DELETE request to backend API to delete project
                await fetch(rejectRequestPath, {
                    headers: {
                        Authorization: `Bearer ${getUserData()?.token}`,
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({ projectID, UserID: getUserData()?.user.nameid})
                });
                // Update projects after deletion
                const updatedProjects = requestProjects.filter(project => project.id !== projectID);
                setRequestProjects(updatedProjects);
            } catch (error) {
                console.error('Error deleting project:', error);
            }
        };

return (
        <>
            <Container sx={{bgcolor:'white', mt:2}}>
                <Box sx={{mb:4}}>
                    <Typography variant="h2" align="center">Projects Dashboard</Typography>
                </Box>
                <Grid xs={12} sm={8} md={5} component={Paper} elevation={6} padding={1}>
                    <Grid container sx={{padding:1}}>
                        <Grid xs={11}>
                            <Typography variant="h5" align="left">Projects</Typography>
                        </Grid>
                        <Grid xs={1} sx={{textAlign: "right"}}>
                            {getUserData()?.user.role !== 'TeamLeader' && (
                                <IconButton color="primary" onClick={() => setShowAddProjectForm(true)}><AddIcon/></IconButton>
                            )}
                        </Grid>
                    </Grid>  
                    <Divider />
                    {loading ? (
                        <Grid container spacing={4} padding={2}>
                            {[1, 2, 3].map((value) => (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Skeleton variant="rounded" height={200} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                    <Grid container spacing={4} padding={2}>
                        {requestProjects.map(project => (
                            <Grid item xs={12} sm={6} md={4}>
                                <ProjectCard 
                                    key={project.id}
                                    projectID={project.id}
                                    projectName={project.name} 
                                    state={2} 
                                    onShowSettings={handleShowProjectSettings}
                                    onAssign={handleAssignProject}
                                    onDelete={handleDeleteProject}
                                />
                            </Grid>
                        ))}
                        {ledProjects.map(project => (
                            <Grid item xs={12} sm={6} md={4}>
                                <ProjectCard 
                                    key={project.id} 
                                    projectID={project.id}
                                    projectName={project.name} 
                                    state={0} 
                                    onShowSettings={handleShowProjectSettings}
                                    onAssign={handleAssignProject}
                                    onDelete={handleDeleteProject}
                                />
                            </Grid>
                        ))}
                        {assignedProjects.map(project => (
                            <Grid item xs={12} sm={6} md={4}>
                                <ProjectCard 
                                    key={project.id} 
                                    projectID={project.id}
                                    projectName={project.name} 
                                    state={1} 
                                    onShowSettings={handleShowProjectSettings}
                                    onAssign={handleAssignProject}
                                    onDelete={handleDeleteProject}
                                />
                            </Grid>    
                        ))}
                    </Grid>)}
                </Grid>
             
            {showAddProjectForm && (<ProjectCreationForm onAddProject={handleAddProject} onCancel={() => setShowAddProjectForm(false)} />)}
            {showProjectSettings && (<ProjectSettings projectID={selectedProject} onClose={handleCloseProjectSettings} />)}
            </Container>
        </>
    );
    };

    export default Dashboard;