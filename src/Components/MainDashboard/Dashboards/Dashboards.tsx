import React, { useState, useEffect } from 'react';
import ProjectSettings from './ProjectSettings/ProjectSettings';
import ProjectCreationForm from './ProjectCreationForm/ProjectCreationForm';
import ProjectCard from './ProjectCard/ProjectCard';
import './Dashboards.css';
import { Container, Row, Col } from 'react-bootstrap';

interface Project {
    id: number;
    name: string;
    state: number;
}

const Dashboard: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showAddProjectForm, setShowAddProjectForm] = useState<boolean>(false);
    const [showProjectSettings, setShowProjectSettings] = useState<boolean>(false);
    const [selectedProject, setSelectedProject] = useState<string>('');

    useEffect(() => {
        const fetchProjects = async () => {
            const fakeProjects: Project[] = [
                { id: 1, name: 'Abdo\'s 0 Projects', state: 0 },
                { id: 2, name: 'Abdo\'s 1 Projects', state: 1 },
                { id: 3, name: 'Abdo\'s 2 Projects', state: 2 },      
                { id: 1, name: 'Abdo\'s 0 Projects', state: 0 },
                { id: 2, name: 'Abdo\'s 1 Projects', state: 1 },
                { id: 3, name: 'Abdo\'s 2 Projects', state: 2 },         
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

    const teamLeaderProjects = projects.filter(project => project.state === 0);
    const assignedDeveloperProjects = projects.filter(project => project.state === 1);
    const requestProjects = projects.filter(project => project.state === 2);

    return (
        <div className="dashboard-container" style={{ backgroundColor: '#212529', color: '#000' }}>  
            <h1>Project Dashboard</h1>
            <div className="add-project-container" style={{  }}>
                <button className="add-project-button" onClick={() => setShowAddProjectForm(true)}>New</button>
                {showAddProjectForm && (
                    <div className="floating-form-overlay">
                        <div className="floating-form">
                            <ProjectCreationForm onCancel={() => setShowAddProjectForm(false)} />
                        </div>
                    </div>
                )}
            </div>
            <Container fluid>  
                <Row>
                    <Col>
                      <div className="project-cards-container" style={{ backgroundColor: '#343a40', padding: 10, borderRadius: 8 }}> 
                        <h2>Team Leader Projects</h2>
                        <div className="project-cards-wrapper" style={{ display: 'flex', flexWrap: 'wrap' }}> 
                            {teamLeaderProjects.map(project => (
                              <ProjectCard 
                                key={project.id} 
                                projectName={project.name} 
                                state={project.state} 
                                onShowSettings={handleShowProjectSettings} 
                              />
                            ))}
                        </div>
                        <h2>Assigned Developer Projects</h2>
                        <div className="project-cards-wrapper" style={{ display: 'flex', flexWrap: 'wrap' }}> 
                            {assignedDeveloperProjects.map(project => (
                              <ProjectCard 
                                key={project.id} 
                                projectName={project.name} 
                                state={project.state} 
                                onShowSettings={handleShowProjectSettings} 
                              />
                            ))}
                        </div>
                        <h2>Request Projects</h2>
                        <div className="project-cards-wrapper" style={{ display: 'flex', flexWrap: 'wrap' }}> 
                            {requestProjects.map(project => (
                              <ProjectCard 
                                key={project.id} 
                                projectName={project.name} 
                                state={project.state} 
                                onShowSettings={handleShowProjectSettings} 
                              />
                            ))}
                        </div>
                      </div>
                    </Col>
                </Row>
            </Container>
            
            {showProjectSettings && (
                <div className="project-settings-overlay">
                    <ProjectSettings projectName={selectedProject} onClose={handleCloseProjectSettings} />
                </div>
            )}
        </div>
    );
};

export default Dashboard;
