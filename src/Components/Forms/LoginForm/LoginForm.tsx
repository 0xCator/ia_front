import { Alert, Box, CircularProgress, Container, CssBaseline, Grid, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import React, { useState, useRef } from 'react';
import { loginPath } from '../../../Services/constants';
import { setUserData } from '../../../Services/userData';
import { Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const [loginError, setLoginError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Loading state
    const usernameRef = useRef<HTMLInputElement>(null); // Ref for username input element
    const passwordRef = useRef<HTMLInputElement>(null); // Ref for password input element
    const navigate = useNavigate();

    const login = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true); // Start loading

        const username = usernameRef.current?.value || '';
        const password = passwordRef.current?.value || '';
        console.log({ username, password });
        try {
            const response = await fetch(loginPath, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify({ username, password })
            });

            if (!response.ok) {
                throw new Error('Failed to log in');
            }

            const responseData = await response.json();
            setUserData(responseData.token);
            navigate("/dashboard");
        } catch (error) {
            console.error('Login failed', error);
            setLoginError('Login failed. Please try again.');
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
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={login} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                name="username"
                                inputRef={usernameRef}
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
                                inputRef={passwordRef}
                            />
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
                                    'Sign In'
                                )}
                            </Button>
                            <Link to="/register">{"Don't have an account? Sign Up"}</Link>
                            {loginError && 
                                <Alert severity="error">{loginError}</Alert>
                            }
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </>
    );
};

export default LoginForm;

