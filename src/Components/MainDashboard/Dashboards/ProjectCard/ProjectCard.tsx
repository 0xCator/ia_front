// ProjectCard.tsx

import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { CardActionArea, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

interface ProjectCardProps {
    projectName: string;
    state: number; // Add state property
    onShowSettings: (projectName: string) => void;
    onAssign: (projectName: string) => void; // Callback function for assigning project
    onDelete: (projectName: string) => void; // Callback function for deleting project
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectName, state, onShowSettings, onAssign, onDelete }) => {
    const navigate = useNavigate();
    
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
                    <Card variant='outlined' sx={{ borderColor: 'blue', minWidth: 215, maxWidth: 215, minHeight: 113, maxHeight: 113 }}>
                        <CardActionArea onClick={() => navigate(`/project/1`)}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {projectName}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions sx={{justifyContent: "right"}}>
                            <IconButton size="small" color="primary" onClick={() => onShowSettings(projectName)}><ManageAccountsIcon/></IconButton>
                        </CardActions>
                    </Card>
            );
            break;
        case 1:
            cardContent = (
                <Card variant='outlined' sx={{ borderColor: 'green', minWidth: 215, maxWidth: 215, minHeight: 113, maxHeight: 113 }}>
                    <CardActionArea onClick={() => navigate(`/project/1`)}>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                {projectName}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions sx={{justifyContent: "right"}}>
                        <IconButton size="small" disabled><PersonIcon/></IconButton>
                    </CardActions>
                </Card>
            );
            break;
        case 2:
            cardContent = (
                <Card variant='outlined' sx={{ minWidth: 215, maxWidth: 215, minHeight: 113, maxHeight: 113 }}>
                    <CardContent>
                        <Typography variant="h5" component="div">
                            {projectName}
                        </Typography>
                    </CardContent>
                    <CardActions sx={{justifyContent: "right"}}>
                        <IconButton size="small" color="success" onClick={handleAcceptRequest}><CheckIcon/></IconButton>
                        <IconButton size="small" color="error" onClick={handleRejectRequest}><CloseIcon/></IconButton>
                    </CardActions>
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

