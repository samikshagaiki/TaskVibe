// pages/Login.js
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box, Card, CardContent, Typography, TextField, Button } from '@mui/material';

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      navigate('/tasks');
    } catch (err) {
      setError(err.response?.data.message || 'Login failed');
    }
  };

  return (
    
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', p: 4 }}>
      <Card sx={{ maxWidth: 400, width: '100%' }}>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: 'white' }}>
              Login
            </Typography>
            {error && (
              <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                {error}
              </Typography>
            )}
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              fullWidth
              variant="outlined"
              sx={{ mb: 3 }}
              required
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              color="primary"
            >
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;