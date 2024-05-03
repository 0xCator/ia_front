import React, { useRef } from 'react';
import './TaskCreationForm.css'; // Import CSS file

interface TaskCreationFormProps {
    onCancel: () => void; // Function to cancel adding a new task
}

const TaskCreationForm: React.FC<TaskCreationFormProps> = ({ onCancel }) => {
    const taskNameRef = useRef<HTMLInputElement>(null); // Ref for task name input element
    const titleRef = useRef<HTMLInputElement>(null); // Ref for task name input element
    const developerNameRef = useRef<HTMLInputElement>(null); // Ref for developer name input element
    const descriptionRef = useRef<HTMLTextAreaElement>(null); // Ref for description textarea element

    const handleCreationForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const taskName = taskNameRef.current?.value;
        const title = titleRef.current?.value;
        const developerName = developerNameRef.current?.value;
        const description = descriptionRef.current?.value;
        if (taskName && taskName.trim() !== '' && developerName && developerName.trim() !== '' && description && description.trim() !== '') {
            //close the form -> to be removed just checking
            onCancel();
            // Call the API endpoint to add the new task
            fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    name: taskName,
                    title: title,
                    developer: developerName,
                    description: description
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add task');
                }
                // Resetting input field value using ref
                taskNameRef.current!.value = ''; 
                developerNameRef.current!.value = '';
                descriptionRef.current!.value = '';
                //close the form
                onCancel();
            })
            .catch(error => {
                console.error('Error adding task:', error);
            });
        }
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
                    <label htmlFor="developerName">Developer Name</label>
                    <input
                        type="text"
                        id="developerName"
                        placeholder="Enter developer name"
                        ref={developerNameRef} // Assigning ref to developer name  
                    />
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
