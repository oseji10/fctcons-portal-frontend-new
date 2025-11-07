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
    FormControl,
    InputLabel,
    Select,
    Pagination,
    Alert,
    Chip,
    Grid,
    Paper,
    Collapse,
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import { useEffect, useState } from "react";
import api from '../../../../lib/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ClearIcon from '@mui/icons-material/Clear';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PrintIcon from '@mui/icons-material/Print';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Admission {
    admissionId: number;
    applicationId: string;
    programmeId: number;
    session: number;
    created_at: string;
    updated_at: string;
    application: {
        id: number;
        applicationId: string;
        jambId: string;
        dateOfBirth: string;
        gender: string | null;
        maritalStatus: string;
        alternatePhoneNumber: string | null;
        licenceId: string | null;
        batch: string;
        applicationType: number;
        userId: number;
        isActive: string;
        slipPrintCount: string;
        admissionPrintCount: string;
        isPresent: string;
        status: string;
        created_at: string;
        updated_at: string;
        deleted_at: string | null;
        hall: string | null;
        seatNumber: string | null;
        session: number;
        jamb: {
            id: number;
            jambId: string;
            firstName: string;
            lastName: string;
            otherNames: string;
            gender: string;
            state: string;
            lga: string;
            aggregateScore: number;
            created_at: string;
            updated_at: string;
            deleted_at: string | null;
        };
    };
    programme: {
        programmeId: number;
        programmeName: string;
        duration: string;
        status: string;
        created_at: string;
        updated_at: string;
    };
    session_details: {
        sessionId: number;
        sessionName: string;
        startDate: string;
        endeDate: string | null;
        status: string;
        created_at: string | null;
        updated_at: string | null;
    };
    admission_setting: {
        settingId: number;
        session: number;
        resumptionDate: string;
        orientationDate: string;
        acceptanceDeadline: string;
        registrar: string;
        printAdmission: string;
        status: string;
        created_at: string | null;
        updated_at: string | null;
    };
}

interface FilterOptions {
    programmes: { value: number; label: string }[];
    sessions: { value: number; label: string }[];
    batches: string[];
}

