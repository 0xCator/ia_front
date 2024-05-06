import React, { useState, useRef } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import { Button, DialogActions, DialogContent, TextField } from '@mui/material';

interface ProjectCreationFormProps {
    onCancel: () => void; // Function to cancel adding a new project
}

const ProjectCreationForm: React.FC<ProjectCreationFormProps> = ({ onCancel }) => {
    const [newProjectName, setNewProjectName] = useState<string>(''); // State to manage the new project name
    const projectNameRef = useRef<HTMLInputElement>(null); // Ref for input element

    const handleAddProject = () => {
        const projectName = projectNameRef.current?.value;
        if (projectName && projectName.trim() !== '') {
            
            // Call the API endpoint to add the new project
            fetch('/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: projectName })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add project');
                }
                // If successful, reset the input field and close the form
                setNewProjectName('');
                onCancel();
            })
            .catch(error => {
                console.error('Error adding project:', error);
            });
        }
    };

    return (
        <Dialog open={true} onClose={onCancel} fullWidth maxWidth='sm'>
            <DialogTitle>Add New Project</DialogTitle>
            <DialogContent>
                <TextField type="text" required value={newProjectName} onChange={(e) => setNewProjectName(e.target.value)}
                label="Project Name" fullWidth inputRef={projectNameRef} sx={{mt: 2}}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleAddProject}>Add</Button>
            </DialogActions>
        </Dialog>
    );
}

export default ProjectCreationForm;
