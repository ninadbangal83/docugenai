import React, { useEffect, useState } from 'react';
import api from '../services/api';

import {
  Typography,
  Paper,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import ConfirmDialog from '../components/ConfirmDialog';
import Notification from '../components/Notification';
import { deleteUserById } from '@services/authService';

interface AdminUser {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
}

interface AdminDashboardProps {
  user: AdminUser;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ user }) => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const showNotification = (message: string, severity: 'success' | 'error' = 'success') => {
    setNotification({ open: true, message, severity });
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) {
      showNotification('Failed to fetch users', 'error');
    }
  };

const handleDelete = async () => {
  if (!selectedUserId) return;
  try {
    await deleteUserById(selectedUserId); // ✅ use service
    setUsers((prev) => prev.filter((u) => u._id !== selectedUserId));
    showNotification('User deleted successfully');
  } catch (err) {
    showNotification('Failed to delete user', 'error');
  } finally {
    setConfirmOpen(false);
    setSelectedUserId(null);
  }
};

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <>
      <Paper sx={{ p: 3, mt: 4, mx: 'auto', maxWidth: 1000 }}>
        <Typography variant="h5" gutterBottom>
          Admin Dashboard – User Management
        </Typography>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.isAdmin ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedUserId(u._id);
                        setConfirmOpen(true);
                      }}
                      color="error"
                      disabled={u.isAdmin || u._id === user._id}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ConfirmDialog
        open={confirmOpen}
        content="Are you sure you want to delete this user?"
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />

      <Notification
        open={notification.open}
        message={notification.message}
        severity={notification.severity}
        onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
      />
    </>
  );
};

export default AdminDashboard;
