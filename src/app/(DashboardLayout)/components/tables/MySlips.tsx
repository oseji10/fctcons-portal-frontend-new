import {
    Typography, Box,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Chip,
    Avatar,
    Paper,
    Grid,
    LinearProgress,
    Card,
    CardContent,
    CardActions,
    Divider
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from "react";
import api from '../../../../lib/api';
import DownloadIcon from '@mui/icons-material/Download';
import ClearIcon from '@mui/icons-material/Clear';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import PrintIcon from '@mui/icons-material/Print';

interface ExamSlip {
    id: number;
    applicationId: string;
    jambId: string;
    dateOfBirth: string;
    gender: string;
    batch: string;
    status: string;
    created_at: string | null;
    updated_at: string | null;
    users: {
        firstName: string;
        lastName: string;
        otherNames: string | null;
        email: string;
        phoneNumber: string;
    };
}

const MyExamSlips = () => {
    const [examSlips, setExamSlips] = useState<ExamSlip[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const statusOptions = [
        { value: 'pending_payment', label: 'Pending Payment', color: 'warning' },
        { value: 'payment_verified', label: 'Payment Verified', color: 'info' },
        { value: 'admitted', label: 'Admitted', color: 'success' },
        { value: 'rejected', label: 'Rejected', color: 'error' }
    ];

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/my-slips');
            const data = Array.isArray(response.data) ? response.data : [response.data];
            setExamSlips(data);
            setError(null);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to fetch exam slips');
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const formatFullName = (user: any) => {
        return `${user.firstName} ${user.lastName}${user.otherNames ? ' ' + user.otherNames : ''}`;
    };

    const getStatusColor = (status: string) => {
        const foundStatus = statusOptions.find(option => option.value === status);
        return foundStatus ? foundStatus.color : 'default';
    };

    const getStatusLabel = (status: string) => {
        const foundStatus = statusOptions.find(option => option.value === status);
        return foundStatus ? foundStatus.label : status;
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
            
            // Update print count in local state
            setExamSlips(prevSlips => prevSlips.map(slip => 
                slip.applicationId === applicationId 
                    ? { ...slip, slipPrintCount: (parseInt(slip.slipPrintCount) + 1).toString() } 
                    : slip
            ));
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

    const handlePrint = () => {
        window.print();
    };

    return (
        <DashboardCard title="My Exam Slips">
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
                    {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<PrintIcon />}
                            onClick={handlePrint}
                            sx={{ display: { xs: 'none', sm: 'flex' } }}
                        >
                            Print Page
                        </Button>
                    </Box> */}

                    <Grid container spacing={3}>
                        {examSlips && examSlips.length > 0 ? (
                            examSlips.map((slip) => (
                                <Grid item xs={12} key={slip.id}>
                                    <Card 
                                        elevation={3}
                                        sx={{ 
                                            p: 2,
                                            border: '1px solid #e0e0e0',
                                            '@media print': {
                                                border: '2px solid #000',
                                                boxShadow: 'none',
                                                pageBreakInside: 'avoid'
                                            }
                                        }}
                                    >
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                                <Box>
                                                    <Typography variant="h6" gutterBottom>
                                                        Examination Slip
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        Application ID: {slip.applicationId}
                                                    </Typography>
                                                </Box>
                                                <Chip 
                                                    label={getStatusLabel(slip.status)}
                                                    color={getStatusColor(slip.status) as any}
                                                    size="small"
                                                />
                                            </Box>

                                            <Divider sx={{ my: 2 }} />

                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Candidate Information
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <strong>Name:</strong> {formatFullName(slip.users)}
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <strong>JAMB ID:</strong> {slip.jambId}
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <strong>Date of Birth:</strong> {formatDate(slip.dateOfBirth)}
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <strong>Gender:</strong> {slip.gender}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12} sm={6}>
                                                    <Typography variant="subtitle2" gutterBottom>
                                                        Contact Information
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <strong>Email:</strong> {slip.users.email}
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <strong>Phone:</strong> {slip.users.phoneNumber}
                                                    </Typography>
                                                    <Typography variant="body1" gutterBottom>
                                                        <strong>Batch:</strong> {slip.batch}
                                                    </Typography>
                                                </Grid>
                                            </Grid>

                                            <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                                                    Please download and print your exam slip and come along with it to the examination venue. 
                                                    Ensure you arrive at least 30 minutes before your scheduled exam time.
                                                </Typography>
                                            </Box>
                                        </CardContent>

                                        <CardActions sx={{ 
                                            justifyContent: 'flex-end',
                                            '@media print': {
                                                display: 'none'
                                            }
                                        }}>
                                            <Button
                                                variant="contained"
                                                size="medium"
                                                startIcon={<PictureAsPdfIcon />}
                                                onClick={() => downloadExamSlip(slip.applicationId)}
                                                disabled={isDownloading}
                                            >
                                                Download PDF
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12}>
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="h6" color="text.secondary">
                                        No exam slips found
                                    </Typography>
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                    
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
                </>
            )}
        </DashboardCard>
    );
};

export default MyExamSlips;