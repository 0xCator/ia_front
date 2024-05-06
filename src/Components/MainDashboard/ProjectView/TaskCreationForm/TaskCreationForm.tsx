import React, { useRef } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button, Box, SelectChangeEvent } from '@mui/material';
import { Task } from '../ProjectView';
import { Developer } from '../ProjectView';
import { addTaskApi } from '../../../../Services/constants';

interface TaskCreationFormProps {
    onCancel: () => void; 
    developers: Developer[] | undefined;
    projectId: number | undefined;
}


const TaskCreationForm: React.FC<TaskCreationFormProps> = ({ onCancel, developers, projectId}) => {
    const titleRef = useRef<HTMLInputElement>(null); 
    const developerNameRef = useRef<string>(''); 
    const descriptionRef = useRef<HTMLTextAreaElement>(null); 
    const [currentDev, setCurrentDev] = React.useState<string>('');

    const createTask = () => { 
            fetch(addTaskApi, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('userData')}`,
                },
                body: JSON.stringify({
                    name: titleRef.current?.value,
                    description: descriptionRef.current?.value,
                    assigneddevid: developerNameRef.current,
                    projectid: projectId
                })
            }).then((response) => {
                if (response.ok) {
                    onCancel();
                }
            }).catch((error) => {
                console.error('Error:', error);
            });

        }

    const updateDev = (e: SelectChangeEvent) => {
        setCurrentDev(e.target.value as string);
        developerNameRef.current = e.target.value as string;
    }

    return (
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
            <form >
                <TextField
                    fullWidth
                    label="Title"
                    placeholder="Enter title"
                    inputRef={titleRef}
                    variant="outlined"
                    margin="normal"
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel id="developer-label">Developer</InputLabel>
                    <Select
                        labelId="developer-label"
                        id="developer"
                        value={currentDev}
                        onChange={updateDev}
                        label="Developer"
                    >
                        {developers?.map((developer) => (
                            <MenuItem key={developer.id} value={developer.id}>{developer.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <TextField
                    fullWidth
                    label="Description"
                    placeholder="Enter description"
                    multiline
                    rows={4}
                    inputRef={descriptionRef}
                    variant="outlined"
                    margin="normal"
                />
                <Box display="flex" justifyContent="space-between">
                    <Button variant="contained" onClick={createTask} >Add</Button>
                    <Button variant="contained" onClick={onCancel}>Cancel</Button>
                </Box>
            </form>
        </Box>
    );
}

export default TaskCreationForm;

