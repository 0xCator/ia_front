// ProjectCard.tsx

import React from 'react';

interface ProjectCardProps {
    projectName: string;
    //rest of data ya nex
    onShowSettings: (projectName: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ projectName, onShowSettings }) => {
    return (
        <div className="project-card">
            <h2>{projectName}</h2>
            <button onClick={() => onShowSettings(projectName)}>Project Settings</button>
        </div>
    );
}

export default ProjectCard;
