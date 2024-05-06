import React, { useRef } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button, Box } from '@mui/material';

interface TaskCreationFormProps {
    onCancel: () => void; // Function to cancel adding a new task
}

const developers = ["Ahmad Abo-Tahoun", "Ahmad Nader", "Mazin Sayed", "Hazem Mahmoud"];

const TaskCreationForm: React.FC<TaskCreationFormProps> = ({ onCancel }) => {
    const taskNameRef = useRef<HTMLInputElement>(null); // Ref for task name input element
    const titleRef = useRef<HTMLInputElement>(null); // Ref for task name input element
    const developerNameRef = useRef<string>(''); // Ref for developer name input element
    const descriptionRef = useRef<HTMLTextAreaElement>(null); // Ref for description textarea element

    const handleCreationForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const taskName = taskNameRef.current?.value;
        const title = titleRef.current?.value;
        const developerName = developerNameRef;
        const description = descriptionRef.current?.value;

        // Here you can perform further actions with the form data, such as submitting it to a server or updating state.
    };

    return (
        <Box sx={{ width: 400, bgcolor: 'background.paper', p: 2 }}>
            <form onSubmit={handleCreationForm}>
                <TextField
                    fullWidth
                    label="Task Name"
                    placeholder="Enter task name"
                    inputRef={taskNameRef}
                    variant="outlined"
                    margin="normal"
                />
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
                        value={developerNameRef}
                        onChange={(e) => developerNameRef.current = e.target.value as string}
                        label="Developer"
                    >
                        {developers.map((dev, index) => (
                            <MenuItem key={index} value={dev}>{dev}</MenuItem>
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
                    <Button variant="contained" type="submit">Add</Button>
                    <Button variant="contained" onClick={onCancel}>Cancel</Button>
                </Box>
            </form>
        </Box>
    );
}

export default TaskCreationForm;

