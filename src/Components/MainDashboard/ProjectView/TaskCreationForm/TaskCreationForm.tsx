import React, { useRef } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

interface TaskCreationFormProps {
    onCancel: () => void; // Function to cancel adding a new task
}

const developers = ["Ahmad Abo-Tahoun", "Ahmad Nader", "Mazin Sayed", "Hazem Mahmoud"];
const TaskCreationForm: React.FC<TaskCreationFormProps> = ({ onCancel }) => {
    const taskNameRef = useRef<HTMLInputElement>(null); // Ref for task name input element
    const titleRef = useRef<HTMLInputElement>(null); // Ref for task name input element
    const developerNameRef = useRef<HTMLInputElement>(null); // Ref for developer name input element
    const descriptionRef = useRef<HTMLTextAreaElement>(null); // Ref for description textarea element
    const [developer, setDeveloper] = React.useState<string>(''); // State for developer name

    const handleCreationForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const taskName = taskNameRef.current?.value;
        const title = titleRef.current?.value;
        const developerName = developerNameRef.current?.value;
        const description = descriptionRef.current?.value;

    };

    return (
        <div className="task-creation-form">
            <form onSubmit={handleCreationForm}>
                <div className="form-group">
                    <label htmlFor="taskName">Task Name</label>
                    <input
                        type="text"
                        id="taskName"
                        placeholder="Enter task name"
                        ref={taskNameRef} // Assigning ref to task name 
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="title">Title</label>
                    <input
                        type="text"
                        id="Title"
                        placeholder="Enter Title"
                        ref={titleRef} // Assigning ref to title
                    />
                </div>
                <div className="form-group">
                 <FormControl fullWidth>
                        <InputLabel id="developer-label">Developer</InputLabel>
                        <Select
                            labelId="developer-label"
                            id="developer"
                            value={developer}
                            onChange={(e) => setDeveloper(e.target.value as string)}
                            label="Developer"
                        >
                        {developers.map((dev, index) => (
                                <MenuItem key={index} value={dev}>{dev}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        placeholder="Enter description"
                        ref={descriptionRef} // Assigning ref to description  
                    ></textarea>
                </div>
                <div className="buttons-container">
                    {/* Call handleCreationForm when Add button is clicked */}
                    <button type="submit">Add</button>
                    {/* Call onCancel function when Cancel button is clicked */}
                    <button onClick={onCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
}

export default TaskCreationForm;
