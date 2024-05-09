import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, TextField, styled, Dialog, DialogContent, Link } from '@mui/material';
import { Search as SearchIcon, Add as AddIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import TaskCreationForm from '../TaskCreationForm/TaskCreationForm';
import { Task, Project } from '../ProjectView';
import { Box } from '@mui/material';
import { getUserData, User } from '../../../../Services/userData';

interface NavBarProps {
  projectName: string | undefined;
  project: Project | undefined;
  onSearch: (query: string) => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  onAddTask: () => void;
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

const NavBar: React.FC<NavBarProps> = ({ projectName, onSearch, project, onAddTask }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openAddTaskDialog, setOpenAddTaskDialog] = useState<boolean>(false);
  const userData: User = getUserData()!.user;

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
      <AppBar position="fixed" sx={{ padding: 1 / 2 }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Link href="/dashboard" color="inherit">
              <IconButton color="inherit">
                <ArrowBackIcon />
              </IconButton>
            </Link>
            <Typography variant="h5" component="div" sx={{ml:2}}>
              {projectName}
            </Typography>
          </Box>
          <Box style={{ display: 'flex', alignItems: 'center', width: '50%', minWidth: '300px' }}>
            <IconButton disabled>
              <SearchIcon style={{ color: '#fff' }} fontSize='large' />
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
          <Box>
            {userData.role === 'TeamLeader' && (
              <>
                <IconButton color="inherit" onClick={handleAddTaskClick}>
                  <AddIcon />
                </IconButton>
                <Dialog open={openAddTaskDialog} onClose={handleCloseAddTaskDialog}>
                  <DialogContent>
                    <TaskCreationForm onCancel={handleCloseAddTaskDialog} developers={project?.developers} onAddTask={onAddTask} projectId={project?.projectId} />
                  </DialogContent>
                </Dialog>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;

