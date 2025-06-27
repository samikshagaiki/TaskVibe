// components/Navbar.js
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';

const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <Typography variant="h6" component="div" sx={{ color: 'white', fontWeight: 'bold' }}>
            TaskVibe
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button component={Link} to="/" sx={{ color: 'white' }}>
              Home
            </Button>
            {user ? (
              <>
                <Typography sx={{ color: 'white' }}>
                  Hi, {user.username}
                </Typography>
                <Button onClick={handleLogout} sx={{ color: 'white' }}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" sx={{ color: 'white' }}>
                  Login
                </Button>
                <Button component={Link} to="/register" sx={{ color: 'white' }}>
                  Register
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
