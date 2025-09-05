import { Component, useEffect, useState } from 'react';
import {
  Typography, Box, Button, TextField, CircularProgress, MenuItem, Select,
  FormControl, InputLabel, Alert, Stepper, Step, StepLabel, Card, CardContent,
  Avatar, Grid, Paper, IconButton, Dialog, DialogTitle, DialogContent,
  DialogContentText, DialogActions, LinearProgress, Fade, List, ListItem, ListItemText,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PaymentIcon from '@mui/icons-material/Payment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import SchoolIcon from '@mui/icons-material/School';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorOutline from '@mui/icons-material/ErrorOutline';
import { useRouter } from 'next/navigation';
import { getApplicationType, getCandidateName, getEmail, getPhoneNumber, getRole } from '@/lib/auth';
import api from '../../../../lib/api';

// Verify DashboardCard import
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

const steps = ['Biodata', 'Exam Details', 'Photo Upload', 'Summary', 'Payment', 'Exam Slip'];

class ErrorBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: '20px', color: 'red' }}>
          Error: {this.state.error.message}
        </div>
      );
    }
    return this.props.children;
  }
}

const Apply = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState(null);
  const [applicationId, setApplicationId] = useState(null);
  const [rrr, setRrr] = useState(null);
  const router = useRouter();
  const [isPaymentVerified, setIsPaymentVerified] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorModalData, setErrorModalData] = useState({ message: '', errors: {} });

  const fullname = getCandidateName();
  const email = getEmail();
  const phone = getPhoneNumber();

  const [formData, setFormData] = useState({
    gender: "",
    maritalStatus: "",
    dateOfBirth: "",
    olevelResults: [
      { subject: "Mathematics", grade: "", examYear: "", examType: "" },
      { subject: "English", grade: "", examYear: "", examType: "" },
      { subject: "Biology", grade: "", examYear: "", examType: "" },
      { subject: "Chemistry", grade: "", examYear: "", examType: "" },
      { subject: "Physics", grade: "", examYear: "", examType: "" },
    ],
    photo: null,
  });

  const [previewImage, setPreviewImage] = useState(null);

  const maritalStatuses = ['Single', 'Married', 'Divorced', 'Widowed'];
  const subjects = ['Mathematics', 'English', 'Physics', 'Chemistry', 'Biology', 'Economics', 'Geography', 'Government'];
  const grades = ['A1', 'B2', 'B3', 'C4', 'C5', 'C6', 'D7', 'E8', 'F9'];
  const examTypes = ['WAEC', 'NECO', 'NABTEB', 'GCE'];

  const primaryColor = "#1976d2";
  const secondaryColor = "#1976d2";
  useEffect(() => {
    const checkPaymentStatus = async () => {
      try {
        const response = await api.get('/application/status');
        if (response.data.status === 'payment_pending') {
          router.push('/dashboard/my-payments');
        } else if (response.data.status === 'payment_completed') {
          router.push('/dashboard/my-exam-slip');
        }
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to check payment status');
      }
    };
    checkPaymentStatus();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOlevelChange = (index, field, value) => {
    const newResults = [...formData.olevelResults];
    newResults[index] = { ...newResults[index], [field]: value };
    setFormData({ ...formData, olevelResults: newResults });
  };

  const addOlevelSubject = () => {
    setFormData({
      ...formData,
      olevelResults: [...formData.olevelResults, { subject: "", grade: "", examYear: "", examType: "" }],
    });
  };

  const handlePhotoUpload = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, photo: file });
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target) {
          setPreviewImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateBiodata = () => {
    if (!formData.gender) {
      setError('Gender is required');
      return false;
    }
    if (!formData.maritalStatus) {
      setError('Marital Status is required');
      return false;
    }
    if (!formData.dateOfBirth) {
      setError('Date of Birth is required');
      return false;
    }
    return true;
  };

  const validateOlevelResults = () => {
    const requiredSubjects = ["Mathematics", "English", "Biology", "Chemistry", "Physics"];
    const missingRequiredFields = formData.olevelResults
      .filter(r => requiredSubjects.includes(r.subject))
      .some(r => !r.grade || !r.examYear || !r.examType);

    if (missingRequiredFields) {
      setError('Please complete all required subjects (Mathematics, English, Biology, Chemistry, Physics) with grade, exam year and exam type.');
      return false;
    }

    const validResults = formData.olevelResults.filter(
      (r) => r.subject && r.grade && r.examYear && r.examType
    );
    if (validResults.length === 0) {
      setError('At least one complete O\'Level result (Subject, Grade, Exam Year, Exam Type) is required.');
      return false;
    }
    const incompleteResults = formData.olevelResults.filter(
      (r) => (r.subject || r.grade || r.examYear || r.examType) && !(r.subject && r.grade && r.examYear && r.examType)
    );
    if (incompleteResults.length > 0) {
      setError('All O\'Level result entries must have Subject, Grade, Exam Year, and Exam Type filled.');
      return false;
    }
    const subjects = validResults.map((r) => r.subject);
    const uniqueSubjects = new Set(subjects);
    if (uniqueSubjects.size < subjects.length) {
      const duplicates = subjects.filter((item, index) => subjects.indexOf(item) !== index);
      setError(`Duplicate subjects detected: ${duplicates.join(', ')}. Please ensure each subject is entered only once.`);
      return false;
    }
    const examYears = validResults.map((r) => r.examYear);
    const uniqueExamYears = new Set(examYears);
    if (uniqueExamYears.size > 2) {
      setError('You cannot enter results from more than two different exam years.');
      return false;
    }
    const examTypes = validResults.map((r) => r.examType);
    const uniqueExamTypes = new Set(examTypes);
    if (uniqueExamTypes.size > 1) {
      if (uniqueExamTypes.has('NABTEB') && (uniqueExamTypes.has('WAEC') || uniqueExamTypes.has('NECO'))) {
        setError('Invalid exam type combination. NABTEB cannot be combined with WAEC or NECO. Allowed combinations are: WAEC only, NECO only, NABTEB only, or WAEC and NECO.');
        return false;
      }
      if (!uniqueExamTypes.has('WAEC') && !uniqueExamTypes.has('NECO')) {
        setError('Invalid exam type combination. Allowed combinations are: WAEC only, NECO only, NABTEB only, or WAEC and NECO.');
        return false;
      }
    }
    return true;
  };

  const handleSubmitRegistration = async () => {
    if (!validateOlevelResults()) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const formDataToSend = new FormData();
      const completeOlevelResults = formData.olevelResults.filter(
        (r) => r.subject && r.grade && r.examYear && r.examType
      );
      
      formDataToSend.append('gender', formData.gender);
      formDataToSend.append('maritalStatus', formData.maritalStatus);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('olevelResults', JSON.stringify(completeOlevelResults));
      if (formData.photo) {
        formDataToSend.append('photo', formData.photo);
      }
      formDataToSend.append('email', email);
      formDataToSend.append('phone', phone);

      const response = await api.post('/apply', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status === 'success') {
        setApplicationId(response.data.applicationId);
        setSuccess('Your credentials have been submitted successfully. Please make payment!');
        setIsSubmitted(true);
        handleNext();
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (error) {
      if (error.response?.data?.status === 'error') {
        setErrorModalData({
          message: error.response.data.message || 'Validation failed',
          errors: error.response.data.errors || {}
        });
        setOpenErrorModal(true);
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to submit application');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiatePayment = async () => {
    if (!applicationId) {
      setError('No application ID found. Please submit the form first.');
      setIsPaying(false);
      return;
    }
    
    setIsPaying(true);
    setError(null);
    
    try {
      const response = await api.post('/payment/initiate', {
        applicationId,
      });

      if (response.data.status === 'success') {
        setRrr(response.data.rrr);
        setSuccess('RRR generated successfully!');
      } else {
        throw new Error(response.data.message || 'Failed to initiate payment');
      }
    } catch (error) {
      if (error.response?.data?.status === 'error') {
        setErrorModalData({
          message: error.response.data.message || 'Payment initiation failed',
          errors: error.response.data.errors || {}
        });
        setOpenErrorModal(true);
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to generate RRR');
      }
    } finally {
      setIsPaying(false);
    }
  };

  const verifyPayment = async () => {
    if (!rrr) {
      setError('No RRR found. Please generate an RRR first.');
      return;
    }
    
    setIsVerifying(true);
    setError(null);
    
    try {
      const response = await api.post('/payment/verify', {
        rrr,
        applicationId,
      });

      if (response.data.status === 'success') {
        setPaymentMessage(response.data.message || 'Payment verified successfully!');
        setSuccess('Payment verified successfully!');
        setIsPaymentVerified(true);
        setTimeout(() => {
          handleNext();
        }, 2000);
      } else {
        throw new Error(response.data.message || 'Payment verification failed');
      }
    } catch (error) {
      if (error.response?.data?.status === 'error') {
        setErrorModalData({
          message: error.response.data.message || 'Payment verification failed',
          errors: error.response.data.errors || {}
        });
        setOpenErrorModal(true);
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to verify payment');
        setIsPaymentVerified(false);
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePayOnline = () => {
    if (rrr) {
      window.open(`${process.env.NEXT_PUBLIC_API_REMITA_ONLINE}/${rrr}/payment.spa`, '_blank');
    }
  };

  const copyToClipboard = () => {
    if (rrr) {
      navigator.clipboard.writeText(rrr);
      setSuccess('RRR copied to clipboard!');
    }
  };

  const downloadExamSlip = async () => {
    if (!applicationId) {
      setError('No application ID found.');
      return;
    }
    
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
      
      setSuccess('Exam slip downloaded successfully!');
    } catch (error) {
      if (error.response?.data?.status === 'error') {
        setErrorModalData({
          message: error.response.data.message || 'Failed to download exam slip',
          errors: error.response.data.errors || {}
        });
        setOpenErrorModal(true);
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to download exam slip');
      }
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  const handleNext = () => {
    setError(null);
    if (activeStep === 0 && !validateBiodata()) return;
    if (activeStep === 1 && !validateOlevelResults()) return;
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError(null);
  };

  return (
    <ErrorBoundary>
      <DashboardCard title="Exam Registration">
        <Stepper 
          activeStep={activeStep} 
          sx={{ 
            mb: { xs: 2, sm: 3, md: 4 }, 
            '& .MuiStepLabel-label': {
              fontSize: { xs: '0.75rem', sm: '0.875rem' },
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }} 
            onClose={() => setError(null)}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }} 
            onClose={() => setSuccess(null)}
          >
            {success}
          </Alert>
        )}

        {/* Step 1: Biodata */}
        {activeStep === 0 && (
          <Card>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
              >
                Biodata Information
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    value={fullname}
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={phone}
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={email}
                    InputProps={{ readOnly: true }}
                    size="small"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Gender</InputLabel>
                    <Select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      label="Gender"
                      size="small"
                    >
                      <MenuItem value="">Select Gender</MenuItem>
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      {/* <MenuItem value="Other">Other</MenuItem> */}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Marital Status</InputLabel>
                    <Select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleInputChange}
                      label="Marital Status"
                      size="small"
                    >
                      <MenuItem value="">Select Status</MenuItem>
                      {maritalStatuses.map(status => (
                        <MenuItem key={status} value={status}>{status}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Date of Birth"
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    size="small"
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Exam Details */}
        {activeStep === 1 && (
          <Card>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
              >
                O'Level Results
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 1 }}>
                  <Grid item xs={3}>
                    <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Subject
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Grade
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Exam Year
                    </Typography>
                  </Grid>
                  <Grid item xs={4}>
                    <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      Exam Type
                    </Typography>
                  </Grid>
                </Grid>
                
                {formData.olevelResults.map((result, index) => (
                  <Grid container spacing={{ xs: 1, sm: 2 }} key={index} sx={{ mb: 2 }}>
                    <Grid item xs={3}>
                      <FormControl fullWidth>
                        <InputLabel>Subject</InputLabel>
                        <Select
                          value={result.subject}
                          onChange={(e) => handleOlevelChange(index, 'subject', e.target.value)}
                          label="Subject"
                          disabled={["Mathematics", "English", "Biology", "Chemistry", "Physics"].includes(result.subject)}
                          size="small"
                        >
                          <MenuItem value="">Select Subject</MenuItem>
                          {subjects.map(sub => (
                            <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={2}>
                      <FormControl fullWidth>
                        <InputLabel>Grade</InputLabel>
                        <Select
                          value={result.grade}
                          onChange={(e) => handleOlevelChange(index, 'grade', e.target.value)}
                          label="Grade"
                          required={["Mathematics", "English", "Biology", "Chemistry", "Physics"].includes(result.subject)}
                          size="small"
                        >
                          <MenuItem value="">Select Grade</MenuItem>
                          {grades.map(grade => (
                            <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        type="number"
                        value={result.examYear}
                        onChange={(e) => handleOlevelChange(index, 'examYear', e.target.value)}
                        placeholder="e.g., 2023"
                        required={["Mathematics", "English", "Biology", "Chemistry", "Physics"].includes(result.subject)}
                        inputProps={{ min: 1980, max: new Date().getFullYear() }}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <FormControl fullWidth>
                        <InputLabel>Exam Type</InputLabel>
                        <Select
                          value={result.examType}
                          onChange={(e) => handleOlevelChange(index, 'examType', e.target.value)}
                          label="Exam Type"
                          required={["Mathematics", "English", "Biology", "Chemistry", "Physics"].includes(result.subject)}
                          size="small"
                        >
                          <MenuItem value="">Select Exam Type</MenuItem>
                          {examTypes.map(type => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                ))}
                
                <Button
                  onClick={addOlevelSubject}
                  variant="outlined"
                  sx={{ mt: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  Add More Subjects
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Photo Upload */}
        {activeStep === 2 && (
          <Card>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
              >
                Upload Photograph
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                {previewImage ? (
                  <Avatar
                    src={previewImage}
                    sx={{ width: { xs: 120, sm: 150 }, height: { xs: 120, sm: 150 } }}
                  />
                ) : (
                  <Avatar sx={{ width: { xs: 120, sm: 150 }, height: { xs: 120, sm: 150 } }} />
                )}
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="passport-upload"
                  type="file"
                  onChange={handlePhotoUpload}
                />
                <label htmlFor="passport-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<CloudUploadIcon />}
                    sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  >
                    Upload Passport
                  </Button>
                </label>
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  (Maximum size: 500KB, Recommended: 300x300 pixels)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Summary */}
        {activeStep === 3 && (
          <Card>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
              >
                Application Summary
              </Typography>
              <Grid container spacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={12}>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    Personal Information
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #eee' }}>
                    <Grid container spacing={{ xs: 1, sm: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Full Name:</strong> {fullname}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Email:</strong> {email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Phone:</strong> {phone}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Gender:</strong> {formData.gender}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Marital Status:</strong> {formData.maritalStatus}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          <strong>Date of Birth:</strong> {formData.dateOfBirth}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>

                <Grid item xs={12}>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    O'Level Results
                    <Typography 
                      variant="caption" 
                      display="block" 
                      color="text.secondary"
                      sx={{ fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                    >
                      * Required subjects
                    </Typography>
                  </Typography>
                  <Paper elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #eee' }}>
                    <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 1 }}>
                      <Grid item xs={3}>
                        <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Subject
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Grade
                        </Typography>
                      </Grid>
                      <Grid item xs={3}>
                        <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Exam Year
                        </Typography>
                      </Grid>
                      <Grid item xs={4}>
                        <Typography fontWeight="bold" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                          Exam Type
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    {formData.olevelResults
                      .filter(r => r.subject && r.grade && r.examYear && r.examType)
                      .map((result, index) => (
                        <Grid 
                          container 
                          spacing={{ xs: 1, sm: 2 }} 
                          key={index} 
                          sx={{ 
                            mb: 1,
                            backgroundColor: ["Mathematics", "English", "Biology", "Chemistry", "Physics"].includes(result.subject) 
                              ? 'rgba(25, 118, 210, 0.08)' 
                              : 'transparent',
                            p: 1,
                            borderRadius: 1
                          }}
                        >
                          <Grid item xs={3}>
                            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {result.subject}
                              {["Mathematics", "English", "Biology", "Chemistry", "Physics"].includes(result.subject) && (
                                <Typography component="span" color="error" sx={{ ml: 0.5 }}>*</Typography>
                              )}
                            </Typography>
                          </Grid>
                          <Grid item xs={2}>
                            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {result.grade}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {result.examYear}
                            </Typography>
                          </Grid>
                          <Grid item xs={4}>
                            <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                              {result.examType}
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                  </Paper>
                </Grid>

                {previewImage && (
                  <Grid item xs={12}>
                    <Typography 
                      variant="subtitle1" 
                      gutterBottom
                      sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                    >
                      Passport Photograph
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Avatar
                        src={previewImage}
                        sx={{ width: { xs: 80, sm: 100 }, height: { xs: 80, sm: 100 } }}
                      />
                    </Box>
                  </Grid>
                )}
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Step 5: Payment */}
        {activeStep === 4 && (
          <Card>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
              >
                Payment
              </Typography>
              <Typography 
                sx={{ mb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Please complete your payment to finalize application.
              </Typography>

              {paymentMessage && (
                <Alert 
                  severity={paymentMessage.includes('success') ? 'success' : 'error'}
                  sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                >
                  {paymentMessage}
                </Alert>
              )}

              {rrr ? (
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Typography 
                    variant="subtitle1" 
                    gutterBottom
                    sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                  >
                    Your Remita Retrieval Reference (RRR)
                  </Typography>
                  <Paper elevation={3} sx={{ p: 2, display: 'inline-block', mb: 2 }}>
                    <Typography 
                      variant="h5" 
                      color="primary"
                      sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
                    >
                      {rrr}
                    </Typography>
                  </Paper>
                  <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                    <Button
                      variant="outlined"
                      startIcon={<ContentCopyIcon />}
                      onClick={copyToClipboard}
                      sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                    >
                      Copy RRR
                    </Button>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                  <Button
                    variant="contained"
                    onClick={initiatePayment}
                    disabled={isPaying}
                    startIcon={isPaying ? <CircularProgress size={20} /> : <PaymentIcon />}
                    sx={{
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                      "&:hover": {
                        background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                      }
                    }}
                  >
                    {isPaying ? 'Generating RRR...' : 'Generate Remita RRR'}
                  </Button>
                </Box>
              )}

              <Grid container spacing={{ xs: 1, sm: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handlePayOnline}
                    disabled={!rrr}
                    startIcon={<PaymentIcon />}
                    sx={{
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                      "&:hover": {
                        background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                      },
                      color: "white",
    "&.Mui-disabled": {
      color: "white", // 👈 keeps text white
      background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`, // 👈 keeps gradient even when disabled
      opacity: 0.6, // optional: make it look visually "disabled"
    },
                    }}
                  >
                    Pay Online Now
                  </Button>
                </Grid>
                {/* <Button
  fullWidth
  variant="contained"
  onClick={handlePayOnline}
  disabled={!rrr}
  startIcon={<PaymentIcon />}
  sx={{
    py: { xs: 1, sm: 1.5 },
    fontSize: { xs: '0.875rem', sm: '1rem' },
    background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
    "&:hover": {
      background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
    },
    color: "white",
    "&.Mui-disabled": {
      color: "white", // 👈 keeps text white
      background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`, // 👈 keeps gradient even when disabled
      opacity: 0.6, // optional: make it look visually "disabled"
    },
  }}
>
  Pay Online Now
</Button> */}

                <Grid item xs={12} sm={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={verifyPayment}
                    disabled={!rrr || isVerifying}
                    startIcon={isVerifying ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                    sx={{
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      color: primaryColor,
                      borderColor: primaryColor,
                      "&:hover": {
                        borderColor: secondaryColor,
                        color: secondaryColor,
                      }
                    }}
                  >
                    {isVerifying ? 'Verifying...' : 'Verify Payment'}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Exam Slip */}
        {activeStep === 5 && (
          <Card>
            <CardContent>
              <Typography 
                variant="h6" 
                gutterBottom
                sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
              >
                Exam Slip
              </Typography>
              <Typography 
                sx={{ mb: 3, fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Your application is complete. Download your exam slip below.
              </Typography>

              <Grid container spacing={{ xs: 1, sm: 2 }} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    <strong>Name:</strong> {fullname}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    <strong>Application ID:</strong> {applicationId}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    <strong>Email:</strong> {email}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                    <strong>Phone:</strong> {phone}
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="contained"
                  onClick={downloadExamSlip}
                  disabled={isDownloading}
                  startIcon={isDownloading ? <CircularProgress size={20} /> : <DownloadIcon />}
                  sx={{
                    px: 4,
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                    "&:hover": {
                      background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                    }
                  }}
                >
                  {isDownloading ? 'Downloading...' : 'Download Exam Slip'}
                </Button>
                
                {isDownloading && (
                  <Box sx={{ width: '100%', maxWidth: 360 }}>
                    <LinearProgress 
                      variant={downloadProgress > 0 ? "determinate" : "indeterminate"}
                      value={downloadProgress}
                      sx={{ height: 8, borderRadius: 4 }}
                    />
                    {downloadProgress > 0 && (
                      <Typography 
                        variant="caption" 
                        color="text.secondary" 
                        sx={{ mt: 1, fontSize: { xs: '0.625rem', sm: '0.75rem' } }}
                      >
                        {downloadProgress}% downloaded
                      </Typography>
                    )}
                  </Box>
                )}
              </Box>
            </CardContent>
          </Card>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
          <Button
            color="inherit"
            disabled={activeStep === 0 || isSubmitted}
            onClick={handleBack}
            sx={{ mr: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
          >
            Back
          </Button>
          
          <Box sx={{ flex: '1 1 auto' }} />

          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={() => router.push('/dashboard')}
              sx={{
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                "&:hover": {
                  background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                }
              }}
            >
              Return to Dashboard
            </Button>
          ) : activeStep === 3 ? (
            <Button
              variant="contained"
              onClick={handleSubmitRegistration}
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
              sx={{
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                "&:hover": {
                  background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                }
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Proceed to payment'}
            </Button>
          ) : activeStep === 4 ? (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={!isPaymentVerified}
              sx={{
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                "&:hover": {
                  background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                },
                color: "white",
                  "&.Mui-disabled": {
      color: "white", // 👈 keeps text white
      background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`, // 👈 keeps gradient even when disabled
      opacity: 0.6, // optional: make it look visually "disabled"
    },
              }}
            >
              View Exam Slip
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              sx={{
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                "&:hover": {
                  background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                }
              }}
            >
              Next
            </Button>
          )}
        </Box>

        <Dialog
          open={openErrorModal}
          onClose={() => setOpenErrorModal(false)}
          TransitionComponent={Fade}
          transitionDuration={400}
          PaperProps={{
            sx: {
              borderRadius: { xs: 2, sm: 3 },
              maxWidth: { xs: '90%', sm: 500 },
              mx: 'auto',
              p: { xs: 1, sm: 2 },
              boxShadow: { xs: '0 8px 16px rgba(0,0,0,0.1)', sm: '0 12px 24px rgba(0,0,0,0.2)' },
            }
          }}
        >
          <DialogTitle 
            sx={{ 
              fontWeight: 700, 
              textAlign: 'center', 
              color: 'error.main',
              fontSize: { xs: '1.25rem', sm: '1.5rem' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1
            }}
          >
            <ErrorOutline sx={{ fontSize: { xs: 24, sm: 28 } }} />
            {errorModalData.message || 'Error'}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: 'center', py: { xs: 1, sm: 2 } }}>
              <ErrorOutline color="error" sx={{ fontSize: { xs: 40, sm: 60 } }} />
            </Box>
            <DialogContentText 
              sx={{ 
                textAlign: 'center',
                color: 'text.primary',
                fontWeight: 500,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                mb: 2
              }}
            >
              There was an issue with your submission. Please review the details below and try again.
            </DialogContentText>
            {Object.keys(errorModalData.errors).length > 0 && (
              <List sx={{ mt: 1 }}>
                {Object.entries(errorModalData.errors).map(([field, messages]) => (
                  <ListItem key={field} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={
                        <Typography 
                          sx={{ 
                            fontWeight: 600, 
                            color: 'error.main',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          {field.charAt(0).toUpperCase() + field.slice(1)}:
                        </Typography>
                      }
                      secondary={
                        <Typography 
                          sx={{ 
                            color: 'text.primary',
                            fontSize: { xs: '0.75rem', sm: '0.875rem' }
                          }}
                        >
                          {Array.isArray(messages) ? messages.join(', ') : messages}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </DialogContent>
          <DialogActions sx={{ justifyContent: 'center', pb: { xs: 2, sm: 3 } }}>
            <Button 
              onClick={() => setOpenErrorModal(false)}
              variant="outlined"
              sx={{ 
                borderRadius: 2, 
                px: { xs: 3, sm: 4 },
                py: { xs: 1, sm: 1.5 },
                fontSize: { xs: '0.875rem', sm: '1rem' },
                color: primaryColor,
                borderColor: primaryColor,
                "&:hover": {
                  borderColor: secondaryColor,
                  color: secondaryColor,
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </DashboardCard>
    </ErrorBoundary>
  );
};

export default Apply;