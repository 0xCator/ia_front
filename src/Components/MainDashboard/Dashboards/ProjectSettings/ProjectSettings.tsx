// ProjectSettings.tsx

import { Accordion, AccordionDetails, AccordionSummary, Alert, Dialog, DialogContent, DialogTitle, Divider, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import CircularProgress from '@mui/material/CircularProgress';
import  Grid  from '@mui/material/Grid';
import Box from '@mui/material/Box';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { handleDeveloperPath, projectsPath } from '../../../../Services/constants';
import { getUserData } from '../../../../Services/userData';
import { projectApi } from '../../../../Services/constants';
import axios from 'axios';

interface ProjectSettingsProps {
    projectID: number;
    projectName: string;
    onClose: () => void; // Callback to close the settings
    onDelete: () => void; // Callback to delete the project
    onUpdate: (id: number, newName: string) => void; // Callback to update the project name
}

interface Developer {
    id: number;
    name: string;
    username: string;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ projectID, projectName, onClose, onDelete, onUpdate }) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [newDeveloper, setNewDeveloper] = useState<string>('');
    const [creationError, setCreationError] = useState<string | null>(null);
    const [editing, setEditing] = useState<boolean>(false);
    const [newProjectName, setNewProjectName] = useState<string>(projectName);

    useEffect(() => {
        fetchDevelopers();
    }, [projectID]);

    const fetchDevelopers = async () => {
        try {
            setLoading(true);
            const response = await fetch(projectsPath + `/${projectID}`, {
                headers: {
                'Access-Control-Allow-Origin': '*',
                 Authorization: `Bearer ${getUserData()?.token}`
                }
            });
            const data = await response.json();
            setDevelopers(data.assignedDevelopers);
        } catch (error) {
            console.error('Error fetching developers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDeveloper = async () => {
        if (newDeveloper.trim() === '' || !newDeveloper) {
            return;
        }

        setLoading(true);
        axios
        .post(handleDeveloperPath(projectID, newDeveloper), {}, { headers: { 'Authorization': `Bearer ${getUserData()?.token}` } })
        .then((response) => {
            fetchDevelopers();
            setNewDeveloper('');
        })
        .catch((error) => {
            const message: string = "User" + (error.response.data).slice(9)
            setCreationError(message);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    const handleDeleteDeveloper = async (developerUsername: string) => {
        try {
            setLoading(true);
            const response = await fetch(handleDeveloperPath(projectID, developerUsername), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getUserData()?.token}`,
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Failed to delete developer from the project');
            }
            fetchDevelopers();
            setNewDeveloper('');
        } catch (error) {
            console.error('Error deleting developer:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleEditProject = async () => {
        if (newProjectName.trim() === '' || !newProjectName) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(projectApi+`${projectID}/${newProjectName}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${getUserData()?.token}`,
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to change project name');
            }
            onUpdate(projectID, newProjectName);
            setEditing(false);
        } catch (error) {
            console.error('Error changing name:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleDeleteProject = async () => {
        try {
            setLoading(true);
            const response = await fetch(projectApi+`${projectID}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getUserData()?.token}`,
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                },
            });

            if (!response.ok) {
                throw new Error('Failed to change project name');
            }

            
            onDelete();
            onClose();
        } catch (error) {
            console.error('Error deleting project')
        } finally {
            setLoading(false);
        }
    }
    
    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth='sm'>
            <Grid container xs={12}>
                {!editing ? (
                    <>
                    <Grid item xs={10}> 
                        <DialogTitle>Project Settings</DialogTitle>
                    </Grid>
                    <Grid item xs={2} sx={{padding:1}}>
                    <IconButton onClick={()=>{setEditing(true);}} color="inherit" disabled = {loading}>
                            <EditIcon />
                    </IconButton>

                    <IconButton onClick={handleDeleteProject} color="error" disabled = {loading}>
                            <DeleteIcon />
                    </IconButton>
                    </Grid>
                    </>
                ) : (
                    <>
                    <Grid item xs={10}> 
                        <DialogTitle>Editing</DialogTitle>
                    </Grid>
                    <Grid item xs={2} sx={{padding:1}}>
                    {!loading ? (
                        <>
                        <IconButton onClick={handleEditProject} color="success">
                            <CheckIcon />
                        </IconButton>
                        <IconButton onClick={()=>{setEditing(false); setNewProjectName(projectName);}} color="error">
                                <CloseIcon />
                        </IconButton>
                        </>
                    ) : (
                        <>
                            <IconButton disabled color="primary">
                                <CircularProgress size={24}/>
                            </IconButton>
                            <IconButton disabled onClick={()=>{setEditing(false); setNewProjectName(projectName);}} color="error">
                                <CloseIcon />
                            </IconButton>
                        </>
                    )}
                    </Grid>
                    </>
                )}
            </Grid>
            <DialogContent>
                {
                    !editing ? (
                        <>
                        <Accordion>
                    <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                        <Typography>Developers Assigned</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {loading ? (
                            <Typography>Loading developers...</Typography>
                        ) : (
                            <List>
                                <Divider />
                                {developers.map((developer, index) => (
                                    <React.Fragment key={index}>
                                        <ListItem
                                            secondaryAction={
                                                <IconButton onClick={() => handleDeleteDeveloper(developer.username)} edge="end" color='error' aria-label="delete">
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                        >
                                            <Typography>{developer.name} ({developer.username})</Typography> 
                                        </ListItem>
                                        <Divider />
                                    </React.Fragment>
                                ))}
                            </List>
                        )}
                    </AccordionDetails>
                </Accordion>
                
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="developer"
                        label="Developer Username"
                        name="developer"
                        disabled = {loading}
                        value={newDeveloper}
                        onChange={(e) => setNewDeveloper(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={handleAddDeveloper} disabled = {loading} edge="end" color="primary">
                                        <AddIcon />
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                    {creationError && 
                        <Alert severity="error">{creationError}</Alert>
                    }
                </>
                    ) : (
                        <>
                            <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="newtitle"
                            label="Project Title"
                            name="newtitle"
                            value={newProjectName}
                            onChange={(e) => setNewProjectName(e.target.value)}
                            disabled={loading}
                            />
                        </>
                    )
                }
                
            </DialogContent>
        </Dialog>
    );
};

export default ProjectSettings;
