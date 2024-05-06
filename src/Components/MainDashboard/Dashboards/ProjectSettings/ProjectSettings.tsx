// ProjectSettings.tsx

import { Accordion, AccordionDetails, AccordionSummary, Alert, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { handleDeveloperPath, projectsPath } from '../../../../Services/constants';
import { getUserData } from '../../../../Services/userData';

interface ProjectSettingsProps {
    projectID: number;
    onClose: () => void; // Callback to close the settings
}

interface Developer {
    id: number;
    name: string;
    username: string;
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ projectID, onClose }) => {
    const [loading, setLoading] = useState<boolean>(true);
    const [developers, setDevelopers] = useState<Developer[]>([]);
    const [newDeveloper, setNewDeveloper] = useState<string>('');
    const [creationError, setCreationError] = useState<string | null>(null);

    useEffect(() => {
        fetchDevelopers();
    }, [projectID]);

    const fetchDevelopers = async () => {
        try {
            const response = await fetch(projectsPath + `/${projectID}`, {
                headers: {
                    Authorization: `Bearer ${getUserData()?.token}`
                }
            });
            const data = await response.json();
            setLoading(false);
            setDevelopers(data.assignedDevelopers);
        } catch (error) {
            console.error('Error fetching developers:', error);
        }
    };

    const handleAddDeveloper = async () => {
        if (newDeveloper.trim() === '' || !newDeveloper) {
            return;
        }

        try {
            setLoading(true);
            const response = await fetch(handleDeveloperPath(projectID, newDeveloper), {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getUserData()?.token}`,
                    'Content-Type': 'application/json'
                },
            });
            if (!response.ok) {
                throw new Error('Failed to add developer to the project');
            }
            fetchDevelopers();
            setNewDeveloper('');
        } catch (error) {
            console.error('Error adding developer:', error);
            setCreationError('Developer not found or already assigned to the project');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteDeveloper = async (developerUsername: string) => {
        try {
            setLoading(true);
            const response = await fetch(handleDeveloperPath(projectID, developerUsername), {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getUserData()?.token}`,
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

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>Project Settings</DialogTitle>
            <DialogContent>
                <Accordion>
                    <AccordionSummary expandIcon={<ArrowDropDownIcon />}>
                        <Typography>Developers Assigned</Typography>
                        
                    </AccordionSummary>
                    <AccordionDetails>
                        {loading ? (
                            <Typography>Loading developers...</Typography>
                        ) : (
                            <List>
                                {developers.map((developer, index) => (
                                    <ListItem key={index}
                                    secondaryAction={
                                        <IconButton onClick={() => handleDeleteDeveloper(developer.username)} edge="end" color='error' aria-label="delete">
                                          <DeleteIcon />
                                        </IconButton>
                                      }>
                                        <Typography>{developer.name} ({developer.username})</Typography>
                                    </ListItem>
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
                    label="Developer Name"
                    name="developer"
                    value={newDeveloper}
                    onChange={(e) => setNewDeveloper(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                            <IconButton onClick={handleAddDeveloper} edge="end" color="primary">
                                <AddIcon />
                            </IconButton>
                            </InputAdornment>
                        ),
                        }}
                />
                {creationError && 
                <Alert severity="error">{creationError}</Alert>
                }
            </DialogContent>
        </Dialog>
    );
};

export default ProjectSettings;
