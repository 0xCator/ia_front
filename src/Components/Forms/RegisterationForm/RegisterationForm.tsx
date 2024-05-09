import { Alert, Box, CircularProgress, Container, CssBaseline, Grid, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import React, { useState, useRef } from 'react';
import { setUserData } from '../../../Services/userData';
import { registerPath } from '../../../Services/constants';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';

const RegistrationForm: React.FC = () => {
    const [signupError, setSignupError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const userName = useRef<HTMLInputElement>(null);
    const email = useRef<HTMLInputElement>(null);
    const Name = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);
    const [role, setRole] = React.useState(0);
    const navigate = useNavigate();

    const handleChange = (event: SelectChangeEvent) => {
        setRole(event.target.value as unknown as number);
    };

    const signup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Start loading

        const data ={
            UserName: userName.current?.value,
            Email: email.current?.value,
            Name: Name.current?.value,
            Password: password.current?.value,
            Role: role,
        };

        try {
            const response = await fetch(registerPath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Failed to sign up');
            }

            const responseData = await response;
            
            navigate("/login");
        } catch (error) {
            console.log(error);
            console.error('Signup failed', error);
            setSignupError('Signup failed. Please try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <>
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
                            verticalAlign: 'middle',
                        }}
                    >
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Box component="form" onSubmit={signup} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="name"
                                label="Name"
                                name="name"
                                inputRef={Name}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                type="email"
                                inputRef={email}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                inputRef={userName}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                inputRef={password}
                            />
                            
                            <FormControl fullWidth sx={{mt:2}}>
                                <InputLabel id="role-label">Role</InputLabel>
                                <Select
                                    labelId="role-label"
                                    id="role"
                                    value={role.toString()} // Convert role to string
                                    label="Age"
                                    onChange={handleChange}
                                >
                                    <MenuItem value={0}>Team Leader</MenuItem>
                                    <MenuItem value={1}>Developer</MenuItem>
                                </Select>
                            </FormControl>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={loading} // Disable button when loading
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Sign Up'
                                )}
                            </Button>
                            <Link to="/login">{"Already have an account? Sign In"}</Link>
                            {signupError && 
                                <Alert severity="error">{signupError}</Alert>
                            }
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default RegistrationForm;

