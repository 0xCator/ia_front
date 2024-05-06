import React, { useRef } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button, Box } from '@mui/material';
import { Task } from '../ProjectView';

interface TaskCreationFormProps {
    onCancel: () => void; // Function to cancel adding a new task
}

const developers = ["Ahmad Abo-Tahoun", "Ahmad Nader", "Mazin Sayed", "Hazem Mahmoud"];

const TaskCreationForm: React.FC<TaskCreationFormProps> = ({ onCancel, }) => {
    const titleRef = useRef<HTMLInputElement>(null); 
    const developerNameRef = useRef<string>(''); 
    const descriptionRef = useRef<HTMLTextAreaElement>(null); 


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
                        value={developerNameRef.current}
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

