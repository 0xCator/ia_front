// ProjectCard.tsx

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
    onAssign: (projectName: string) => void; // Callback function for assigning project
    onDelete: (projectName: string) => void; // Callback function for deleting project
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectName, state, onShowSettings, onAssign, onDelete }) => {
    const handleAcceptRequest = async () => {
        try {
            // Make POST request to backend API to accept request
            await fetch(`/api/projects/${projectName}/assign`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ projectName })
            });
            // Update projects after assignment
            onAssign(projectName);
        } catch (error) {
            console.error('Error accepting request:', error);
        }
    };

    const handleRejectRequest = async () => {
        try {
            // Make DELETE request to backend API to reject request
            await fetch(`/api/projects/${projectName}`, {
                method: 'DELETE'
            });
            // Update projects after rejection
            onDelete(projectName);
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
                            <Button className="accept" onClick={handleAcceptRequest}>Accept</Button>
                            <Button className="reject" onClick={handleRejectRequest}>Reject</Button>
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

