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
    projectID: number;
    projectName: string;
    state: number; // Add state property
    onShowSettings: (projectID: number) => void;
    onAssign: (projectID: number, projectName: string) => void; // Callback function for assigning project
    onDelete: (projectID: number, projectName: string) => void; // Callback function for deleting project
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectID,projectName, state, onShowSettings, onAssign, onDelete }) => {
    const navigate = useNavigate();
    
    const handleAcceptRequest = async () => {
        onAssign(projectID, projectName);
    };

    const handleRejectRequest = async () => {
        onDelete(projectID, projectName);
    };

    let cardContent = null;

    switch (state) {
        case 0:
            cardContent = (
                    <Card variant='outlined' sx={{ borderColor: 'blue', minWidth: 215, maxWidth: 215, minHeight: 113, maxHeight: 113 }}>
                        <CardActionArea onClick={() => navigate(`/project/${projectID}`)}>
                            <CardContent>
                                <Typography variant="h5" component="div">
                                    {projectName}
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions sx={{justifyContent: "right"}}>
                            <IconButton size="small" color="primary" onClick={() => onShowSettings(projectID)}><ManageAccountsIcon/></IconButton>
                        </CardActions>
                    </Card>
            );
            break;
        case 1:
            cardContent = (
                <Card variant='outlined' sx={{ borderColor: 'green', minWidth: 215, maxWidth: 215, minHeight: 113, maxHeight: 113 }}>
                    <CardActionArea onClick={() => navigate(`/project/${projectID}`)}>
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

