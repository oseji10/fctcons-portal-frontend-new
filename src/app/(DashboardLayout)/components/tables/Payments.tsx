import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    TextField,
    Modal,
    IconButton,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Pagination,
    LinearProgress,
    Alert,
    Chip,
    Avatar,
    Collapse,
    Paper,
    Grid,
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from "react";
import api from '../../../../lib/api';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

interface Payment {
    id: number;
    applicationId: string;
    userId: number;
    rrr: string;
    amount: string;
    orderId: string;
    status: string;
    response: string | null;
    channel: string;
    paymentDate: string;
    created_at: string | null;
    updated_at: string | null;
    users: {
        id: number;
        firstName: string;
        lastName: string;
        otherNames: string | null;
        email: string;
        phoneNumber: string;
        email_verified_at: string | null;
        role: number;
        applicationType: number;
        jambId: string;
        remember_token: string | null;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
    };
}

interface FilterOptions {
    statuses: { value: string; label: string }[];
    channels: { value: string; label: string }[];
}

const Payments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [currentPayment, setCurrentPayment] = useState<Payment | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [channelFilter, setChannelFilter] = useState<string>("");
    const perPage = 10;

    const filterOptions: FilterOptions = {
        statuses: [
            { value: 'payment_pending', label: 'Payment Pending' },
            { value: 'payment_completed', label: 'Payment Completed' },
            { value: 'payment_failed', label: 'Payment Failed' }
        ],
        channels: [
            { value: 'CARDPAYMENT', label: 'Card Payment' },
            { value: 'BANKTRANSFER', label: 'Bank Transfer' },
            { value: 'USSD', label: 'USSD' }
        ]
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/payments', {
                params: { 
                    page: currentPage, 
                    per_page: perPage,
                    search: searchQuery || undefined,
                    status: statusFilter || undefined,
                    channel: channelFilter || undefined
                }
            });

            if (Array.isArray(response.data)) {
                setPayments(response.data);
                setTotalPages(1);
                setTotalRecords(response.data.length);
            } else {
                setPayments(response.data?.data || []);
                setTotalPages(response.data?.last_page || 1);
                setTotalRecords(response.data?.total || 0);
            }
            setError(null);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to fetch payments');
            console.error('Fetch error:', error);
            setPayments([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, statusFilter, channelFilter]); // Trigger fetch on page or filter change

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handleSearch = () => {
        setCurrentPage(1); // Reset to first page on new search
        fetchData();
    };

    const handleOpenEditModal = (payment: Payment) => {
        setCurrentPayment(payment);
        setOpenModal(true);
    };

    const handleOpenViewModal = (payment: Payment) => {
        setCurrentPayment(payment);
        setViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setViewModalOpen(false);
        setCurrentPayment(null);
        setError(null);
        setIsSubmitting(false);
    };

    const handleSubmit = async () => {
        if (!currentPayment) return;
        
        setIsSubmitting(true);
        try {
            const payload = {
                status: currentPayment.status,
                rrr: currentPayment.rrr,
                amount: currentPayment.amount,
                channel: currentPayment.channel
            };
            
            const response = await api.put(`/payments/${currentPayment.id}`, payload);
            if (response.status >= 200 && response.status < 300) {
                const updatedPayments = payments.map(p => 
                    p.id === currentPayment.id ? response.data : p
                );
                setPayments(updatedPayments);
                setError(null);
                handleCloseModal();
            } else {
                throw new Error(response.data?.message || 'Update failed');
            }
        } catch (error: any) {
            setError(
                error.response?.data?.message || 
                error.message || 
                'Failed to update payment'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRowExpand = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'payment_pending':
                return 'warning';
            case 'payment_completed':
                return 'success';
            case 'payment_failed':
                return 'error';
            default:
                return 'default';
        }
    };

    const formatFullName = (user: any) => {
        return `${user.firstName} ${user.lastName}${user.otherNames ? ' ' + user.otherNames : ''}`;
    };

    return (
        <DashboardCard title="Payments">
            <Box mb={2} display="flex"  alignItems="left">
                <Box mb={2} display="flex" justifyContent="space-between" alignItems="left" gap={2}>
                    <FormControl sx={{ minWidth: 200, flex: 1 }}>
                        <InputLabel>Filter by Status</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Filter by Status"
                        >
                            <MenuItem value="">All Statuses</MenuItem>
                            {filterOptions.statuses.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 200, flex: 1 }}>
                        <InputLabel>Filter by Channel</InputLabel>
                        <Select
                            value={channelFilter}
                            onChange={(e) => setChannelFilter(e.target.value)}
                            label="Filter by Channel"
                        >
                            <MenuItem value="">All Channels</MenuItem>
                            {filterOptions.channels.map(channel => (
                                <MenuItem key={channel.value} value={channel.value}>
                                    {channel.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        sx={{ minWidth: 300, flex: 1 }}
                        fullWidth
                        variant="outlined"
                        placeholder="Search by application ID, RRR or name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            endAdornment: searchQuery && (
                                <IconButton onClick={() => setSearchQuery("")}>
                                    <ClearIcon />
                                </IconButton>
                            ),
                        }}
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleSearch}
                        disabled={isLoading}
                        sx={{ height: '56px' }}
                    >
                        Search
                    </Button>
                </Box>
            </Box>

            {error && (
                <Box mb={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {isLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                        <Table
                            aria-label="Payments table"
                            sx={{
                                whiteSpace: "nowrap",
                                mt: 2
                            }}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell />
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Application ID
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Candidate
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            RRR
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Amount
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Status
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Actions
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {payments.length > 0 ? (
                                    payments.map((payment) => (
                                        <>
                                            <TableRow key={payment.id}>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="expand row"
                                                        size="small"
                                                        onClick={() => handleRowExpand(payment.id)}
                                                    >
                                                        {expandedRow === payment.id ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {payment.applicationId}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {formatFullName(payment.users)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {payment.rrr}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        ₦{payment.amount}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={filterOptions.statuses.find(opt => opt.value === payment.status)?.label || payment.status.replace('_', ' ')} 
                                                        color={getStatusColor(payment.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleOpenViewModal(payment)}>
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton onClick={() => handleOpenEditModal(payment)}>
                                                        <EditIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                                    <Collapse in={expandedRow === payment.id} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Payment Details
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} md={6}>
                                                                    <Paper elevation={0} sx={{ p: 2 }}>
                                                                        <Typography variant="subtitle1" gutterBottom>
                                                                            Personal Information
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Full Name:</strong> {formatFullName(payment.users)}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Email:</strong> {payment.users.email}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Phone:</strong> {payment.users.phoneNumber}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>JAMB ID:</strong> {payment.users.jambId}
                                                                        </Typography>
                                                                    </Paper>
                                                                </Grid>
                                                                <Grid item xs={12} md={6}>
                                                                    <Paper elevation={0} sx={{ p: 2 }}>
                                                                        <Typography variant="subtitle1" gutterBottom>
                                                                            Payment Information
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Application ID:</strong> {payment.applicationId}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>RRR:</strong> {payment.rrr}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Amount:</strong> ₦{payment.amount}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Order ID:</strong> {payment.orderId}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Status:</strong> 
                                                                            <Chip 
                                                                                label={filterOptions.statuses.find(opt => opt.value === payment.status)?.label || payment.status.replace('_', ' ')} 
                                                                                color={getStatusColor(payment.status)}
                                                                                size="small"
                                                                                sx={{ ml: 1 }}
                                                                            />
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Channel:</strong> {filterOptions.channels.find(c => c.value === payment.channel)?.label || payment.channel}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Payment Date:</strong> {formatDate(payment.paymentDate)}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Last Updated:</strong> {formatDate(payment.updated_at)}
                                                                        </Typography>
                                                                    </Paper>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No payments found
                                        </TableCell>
                                    </TableRow>
                                )}
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
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Showing {payments.length} of {totalRecords} payments
                        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                    </Typography>
                </>
            )}

            {/* View Payment Modal */}
            <Modal
                open={viewModalOpen}
                onClose={handleCloseModal}
                aria-labelledby="view-modal-title"
                aria-describedby="view-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 800 },
                    maxWidth: '95%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}>
                    {currentPayment && (
                        <>
                            <Typography id="view-modal-title" variant="h6" component="h2" fontWeight={600} mb={2}>
                                Payment Details
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Personal Information
                                        </Typography>
                                        <Typography>
                                            <strong>Full Name:</strong> {formatFullName(currentPayment.users)}
                                        </Typography>
                                        <Typography>
                                            <strong>Email:</strong> {currentPayment.users.email}
                                        </Typography>
                                        <Typography>
                                            <strong>Phone:</strong> {currentPayment.users.phoneNumber}
                                        </Typography>
                                        <Typography>
                                            <strong>JAMB ID:</strong> {currentPayment.users.jambId}
                                        </Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper elevation={0} sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Payment Information
                                        </Typography>
                                        <Typography>
                                            <strong>Application ID:</strong> {currentPayment.applicationId}
                                        </Typography>
                                        <Typography>
                                            <strong>RRR:</strong> {currentPayment.rrr}
                                        </Typography>
                                        <Typography>
                                            <strong>Amount:</strong> ₦{currentPayment.amount}
                                        </Typography>
                                        <Typography>
                                            <strong>Order ID:</strong> {currentPayment.orderId}
                                        </Typography>
                                        <Typography>
                                            <strong>Status:</strong> 
                                            <Chip 
                                                label={filterOptions.statuses.find(opt => opt.value === currentPayment.status)?.label || currentPayment.status.replace('_', ' ')} 
                                                color={getStatusColor(currentPayment.status)}
                                                size="small"
                                                sx={{ ml: 1 }}
                                            />
                                        </Typography>
                                        <Typography>
                                            <strong>Channel:</strong> {filterOptions.channels.find(c => c.value === currentPayment.channel)?.label || currentPayment.channel}
                                        </Typography>
                                        <Typography>
                                            <strong>Payment Date:</strong> {formatDate(currentPayment.paymentDate)}
                                        </Typography>
                                        <Typography>
                                            <strong>Last Updated:</strong> {formatDate(currentPayment.updated_at)}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                            <Box display="flex" justifyContent="flex-end" mt={2}>
                                <Button 
                                    onClick={handleCloseModal} 
                                    color="primary"
                                    variant="contained"
                                >
                                    Close
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>

            {/* Edit Payment Modal */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="edit-modal-title"
                aria-describedby="edit-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 600 },
                    maxWidth: '95%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}>
                    {currentPayment && (
                        <>
                            <Typography id="edit-modal-title" variant="h6" component="h2" fontWeight={600} mb={2}>
                                Edit Payment
                            </Typography>
                            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="subtitle1">
                                    <strong>Application ID:</strong> {currentPayment.applicationId}
                                </Typography>
                                <Typography variant="subtitle1">
                                    <strong>Candidate:</strong> {formatFullName(currentPayment.users)}
                                </Typography>

                                <TextField
                                    fullWidth
                                    label="RRR"
                                    value={currentPayment.rrr || ''}
                                    onChange={(e) => setCurrentPayment({
                                        ...currentPayment,
                                        rrr: e.target.value
                                    })}
                                />

                                <TextField
                                    fullWidth
                                    label="Amount"
                                    type="number"
                                    value={currentPayment.amount || ''}
                                    onChange={(e) => setCurrentPayment({
                                        ...currentPayment,
                                        amount: e.target.value
                                    })}
                                    InputProps={{
                                        startAdornment: <Typography>₦</Typography>,
                                    }}
                                />

                                <Box display="flex" gap={2}>
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select
                                            value={currentPayment.status}
                                            onChange={(e) => setCurrentPayment({
                                                ...currentPayment,
                                                status: e.target.value
                                            })}
                                            label="Status"
                                        >
                                            {filterOptions.statuses.map(option => (
                                                <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>Channel</InputLabel>
                                        <Select
                                            value={currentPayment.channel}
                                            onChange={(e) => setCurrentPayment({
                                                ...currentPayment,
                                                channel: e.target.value
                                            })}
                                            label="Channel"
                                        >
                                            {filterOptions.channels.map(channel => (
                                                <MenuItem key={channel.value} value={channel.value}>{channel.label}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Box>

                                {error && (
                                    <Alert severity="error" sx={{ mt: 1 }}>
                                        {error}
                                    </Alert>
                                )}

                                <Box display="flex" justifyContent="flex-end" gap={1} sx={{ mt: 2 }}>
                                    <Button 
                                        onClick={handleCloseModal} 
                                        color="secondary"
                                        disabled={isSubmitting}
                                        variant="outlined"
                                    >
                                        Cancel
                                    </Button>
                                    <Button 
                                        onClick={handleSubmit} 
                                        variant="contained" 
                                        color="primary"
                                        disabled={isSubmitting}
                                        startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
                                    >
                                        {isSubmitting ? 'Updating...' : 'Update'}
                                    </Button>
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>
        </DashboardCard>
    );
};

export default Payments;