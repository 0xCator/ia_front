import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import './ProjectCard.css'

interface ProjectCardProps {
    projectName: string;
    state: number; // Add state property
    onShowSettings: (projectName: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectName, state, onShowSettings }) => {
    const handleAcceptRequest = async (projectName: string) => {
        try {
            // Make POST request to backend API to accept request
            const response = await fetch(`/api/projects/${projectName}/accept`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to accept request');
            }
            // Handle success as needed (e.g., update UI)
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleRejectRequest = async (projectName: string) => {
        try {
            // Make POST request to backend API to reject request
            const response = await fetch(`/api/projects/${projectName}/reject`, {
                method: 'POST'
            });
            if (!response.ok) {
                throw new Error('Failed to reject request');
            }
            // Handle success as needed (e.g., update UI)
        } catch (error) {
            console.error('Error rejecting request:', error);
        }
    };

    let cardContent = null;

    switch (state) {
        case 0:
            cardContent = (
                <OverlayTrigger
                    placement="right"
                    delay={{ show: 250, hide: 400 }}
                    overlay={<Tooltip id="button-tooltip">Tab to display Project Settings</Tooltip>}
                >
                    <Card className="project-card red" onClick={() => onShowSettings(projectName)}>
                        <Card.Body>
                            <Card.Title>{projectName}</Card.Title>
                        </Card.Body>
                    </Card>
                </OverlayTrigger>
            );
            break;
        case 1:
            cardContent = (
                <Card className="project-card green">
                    <Card.Body>
                        <Card.Title>{projectName}</Card.Title>
                    </Card.Body>
                </Card>
            );
            break;
        case 2:
            cardContent = (
                <Card className="project-card blue">
                    <Card.Body>
                        <Card.Title>{projectName}</Card.Title>
                        <div className="project-card-buttons">
                            <Button className = "accept" onClick={() => handleAcceptRequest(projectName)}>Accept</Button>
                            <Button className = "reject" onClick={() => handleRejectRequest(projectName)}>Reject</Button>
                        </div>
                    </Card.Body>
                </Card>
            );
            break;
        default:
            cardContent = null;
            break;
    }

    return cardContent;
}

export default ProjectCard;