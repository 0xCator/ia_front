// LandingPage.js

import React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import {useNavigate} from 'react-router-dom'; // Assuming you're using React Router for navigation
import { getUserData } from '../../Services/userData';

const LandingPage = () => {

const navigate = useNavigate();

const handleGetStarted = () => {
    if (getUserData() !== null) {
        console.log('User is already logged in');
        navigate('/dashboard');
    } else {
        navigate('/register');
    }
}

return (
    <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
            item
            xs={false}
            sm={4}
            md={7}
            sx={{
                backgroundImage: 'url(https://source.unsplash.com/random/?todolist,kanban,devops,programming)',
                backgroundRepeat: 'no-repeat',
                backgroundColor: (t) =>
                    t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
            <Box
                sx={{
                    my: 8,
                    mx: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box sx={{mt:12}}>
                    <Typography component="h1" variant="h3" sx={{textAlign:"center"}}>
                        Welcome to Ikanbani!
                    </Typography>
                    <Box sx={{ mt: 1 }} />
                    <Typography component="h1" variant="h5" sx={{mt: 2, textAlign:"center"}}>
                        Your developer-friendly task management tool!
                    </Typography>
                    <Typography component="h1" variant="h6" sx={{textAlign:"center"}}>
                        For developers, by developers
                    </Typography>
                </Box>
                <Box component="form" sx={{alignItems: "center", textAlign:"center", justifyContent:"center"}}>
                    <Grid direction="row" sx={{ mt: 6 }}>
                        <Button disableElevation variant="contained" size="large" onClick={handleGetStarted}>
                            Get Started!
                        </Button>
                    </Grid>
                    <Box  sx={{ mt: 2 }}>
                        <img src="alligatorIcon.png" alt="Alligator Icon" style={{width: '50px'}} />
                    </Box>
                </Box>
            </Box>
        </Grid>
    </Grid>
);
};

export default LandingPage;
