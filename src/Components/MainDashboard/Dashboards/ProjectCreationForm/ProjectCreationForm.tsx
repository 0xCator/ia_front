import React, { useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Alert, Button, DialogActions, DialogContent, TextField } from '@mui/material';
import { getUserData } from '../../../../Services/userData';
import { projectsPath } from '../../../../Services/constants';

interface ProjectCreationFormProps {
    onCancel: () => void; // Function to cancel adding a new project
    onAddProject: () => void; // Callback function to add a new project
}

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({ onCancel, onAddProject }) => {
    const [creationError, setCreationError] = useState<string | null>(null);
    const [newProjectName, setNewProjectName] = useState<string>(''); // State to manage the new project name
    const projectNameRef = useRef<HTMLInputElement>(null); // Ref for input element
    const [loading, setLoading] = useState<boolean>(false);

    const handleAddProject = () => {
        const projectName = projectNameRef.current?.value;
        if (projectName && projectName.trim() !== '') {
            setLoading(true);
            // Call the API endpoint to add the new project
            fetch(projectsPath, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getUserData()?.token}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ name: projectName, teamLeaderID: getUserData()?.user.nameid, RequestedDevelopers: [] })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                // If successful, reset the input field and close the form
                setNewProjectName('');
                onAddProject();
                
                onCancel();
            })
            .catch(error => {
                console.error('Error adding project:', error);
                setCreationError('Failed to add project');
            })
            .finally(() => {
                setLoading(false);
            });
        }
    };

    return (
        <Dialog open={true} onClose={onCancel} fullWidth maxWidth='sm'>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogContent>
                <TextField type="text" required value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
                label="Project Name" fullWidth disabled = {loading} inputRef={projectNameRef} sx={{mt: 2}}/>
                {creationError && 
                <Alert severity="error">{creationError}</Alert>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddProject} disabled = {loading}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProjectCreationForm;
