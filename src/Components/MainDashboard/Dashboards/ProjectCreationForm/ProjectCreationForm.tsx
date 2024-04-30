import React, { useState, useRef } from 'react';

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
        <div className="project-creation-form">
            <input
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                ref={projectNameRef} // Assigning ref to input element
            />
            <div className="buttons-container">
                {/* Call handleAddProject when Add button is clicked */}
                <button onClick={handleAddProject}>Add</button>
                {/* Call onCancel function when Cancel button is clicked */}
                <button onClick={onCancel}>Cancel</button>
            </div>
        </div>
    );
}

export default ProjectCreationForm;
