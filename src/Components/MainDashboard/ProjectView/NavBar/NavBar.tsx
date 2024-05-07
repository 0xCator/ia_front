import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, TextField, styled, Dialog, DialogContent } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import TaskCreationForm from '../TaskCreationForm/TaskCreationForm';
import {Task, Project} from '../ProjectView';
import { Box } from '@mui/material';

interface NavBarProps {
  projectName: string | undefined;
  project: Project | undefined;
  onSearch: (query: string) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const StyledTextField = styled(TextField)({
  backgroundColor: '#f5f5f5',
  borderRadius: '4px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '4px',
    '& fieldset': {
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
});

const NavBar: React.FC<NavBarProps> = ({ projectName, onSearch, project}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchQuery(value);
    onSearch(value); 
  };

  const handleAddTaskClick = () => {
    setOpenAddTaskDialog(true);
  };

  const handleCloseAddTaskDialog = () => {
    setOpenAddTaskDialog(false);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
    <AppBar position="fixed" sx={{padding:1/2}}>
      <Toolbar sx={{justifyContent:"space-between"}}>
        <Typography variant="h6" component="div">
          {projectName}
        </Typography>
        <Box style={{ display: 'flex', alignItems: 'center', width: '50%', minWidth: '300px' }}>
          <IconButton disabled>
            <SearchIcon />
          </IconButton>
          <StyledTextField
            type="text"
            placeholder="Search tasks"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            autoFocus
            variant="outlined"
          />
        </Box>
        <IconButton color="inherit" onClick={handleAddTaskClick}>
          <AddIcon />
        </IconButton>
        <Dialog open={openAddTaskDialog} onClose={handleCloseAddTaskDialog}>
          <DialogContent>
            <TaskCreationForm onCancel={handleCloseAddTaskDialog} developers={project?.developers} projectId={project?.projectId} />
          </DialogContent>
        </Dialog>
      </Toolbar>
    </AppBar>
    </Box>
  );
};

export default NavBar;

