import {
    Typography,
    Box,
    Button,
    CircularProgress,
    Alert,
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
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

interface Admission {
    studentName: string;
    programmeName: string;
    sessionName: string;
    admissionStatus: string | null;
    admissionDate: string | null;
    message: string;
    applicationId: string;
}

const MyAdmission = () => {
    const [admission, setAdmission] = useState<Admission | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);

    const fetchAdmissionStatus = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admission-status');
            if (response.data.message === 'Admissions have not been released at this time. Please check back later.') {
                setError(response.data.message);
                setAdmission(null);
            } else {
                setAdmission({ ...response.data, applicationId: response.data.applicationId || '' });
                setError(null);
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to fetch admission status';
            setError(errorMessage);
            setAdmission(null);
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAdmissionStatus();
    }, []);

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const downloadAdmissionLetter = async (applicationId: string) => {
        setIsDownloading(true);
        setDownloadProgress(0);
        
        try {
            const response = await api.get(`/admission-letter/${applicationId}`, {
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
            link.setAttribute('download', `AdmissionLetter-${applicationId}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            setError(
                error.response?.data?.message || 
                error.message || 
                'Failed to download admission letter'
            );
        } finally {
            setIsDownloading(false);
            setDownloadProgress(0);
        }
    };

    return (
        <DashboardCard >
            {error && (
                <Alert severity={error === 'Admissions have not been released at this time. Please check back later.' ? 'info' : 'error'} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {isLoading ? (
                <Box display="flex" justifyContent="center" my={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {admission && admission.message === 'Admission record found' ? (
                        <Grid item xs={12}>
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
                                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                                        <Typography variant="h4" color="success.main" gutterBottom>
                                            Congratulations!
                                        </Typography>
                                        <Typography variant="h6" color="text.secondary">
                                            You have been offered admission!
                                        </Typography>
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Admission Information
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Name:</strong> {admission.studentName}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Programme:</strong> {admission.programmeName}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Session:</strong> {admission.sessionName}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <Typography variant="subtitle2" gutterBottom>
                                                Additional Details
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Admission Status:</strong> {admission.admissionStatus || 'Admitted'}
                                            </Typography>
                                            <Typography variant="body1" gutterBottom>
                                                <strong>Admission Date:</strong> {formatDate(admission.admissionDate)}
                                            </Typography>
                                        </Grid>
                                    </Grid>

                                    <Box sx={{ mt: 3, p: 2, bgcolor: '#e8f5e9', borderRadius: 1 }}>
                                        <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                                            Congratulations on your admission! Please download your admission letter below and follow the instructions provided.
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
                                        onClick={() => downloadAdmissionLetter(admission.applicationId)}
                                        disabled={isDownloading || !admission.applicationId}
                                    >
                                        Download Admission Letter
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ) : (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h4" color={error === 'Admissions have not been released at this time. Please check back later.' ? 'text.primary' : 'error.main'} gutterBottom>
                                    Admission Status
                                </Typography>
                                <Typography variant="h6" color="text.secondary">
                                    {error === 'Admissions have not been released at this time. Please check back later.'
                                        ? 'Admissions have not been released yet.'
                                        : error === 'Payment not made'
                                        ? 'No admission status available. Please complete your payment to proceed.'
                                        : 'We regret to inform you that you have not been offered admission at this time.'}
                                </Typography>
                                <Typography variant="body1" sx={{ mt: 2 }}>
                                    {error === 'Admissions have not been released at this time. Please check back later.'
                                        ? 'Please check back later for updates on your admission status.'
                                        : error === 'Payment not made'
                                        ? 'Once payment is completed, you can check your admission status again.'
                                        : 'Thank you for your application. We encourage you to keep pursuing your academic goals and consider reapplying in the future.'}
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                    
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
                </Grid>
            )}
        </DashboardCard>
    );
};

export default MyAdmission;