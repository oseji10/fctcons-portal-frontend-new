import {
  Typography, Box,
  Table, TableBody, TableCell, TableHead, TableRow,
  Button, TextField, Modal,
  IconButton, CircularProgress,
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  MenuItem, Select, FormControl, InputLabel,
  Pagination, LinearProgress, Alert
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from "react";
import api from '../../../../lib/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const UsersManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState<Role[]>([]);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filterRole, setFilterRole] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const perPage = 10;

//   const roles = ["Admin", "Client", "Staff", "Manager"];

  interface Role {
  roleId: number;
  roleName: string;
}

const fetchRoles = async () => {
  setIsLoading(true);
  try {
    const response = await api.get<Role[]>('/users/admin_roles');
    setRoles(response.data);
    setError(null);
  } catch (err: any) {
    const message = err.response?.data?.message || 'Failed to fetch roles';
    setError(message);
    console.error('Fetch error:', err);
  } finally {
    setIsLoading(false);
  }
};



  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users/admins', {
        params: {
          page: currentPage,
          per_page: perPage,
          role: filterRole || undefined,
          search: searchQuery || undefined
        }
      });
      setUsers(response.data.data);
      setTotalPages(response.data.last_page);
      setTotalRecords(response.data.total);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to fetch users');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchRoles();
  }, [currentPage, filterRole]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
  };

  const handleOpenModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setFirstName(user.firstName);
      setLastName(user.lastName);
      setEmail(user.email);
      setRole(user.role);
    } else {
      setEditingUser(null);
      setFirstName("");
      setLastName("");
      setEmail("");
      setRole("");
    }
    setError(null);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setRole("");
    setEditingUser(null);
    setError(null);
    setIsSubmitting(false);
  };

  const handleSubmit = async () => {
  if (!firstName.trim()) return setError('First name is required');
  if (!lastName.trim()) return setError('Last name is required');
  if (!email.trim()) return setError('Email is required');
  if (!role) return setError('Role is required'); // role is now roleId (number)

  setIsSubmitting(true);
  try {
    const payload = { 
      firstName, 
      lastName, 
      email, 
      roleId: role // send the roleId to backend
    };

    if (editingUser) {
      const response = await api.put(`/users/${editingUser.id}`, payload);
      setUsers(users.map(u => (u.id === editingUser.id ? response.data : u)));
    } else {
      const response = await api.post('/users', payload);
      setUsers([response.data, ...users]);
    }
    handleCloseModal();
  } catch (error: any) {
    setError(error.response?.data?.message || 'Operation failed');
  } finally {
    setIsSubmitting(false);
  }
};


  const handleOpenDeleteDialog = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setUserToDelete(null);
    setError(null);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    setIsSubmitting(true);
    try {
      await api.delete(`/users/${userToDelete.id}/delete`);
      setUsers(users.filter(u => u.id !== userToDelete.id));
      handleCloseDeleteDialog();
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardCard title="Users Management">
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <TextField
          variant="outlined"
          placeholder="Search by name or email..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          InputProps={{
            endAdornment: searchQuery && (
              <IconButton onClick={() => setSearchQuery("")}>
                <ClearIcon />
              </IconButton>
            ),
          }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Role</InputLabel>
          <Select
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  {roles.map(r => (
    <MenuItem key={r.roleId} value={r.roleId}>
      {r.roleName}
    </MenuItem>
  ))}
</Select>

        </FormControl>
        <Button variant="contained" onClick={() => handleOpenModal()} disableElevation>
          Add User
        </Button>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box sx={{ overflow: 'auto' }}>
            <Table aria-label="Users table">
              <TableHead>
                <TableRow>
                  <TableCell><Typography fontWeight={600}>Full Name</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Email</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Role</Typography></TableCell>
                  <TableCell><Typography fontWeight={600}>Actions</Typography></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName} {user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    {/* <TableCell>{user?.user_role?.roleName}</TableCell> */}
                    <TableCell>{user?.user_role?.roleName || user.role}</TableCell>

                    <TableCell>
                      <IconButton onClick={() => handleOpenModal(user)}><EditIcon /></IconButton>
                      <IconButton onClick={() => handleOpenDeleteDialog(user)}><DeleteIcon /></IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
          <Box display="flex" justifyContent="center" mt={3}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              showFirstButton
              showLastButton
            />
          </Box>
          <Typography variant="body2">
            Showing {users.length} of {totalRecords} users
          </Typography>
        </>
      )}

      {/* Add/Edit User Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)', width: { xs: '90%', sm: 500 },
          bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2
        }}>
          <Typography variant="h6" fontWeight={600}>
            {editingUser ? 'Edit User' : 'Add New User'}
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField label="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            <TextField label="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  {roles.map(r => (
    <MenuItem key={r.roleId} value={r.roleId}>
      {r.roleName}
    </MenuItem>
  ))}
</Select>

            </FormControl>
            {error && <Typography color="error">{error}</Typography>}
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button onClick={handleCloseModal} color="secondary">Cancel</Button>
              <Button onClick={handleSubmit} variant="contained" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : ''}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardCard>
  );
};

export default UsersManagement;