const Admissions = () => {
    const [admissions, setAdmissions] = useState<Admission[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [currentAdmission, setCurrentAdmission] = useState<Admission | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [programmeFilter, setProgrammeFilter] = useState<number | "">("");
    const [sessionFilter, setSessionFilter] = useState<number | "">("");
    const [batchFilter, setBatchFilter] = useState<string>("");
    const [perPage, setPerPage] = useState(10);

    // Bulk upload states
    const [bulkOpen, setBulkOpen] = useState(false);
    const [selectedProgramme, setSelectedProgramme] = useState<number | "">("");
    const [selectedSession, setSelectedSession] = useState<number | "">("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    // Dropdown options for bulk upload
    const [uploadProgrammes, setUploadProgrammes] = useState<{ value: number; label: string }[]>([]);
    const [uploadSessions, setUploadSessions] = useState<{ value: number; label: string }[]>([]);

    const filterOptions: FilterOptions = {
        programmes: [],
        sessions: [],
        batches: ['1A', '1B']
    };

    const recordsPerPageOptions = [10, 50, 100, 200];

    const fetchProgrammes = async () => {
        try {
            const response = await api.get('/admission/programmes');
            setUploadProgrammes(response.data.map((p: any) => ({ value: p.programmeId, label: p.programmeName })));
        } catch (error) {
            console.error('Failed to fetch programmes:', error);
        }
    };

    const fetchSessions = async () => {
        try {
            const response = await api.get('/admission/sessions');
            setUploadSessions(response.data.map((s: any) => ({ value: s.sessionId, label: s.sessionName })));
        } catch (error) {
            console.error('Failed to fetch sessions:', error);
        }
    };

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/admissions', {
                params: { 
                    page: currentPage, 
                    per_page: perPage,
                    search: searchQuery || undefined,
                    programme: programmeFilter || undefined,
                    session: sessionFilter || undefined,
                    batch: batchFilter || undefined
                }
            });

            if (Array.isArray(response.data)) {
                setAdmissions(response.data);
                setTotalPages(1);
                setTotalRecords(response.data.length);
                
                // Extract unique programmes and sessions for filters
                const programmes = [...new Map(response.data.map((adm: Admission) => 
                    [adm.programme.programmeId, { value: adm.programme.programmeId, label: adm.programme.programmeName }]
                )).values()];
                filterOptions.programmes = programmes;

                const sessions = [...new Map(response.data.map((adm: Admission) => 
                    [adm.session_details.sessionId, { value: adm.session_details.sessionId, label: adm.session_details.sessionName }]
                )).values()];
                filterOptions.sessions = sessions;

                const batches = [...new Set(response.data.map((adm: Admission) => adm.application.batch).filter(b => b))] as string[];
                filterOptions.batches = batches.length > 0 ? batches : filterOptions.batches;
            } else {
                setAdmissions(response.data?.data || []);
                setTotalPages(response.data?.last_page || 1);
                setTotalRecords(response.data?.total || 0);
                
                if (response.data?.data) {
                    const programmes = [...new Map(response.data.data.map((adm: Admission) => 
                        [adm.programme.programmeId, { value: adm.programme.programmeId, label: adm.programme.programmeName }]
                    )).values()];
                    filterOptions.programmes = programmes;

                    const sessions = [...new Map(response.data.data.map((adm: Admission) => 
                        [adm.session_details.sessionId, { value: adm.session_details.sessionId, label: adm.session_details.sessionName }]
                    )).values()];
                    filterOptions.sessions = sessions;

                    const batches = [...new Set(response.data.data.map((adm: Admission) => adm.application.batch).filter(b => b))] as string[];
                    filterOptions.batches = batches.length > 0 ? batches : filterOptions.batches;
                }
            }
            setError(null);
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to fetch admissions');
            console.error('Fetch error:', error);
            setAdmissions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadExcel = () => {
        if (!admissions.length) {
            setError('No admissions available to download');
            return;
        }

        setIsDownloading(true);
        try {
            const data = admissions.map(adm => ({
                'Admission ID': adm.admissionId,
                'Application ID': adm.applicationId,
                'Candidate Name': `${adm.application.jamb.firstName} ${adm.application.jamb.lastName}${adm.application.jamb.otherNames ? ' ' + adm.application.jamb.otherNames : ''}`,
                'JAMB ID': adm.application.jambId,
                'Programme': adm.programme.programmeName,
                'Session': adm.session_details.sessionName,
                'Batch': adm.application.batch,
                'Resumption Date': adm.admission_setting.resumptionDate,
                'Orientation Date': adm.admission_setting.orientationDate,
                'Acceptance Deadline': adm.admission_setting.acceptanceDeadline,
                'Gender': adm.application.jamb.gender,
                'State': adm.application.jamb.state,
                'LGA': adm.application.jamb.lga,
                'Aggregate Score': adm.application.jamb.aggregateScore
            }));

            const worksheet = XLSX.utils.json_to_sheet(data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Admissions');

            // Auto-size columns
            const colWidths = [
                { wch: 12 }, // Admission ID
                { wch: 15 }, // Application ID
                { wch: 25 }, // Candidate Name
                { wch: 12 }, // JAMB ID
                { wch: 30 }, // Programme
                { wch: 15 }, // Session
                { wch: 8 },  // Batch
                { wch: 15 }, // Resumption Date
                { wch: 15 }, // Orientation Date
                { wch: 18 }, // Acceptance Deadline
                { wch: 8 },  // Gender
                { wch: 15 }, // State
                { wch: 15 }, // LGA
                { wch: 15 }, // Aggregate Score
            ];
            worksheet['!cols'] = colWidths;

            // Generate Excel file and trigger download
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            saveAs(blob, 'admissions.xlsx');
        } catch (err) {
            setError('Failed to generate Excel file');
            console.error('Download error:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    const handlePrintAdmission = async (admission: Admission) => {
        try {
            const response = await api.get(`/admissions/${admission.admissionId}/letter`, { responseType: 'blob' });
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (error: any) {
            setError(error.response?.data?.message || 'Failed to retrieve admission letter');
            console.error('Print error:', error);
        }
    };

    const handleBulkUpload = async () => {
        if (!selectedProgramme || !selectedSession || !selectedFile) {
            setUploadMessage({ type: 'error', text: 'Please fill all fields and select a file' });
            return;
        }

        setIsUploading(true);
        setUploadMessage(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('programme_id', selectedProgramme.toString());
            formData.append('session_id', selectedSession.toString());

            const response = await api.post('/admissions/bulk-upload', formData);

            setUploadMessage({ type: 'success', text: response.data.message });
            fetchData();
        } catch (error: any) {
            setUploadMessage({ type: 'error', text: error.response?.data?.message || 'Upload failed' });
            console.error('Upload error:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleCloseBulk = () => {
        setBulkOpen(false);
        setSelectedProgramme('');
        setSelectedSession('');
        setSelectedFile(null);
        setUploadMessage(null);
    };

    useEffect(() => {
        fetchData();
    }, [currentPage, perPage, programmeFilter, sessionFilter, batchFilter, searchQuery]);

    useEffect(() => {
        fetchProgrammes();
        fetchSessions();
    }, []);

    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    const handlePerPageChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    const handleSearch = () => {
        setCurrentPage(1);
        fetchData();
    };

    const handleOpenViewModal = (admission: Admission) => {
        setCurrentAdmission(admission);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setCurrentAdmission(null);
        setError(null);
        setIsSubmitting(false);
    };

    const handleRowExpand = (id: number) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString();
    };

    const formatFullName = (jamb: any) => {
        return `${jamb?.firstName} ${jamb?.lastName}${jamb?.otherNames ? ' ' + jamb?.otherNames : ''}`;
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <DashboardCard title="Admissions Management">
            <Box mb={2} display="flex" alignItems="left">
                <Box mb={2} display="flex" justifyContent="space-between" alignItems="left" gap={2} flexWrap="wrap">
                    <FormControl sx={{ minWidth: 120, flex: 1 }}>
                        <InputLabel>Records per page</InputLabel>
                        <Select
                            value={perPage}
                            onChange={handlePerPageChange}
                            label="Records per page"
                        >
                            {recordsPerPageOptions.map(option => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 200, flex: 1 }}>
                        <InputLabel>Filter by Programme</InputLabel>
                        <Select
                            value={programmeFilter}
                            onChange={(e) => setProgrammeFilter(e.target.value as number)}
                            label="Filter by Programme"
                        >
                            <MenuItem value="">All Programmes</MenuItem>
                            {filterOptions.programmes.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 200, flex: 1 }}>
                        <InputLabel>Filter by Session</InputLabel>
                        <Select
                            value={sessionFilter}
                            onChange={(e) => setSessionFilter(e.target.value as number)}
                            label="Filter by Session"
                        >
                            <MenuItem value="">All Sessions</MenuItem>
                            {filterOptions.sessions.map(option => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ minWidth: 200, flex: 1 }}>
                        <InputLabel>Filter by Batch</InputLabel>
                        <Select
                            value={batchFilter}
                            onChange={(e) => setBatchFilter(e.target.value)}
                            label="Filter by Batch"
                        >
                            <MenuItem value="">All Batches</MenuItem>
                            {filterOptions.batches.map(batchId => (
                                <MenuItem key={batchId} value={batchId}>
                                    Batch {batchId}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        sx={{ minWidth: 300, flex: 1 }}
                        fullWidth
                        variant="outlined"
                        placeholder="Search by admission ID, application ID, JAMB ID or name..."
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
                    <Button 
                        variant="contained" 
                        onClick={handleDownloadExcel}
                        disabled={isLoading || isDownloading || admissions.length === 0}
                        sx={{ height: '56px' }}
                        startIcon={isDownloading ? <CircularProgress size={20} color="inherit" /> : null}
                    >
                        {isDownloading ? 'Downloading...' : 'Download Excel'}
                    </Button>
                    <Button 
                        variant="outlined" 
                        onClick={() => setBulkOpen(true)}
                        sx={{ height: '56px' }}
                    >
                        Bulk Upload
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
                            aria-label="Admissions table"
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
                                            JAMB ID
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Programme
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            Session
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
                                {admissions.length > 0 ? (
                                    admissions.map((admission) => (
                                        <>
                                            <TableRow key={admission.admissionId}>
                                                <TableCell>
                                                    <IconButton
                                                        aria-label="expand row"
                                                        size="small"
                                                        onClick={() => handleRowExpand(admission.admissionId)}
                                                    >
                                                        {expandedRow === admission.admissionId ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                                    </IconButton>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {admission.applicationId}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {formatFullName(admission.application.jamb)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {admission.application.jambId}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {admission.programme.programmeName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography>
                                                        {admission.session_details.sessionName}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton onClick={() => handleOpenViewModal(admission)}>
                                                        <VisibilityIcon />
                                                    </IconButton>
                                                    <IconButton 
                                                        onClick={() => handlePrintAdmission(admission)}
                                                        color="primary"
                                                    >
                                                        <PrintIcon />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                                    <Collapse in={expandedRow === admission.admissionId} timeout="auto" unmountOnExit>
                                                        <Box sx={{ margin: 1 }}>
                                                            <Typography variant="h6" gutterBottom component="div">
                                                                Admission Details
                                                            </Typography>
                                                            <Grid container spacing={2}>
                                                                <Grid item xs={12} md={6}>
                                                                    <Paper elevation={0} sx={{ p: 2 }}>
                                                                        <Typography variant="subtitle1" gutterBottom>
                                                                            Candidate Information
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Full Name:</strong> {formatFullName(admission.application.jamb)}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>JAMB ID:</strong> {admission.application.jambId}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Gender:</strong> {admission.application.jamb.gender}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>State/LGA:</strong> {admission.application.jamb.state} / {admission.application.jamb.lga}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Aggregate Score:</strong> {admission.application.jamb.aggregateScore}
                                                                        </Typography>
                                                                        <Typography>
                                                                            <strong>Date of Birth:</strong> {formatDate(admission.application.dateOfBirth)}
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
                                            No admissions found
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
                        Showing {admissions.length} of {totalRecords} admissions
                        {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
                    </Typography>
                </>
            )}

            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="view-modal-title"
                aria-describedby="view-modal-description"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 900 },
                    maxWidth: '95%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}>
                    {currentAdmission && (
                        <>
                            <Typography id="view-modal-title" variant="h6" component="h2" fontWeight={600} mb={2}>
                                Admission Details - {currentAdmission.applicationId}
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={12}>
                                    <Paper elevation={1} sx={{ p: 2 }}>
                                        <Typography variant="subtitle1" gutterBottom fontWeight={600}>
                                            Candidate Information
                                        </Typography>
                                        <Typography>
                                            <strong>Full Name:</strong> {formatFullName(currentAdmission.application.jamb)}
                                        </Typography>
                                        <Typography>
                                            <strong>JAMB ID:</strong> {currentAdmission.application.jambId}
                                        </Typography>
                                        <Typography>
                                            <strong>Gender:</strong> {currentAdmission.application.jamb.gender}
                                        </Typography>
                                        <Typography>
                                            <strong>State/LGA:</strong> {currentAdmission.application.jamb.state} / {currentAdmission.application.jamb.lga}
                                        </Typography>
                                        <Typography>
                                            <strong>Aggregate Score:</strong> {currentAdmission.application.jamb.aggregateScore}
                                        </Typography>
                                        <Typography>
                                            <strong>Date of Birth:</strong> {formatDate(currentAdmission.application.dateOfBirth)}
                                        </Typography>
                                        <Typography>
                                            <strong>Marital Status:</strong> {currentAdmission.application.maritalStatus}
                                        </Typography>
                                    </Paper>
                                </Grid>
                        
                            </Grid>
                            <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                                <Button 
                                    onClick={() => handlePrintAdmission(currentAdmission)}
                                    color="primary"
                                    variant="contained"
                                    startIcon={<PrintIcon />}
                                >
                                    Print Admission
                                </Button>
                                <Button 
                                    onClick={handleCloseModal} 
                                    color="secondary"
                                    variant="outlined"
                                >
                                    Close
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            </Modal>

            {/* Bulk Upload Modal */}
            <Modal
                open={bulkOpen}
                onClose={handleCloseBulk}
                aria-labelledby="bulk-upload-title"
            >
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 500 },
                    maxWidth: '95%',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: { xs: 2, sm: 4 },
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto',
                }}>
                    <Typography id="bulk-upload-title" variant="h6" component="h2" fontWeight={600} mb={2}>
                        Bulk Upload Admissions
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Programme</InputLabel>
                                <Select
                                    value={selectedProgramme}
                                    onChange={(e) => setSelectedProgramme(e.target.value as number)}
                                    label="Programme"
                                >
                                    <MenuItem value="">Select Programme</MenuItem>
                                    {uploadProgrammes.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth required>
                                <InputLabel>Session</InputLabel>
                                <Select
                                    value={selectedSession}
                                    onChange={(e) => setSelectedSession(e.target.value as number)}
                                    label="Session"
                                >
                                    <MenuItem value="">Select Session</MenuItem>
                                    {uploadSessions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                required
                                label="Excel File (Application IDs only)"
                                type="file"
                                InputLabelProps={{ shrink: true }}
                                inputProps={{ accept: '.xlsx,.xls' }}
                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                helperText="Upload an Excel file with a single column of Application IDs"
                            />
                        </Grid>
                    </Grid>
                    {uploadMessage && (
                        <Box mt={2}>
                            <Alert severity={uploadMessage.type}>{uploadMessage.text}</Alert>
                        </Box>
                    )}
                    <Box display="flex" justifyContent="flex-end" mt={2} gap={1}>
                        <Button
                            onClick={handleBulkUpload}
                            variant="contained"
                            disabled={isUploading || !selectedProgramme || !selectedSession || !selectedFile}
                            startIcon={isUploading ? <CircularProgress size={20} /> : null}
                        >
                            {isUploading ? 'Uploading...' : 'Upload'}
                        </Button>
                        <Button onClick={handleCloseBulk} variant="outlined">
                            Cancel
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </DashboardCard>
    );
};

export default Admissions;