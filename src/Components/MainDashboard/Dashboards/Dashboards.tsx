// Dashboard.tsx

import React, { useState, useEffect } from 'react';
import ProjectSettings from './ProjectSettings/ProjectSettings';
import ProjectCreationForm from './ProjectCreationForm/ProjectCreationForm';
import ProjectCard from './ProjectCard/ProjectCard';
import './Dashboards.css';

interface Project {
    id: number;
    name: string;
}

const Dashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showAddProjectForm, setShowAddProjectForm] = useState<boolean>(false);
    const [showProjectSettings, setShowProjectSettings] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<string>('');

    useEffect(() => {
        const fetchProjects = async () => {
            const fakeProjects: Project[] = [
                { id: 1, name: 'Project 1' },
                { id: 2, name: 'Project 2' },
                { id: 3, name: 'Project 3' }
            ];
            setProjects(fakeProjects);
            try {
                const response = await fetch('/api/projects');
                const data = await response.json();
                setProjects(data);
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    const handleShowProjectSettings = (projectName: string) => {
        setShowProjectSettings(true);
        setSelectedProject(projectName);
    };

    const handleCloseProjectSettings = () => {
        setShowProjectSettings(false);
        setSelectedProject('');
    };

    return (
        <div className="dashboard-container">
            <h1>Project Dashboard</h1>
            <div className="projects-container">
                {/* Render ProjectCard for each project */}
                {projects.map(project => (
                    <ProjectCard key={project.id} projectName={project.name} onShowSettings={handleShowProjectSettings} />
                ))}
            </div>
            <div className="add-project-container">
                <button className="add-project-button" onClick={() => setShowAddProjectForm(true)}>+</button>
                {/* Render ProjectCreationForm when showAddProjectForm is true */}
                {showAddProjectForm && (
                    <div className="floating-form-overlay">
                        <div className="floating-form">
                            {/* Pass onCancel function to ProjectCreationForm */}
                            <ProjectCreationForm
                                onCancel={() => setShowAddProjectForm(false)}
                            />
                        </div>
                    </div>
                )}
            </div>
            {/* Render ProjectSettings when showProjectSettings is true */}
            {showProjectSettings && (
                <div className="project-settings-overlay">
                    <ProjectSettings projectName={selectedProject} onClose={handleCloseProjectSettings} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
