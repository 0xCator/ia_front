import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import { getUserData } from '../../../../Services/userData';
import { removeUserData } from '../../../../Services/userData';


function NavBar() {
        
    const navigate = useNavigate();

    const logout = () => {
        removeUserData();
        navigate("/");
        
    }

        return (
        <Box sx={{ flexGrow:1, mb:12 }}>
        <AppBar position="fixed">
            <Toolbar>
                <Typography variant="h5" fontFamily="fantasy" component="div" sx={{ flexGrow: 1 }}>
                    IKANBANI
                </Typography>
                <Typography variant="h6" fontFamily="sans-serif" component="div" sx={{ flexGrow: 1 }}>
                    Welcome, {getUserData()?.user.unique_name}!
                </Typography>
                <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}></Button>
            </Toolbar>
        </AppBar>
        </Box>
    )
}

export default NavBar