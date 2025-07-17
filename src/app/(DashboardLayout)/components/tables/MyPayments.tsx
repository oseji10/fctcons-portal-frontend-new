import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    IconButton,
    CircularProgress,
    Pagination,
    Alert,
    Chip,
    LinearProgress
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from "react";
import api from '../../../../lib/api';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PaidIcon from '@mui/icons-material/Paid';
import VerifiedIcon from '@mui/icons-material/Verified';

interface Payment {
    id: number;
    applicationId: string;
    rrr: string;
    status: 'payment_pending' | 'payment_completed';
    created_at: string | null;
    updated_at: string | null;
}

const MyPayments = () => {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [isDownloading, setIsDownloading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const perPage = 10;

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/my-payments');
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setPayments(data);
            setTotalPages(1);
            setTotalRecords(data.length);
            setError(null);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to fetch payments');
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [currentPage]);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const downloadExamSlip = async (applicationId: string) => {
        setIsDownloading(true);
        setDownloadProgress(0);
        
        try {
            const response = await api.get(`/application/slip/${applicationId}`, {
                responseType: 'blob',
                onDownloadProgress: (progressEvent) => {
                    if (progressEvent.total) {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setDownloadProgress(percentCompleted);
                    }
                }
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `ExamSlip-${applicationId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            setError(
                error.response?.data?.message || 
                error.message || 
                'Failed to download exam slip'
            );
        } finally {
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    const handlePayOnline = (rrr: string) => {
        // Open Remita payment page in a new tab
        // window.open(`https://remitademo.net/remita/ecomm/finalize.reg?rrr=${rrr}`, '_blank');
        window.open(`${process.env.NEXT_PUBLIC_API_REMITA_ONLINE}/${rrr}/payment.spa`, '_blank');
    };

   const handleVerifyPayment = async (rrr: string, applicationId: string) => {
    setIsVerifying(true);
    
    try {
        await api.post('/payment/verify', {
            rrr: rrr,
            applicationId: applicationId
        });
        // Refresh payments data after verification
        await fetchData();
    } catch (error: any) {
        setError(
            error.response?.data?.message || 
            error.message || 
            'Failed to verify payment'
        );
    } finally {
        setIsVerifying(false);
    }
};

    return (
        <DashboardCard title="My Payments">
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
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
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Application ID
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Remita RRR
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Payment Status
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
                                {payments && payments.length > 0 ? (
                                    payments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>
                                                <Typography>
                                                    {payment.applicationId}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography>
                                                    {payment.rrr || 'N/A'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={payment.status === 'payment_pending' ? 'Pending' : 'Completed'}
                                                    color={payment.status === 'payment_pending' ? 'warning' : 'success'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            
<TableCell>
    {payment.status === 'payment_pending' ? (
        <>
            <Button
                variant="contained"
                size="small"
                startIcon={<PaidIcon />}
                onClick={() => handlePayOnline(payment.rrr)}
                sx={{ mr: 1 }}
            >
                Pay Online
            </Button>
            <Button
                variant="outlined"
                size="small"
                startIcon={<VerifiedIcon />}
                onClick={() => handleVerifyPayment(payment.rrr, payment.applicationId)}
                disabled={isVerifying}
            >
                Verify Payment
            </Button>
        </>
    ) : (
        <Button
            variant="contained"
            size="small"
            startIcon={<PictureAsPdfIcon />}
            onClick={() => downloadExamSlip(payment.applicationId)}
            disabled={isDownloading}
        >
            Download Exam Slip
        </Button>
    )}
</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} align="center">
                                            No payments found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </Box>
                    
                    {isDownloading && (
                        <Box sx={{ width: '100%', mt: 2 }}>
                            <LinearProgress 
                                variant={downloadProgress > 0 ? "determinate" : "indeterminate"}
                                value={downloadProgress}
                            />
                            <Typography variant="caption" color="text.secondary">
                                {downloadProgress > 0 ? `${downloadProgress}% downloaded` : 'Preparing download...'}
                            </Typography>
                        </Box>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                        <Typography variant="body2">
                            Showing {payments.length} of {totalRecords} payments
                        </Typography>
                        <Pagination
                            count={totalPages}
                            page={currentPage}
                            onChange={handlePageChange}
                            color="primary"
                            showFirstButton
                            showLastButton
                        />
                    </Box>
                </>
            )}
        </DashboardCard>
    );
};

export default MyPayments;