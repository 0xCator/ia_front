import React, { useRef, useState } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button, Box, SelectChangeEvent, CircularProgress } from '@mui/material';
import { Developer } from '../ProjectView';
import { addTaskApi } from '../../../../Services/constants';

interface TaskCreationFormProps {
    onCancel: () => void; 
    developers: Developer[] | undefined;
    projectId: number | undefined;
    onAddTask: () => void;
}

const TaskCreationForm: React.FC<TaskCreationFormProps> = ({ onCancel, developers, projectId, onAddTask }) => {
    const titleRef = useRef<HTMLInputElement>(null); 
    const developerNameRef = useRef<string>(''); 
    const descriptionRef = useRef<HTMLTextAreaElement>(null); 
    const [currentDev, setCurrentDev] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const createTask = () => { 
        setLoading(true)

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
            setLoading(false); // Set loading to false after completing the task creation
            if (response.ok) {
                onCancel();
                onAddTask();
            }
        }).catch((error) => {
            setLoading(false); // Set loading to false if there's an error during task creation
            console.error('Error:', error);
        });
    }

    const updateDev = (e: SelectChangeEvent) => {
        setCurrentDev(e.target.value as string);
        developerNameRef.current = e.target.value as string;
    }

    return (
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
            <form>
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
                    {loading ? (
                        <CircularProgress size={24} />
                    ) : (
                        <>
                            <Button variant="contained" onClick={createTask} >Add</Button>
                            <Button variant="contained" onClick={onCancel}>Cancel</Button>
                        </>
                    )}
                </Box>
            </form>
        </Box>
    );
}

export default TaskCreationForm;

