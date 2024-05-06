// ProjectSettings.tsx

import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Dialog, DialogContent, DialogTitle, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import React, { useState, useEffect } from 'react';
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import DeleteIcon from '@mui/icons-material/Delete';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

interface ProjectSettingsProps {
    projectName: string;
    onClose: () => void; // Callback to close the settings
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ projectName, onClose }) => {
    const [developers, setDevelopers] = useState<string[]>(['Developer 1', 'Developer 2', 'Developer 3']);
    const [newDeveloper, setNewDeveloper] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        //fetchDevelopers();
    }, [projectName]);

    const fetchDevelopers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/projects/${projectName}/developers`);
            const data = await response.json();
            setDevelopers(data.developers);
        } catch (error) {
            console.error('Error fetching developers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddDeveloper = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/projects/${projectName}/developers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ developer: newDeveloper })
            });
            if (!response.ok) {
                throw new Error('Failed to add developer to the project');
            }
            // fetchDevelopers();
            // setNewDeveloper('');
        } catch (error) {
            console.error('Error adding developer:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>Project Settings - {projectName}</DialogTitle>
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
                                        <IconButton edge="end" color='error' aria-label="delete">
                                          <DeleteIcon />
                                        </IconButton>
                                      }>
                                        <Typography>{developer}</Typography>
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
            </DialogContent>
        </Dialog>
    );
};

export default ProjectSettings;
