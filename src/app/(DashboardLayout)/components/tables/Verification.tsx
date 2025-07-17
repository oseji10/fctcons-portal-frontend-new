import {
    Typography, Box,
    Button,
    TextField,
    CircularProgress,
    Alert,
    Avatar,
    Paper,
    Grid,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from "react";
import api from '../../../../lib/api';

interface Candidate {
    id: number;
    applicationId: string;
    jambId: string;
    firstName: string;
    lastName: string;
    otherNames: string | null;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    batch: string;
    passportPhoto: string;
    isPresent: boolean;
    hall: string | null;
    seatNumber: string | null;
}

const Verification = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [candidate, setCandidate] = useState<Candidate | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isMarkingPresent, setIsMarkingPresent] = useState(false);
    const [markPresent, setMarkPresent] = useState(false);

    const handleSearch = async () => {
        if (!searchTerm.trim()) {
            setError("Please enter a JAMB ID or Application ID");
            return;
        }

        setIsLoading(true);
        setError(null);
        setCandidate(null);

        try {
            const response = await api.get(`/candidate/verify/${searchTerm.trim()}`);
            if (response.data) {
                setCandidate(response.data);
                setMarkPresent(response.data.isPresent);
            } else {
                setError("Candidate not found");
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to fetch candidate details');
            console.error('Search error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkPresent = async () => {
        if (!candidate) return;

        setIsMarkingPresent(true);
        try {
            const response = await api.post(`/candidate/mark-present`, {
                applicationId: candidate.applicationId,
                isPresent: markPresent
            });
            
            if (response.data) {
                setCandidate(response.data);
                setMarkPresent(response.data.isPresent);
            }
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to update attendance');
            console.error('Attendance update error:', error);
        } finally {
            setIsMarkingPresent(false);
        }
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const formatFullName = (candidate: Candidate) => {
        return `${candidate.firstName} ${candidate.lastName}${candidate.otherNames ? ' ' + candidate.otherNames : ''}`;
    };

    return (
        <DashboardCard title="Candidate Verification System">
            <Box mb={3}>
                <Typography variant="body1" color="textSecondary" mb={2}>
                    Verify candidates by entering their JAMB ID or Application ID
                </Typography>
                
                <Box display="flex" gap={2} alignItems="center">
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Enter JAMB ID or Application ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        disabled={isLoading}
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleSearch}
                        disabled={isLoading || !searchTerm.trim()}
                        sx={{ height: '56px' }}
                    >
                        {isLoading ? <CircularProgress size={24} /> : 'Search'}
                    </Button>
                </Box>
            </Box>

            {error && (
                <Box mb={2}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            )}

            {candidate && (
                <Card>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3} display="flex" justifyContent="center">
                                <Avatar 
                                    src={candidate.passportPhoto} 
                                    sx={{ 
                                        width: 200, 
                                        height: 200,
                                        border: '1px solid #ddd'
                                    }} 
                                />
                            </Grid>
                            <Grid item xs={12} md={9}>
                                <Typography variant="h5" gutterBottom>
                                    {formatFullName(candidate)}
                                </Typography>
                                
                                <Grid container spacing={2} mt={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography><strong>Application ID:</strong> {candidate.applicationId}</Typography>
                                        <Typography><strong>JAMB ID:</strong> {candidate.jambId}</Typography>
                                        <Typography><strong>Batch:</strong> {candidate.batch}</Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <Typography><strong>Email:</strong> {candidate.email}</Typography>
                                        <Typography><strong>Phone:</strong> {candidate.phoneNumber}</Typography>
                                        <Typography><strong>Date of Birth:</strong> {formatDate(candidate.dateOfBirth)}</Typography>
                                    </Grid>
                                </Grid>

                                <Divider sx={{ my: 3 }} />

                                {candidate.hall && candidate.seatNumber ? (
                                    <Box>
                                        <Typography variant="h6" gutterBottom>
                                            Examination Details
                                        </Typography>
                                        <Typography><strong>Hall:</strong> {candidate.hall}</Typography>
                                        <Typography><strong>Seat Number:</strong> {candidate.seatNumber}</Typography>
                                    </Box>
                                ) : (
                                    <Box>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={markPresent}
                                                    onChange={(e) => setMarkPresent(e.target.checked)}
                                                    disabled={isMarkingPresent}
                                                />
                                            }
                                            label="Mark as Present"
                                        />
                                        <Box mt={2}>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={handleMarkPresent}
                                                disabled={isMarkingPresent}
                                                startIcon={isMarkingPresent ? <CircularProgress size={20} color="inherit" /> : null}
                                            >
                                                {isMarkingPresent ? 'Updating...' : 'Submit Attendance'}
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            )}
        </DashboardCard>
    );
};

export default Verification;