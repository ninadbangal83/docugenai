import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { logout, login } from '../store/slices/authSlice';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Link,
  Avatar,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import axios from '../services/api';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getInitials = (name: string | null) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const handleSubmit = async () => {
    if (password && password !== confirmPassword) {
      setPasswordError('Passwords do not match');
      return;
    }

    const updates: Record<string, string> = { name, email };
    if (password) updates.password = password;

    try {
      const res = await axios.patch('/user/me', updates);
      dispatch(login({ user: res.data.user, token: res.data.token }));
      setOpen(false);
      setPassword('');
      setConfirmPassword('');
      setPasswordError('');
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  return (
    <>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <DescriptionIcon fontSize="large" />
            <Link
              component={RouterLink}
              to="/"
              color="inherit"
              underline="none"
              sx={{ fontSize: 20, fontWeight: 'bold' }}
            >
              DocuGenAI
            </Link>
          </Box>

          {isAuthenticated && (
            <Box display="flex" alignItems="center" gap={2}>
              <Tooltip title="Update Profile">
                <IconButton onClick={() => setOpen(true)}>
                  <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                    {getInitials(user?.name ?? '')}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Typography variant="body2" color="inherit" sx={{ fontWeight: 500 }}>
                Welcome, {user?.name}
              </Typography>
              <Button
                color="inherit"
                onClick={handleLogout}
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: 'white',
                  '&:hover': { borderColor: 'white' },
                }}
              >
                Logout
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* 🔹 Update User Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={name}
            margin="normal"
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            fullWidth
            label="Email"
            value={email}
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={password}
            margin="normal"
            onChange={(e) => {
              setPassword(e.target.value);
              if (passwordError) setPasswordError('');
            }}
          />
          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            margin="normal"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (passwordError) setPasswordError('');
            }}
            error={!!passwordError}
            helperText={passwordError}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
