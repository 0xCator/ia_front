// ProjectSettings.tsx

import React, { useState, useEffect } from 'react';

interface ProjectSettingsProps {
    projectName: string;
    onClose: () => void; // Callback to close the settings
}

const ProjectSettings: React.FC<ProjectSettingsProps> = ({ projectName, onClose }) => {
    const [developers, setDevelopers] = useState<string[]>([]);
    const [newDeveloper, setNewDeveloper] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        fetchDevelopers();
    }, [projectName]);

    const fetchDevelopers = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/projects/${projectName}/developers`);
            const data = await response.json();
            setDevelopers(data);
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
            fetchDevelopers();
            setNewDeveloper('');
        } catch (error) {
            console.error('Error adding developer:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="project-settings-overlay">
            <div className="project-settings-container">
                <h2>Project Settings - {projectName}</h2>
                <button onClick={onClose}>Close</button>
                <div className="developers-card">
                    <h3>Developers Assigned:</h3>
                    {loading ? (
                        <p>Loading developers...</p>
                    ) : (
                        <ul className="developers-list">
                            {developers.map((developer, index) => (
                                <li key={index}>{developer}</li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="add-developer">
                    <input
                        type="text"
                        value={newDeveloper}
                        onChange={(e) => setNewDeveloper(e.target.value)}
                        placeholder="Enter developer name"
                    />
                    <button onClick={handleAddDeveloper}>Add Developer</button>
                </div>
            </div>
        </div>
    );
};

export default ProjectSettings;
