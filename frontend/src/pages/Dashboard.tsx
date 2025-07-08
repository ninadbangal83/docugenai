import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import { CircularProgress, Box } from '@mui/material';
import { useLocation } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { state } = useLocation();
  const reduxUser = useSelector((state: RootState) => state.auth.user);
  const reduxToken = useSelector((state: RootState) => state.auth.token);

  const user = state?.user || reduxUser;
  const token = state?.token || reduxToken;

  console.log(user, token)
  if (!user || !token) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return user.isAdmin ? <AdminDashboard user={user} /> : <UserDashboard user={user} />;
};

export default Dashboard;
