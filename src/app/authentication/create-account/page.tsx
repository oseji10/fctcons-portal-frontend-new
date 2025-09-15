"use client";
import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Divider,
  useTheme,
  MenuItem,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Fade,
  Paper,
  InputLabel,
  FormControl,
  Select,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Visibility, VisibilityOff, ErrorOutline, CheckCircle, ArrowBack } from "@mui/icons-material";
import Logo from "@/app/(DashboardLayout)/dashboard/layout/shared/logo/Logo";
import axios from "axios";
import { MuiTelInput } from 'mui-tel-input'

const Register2 = () => {
  const theme = useTheme();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(null);

  const [openSuccessModal, setOpenSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [openErrorModal, setOpenErrorModal] = useState(false);
  const [errorModalMessage, setErrorModalMessage] = useState("");

  // Set application type 1 as default and readonly
  const [applicationType, setApplicationType] = useState("1");
  const [jambId, setJambId] = useState("");
  const [validatingJamb, setValidatingJamb] = useState(false);
  const [jambValidated, setJambValidated] = useState(false);
  const [jambData, setJambData] = useState({
    firstName: "",
    lastName: "",
    otherNames: "",
    state: "",
    gender: ""
  });

  // Form fields
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    otherNames: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    yearOfGraduation: "",
    licenseNumber: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  // Define app colors
  const primaryColor = "#1976d2";
  const secondaryColor = "#1976d2";
  const accentColor = "#2e7d32";

  const steps = ['JAMB Verification', 'Account Details', 'Review & Submit'];

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handlePhoneChange = (newPhone) => {
    setFormData({...formData, phoneNumber: newPhone});
  };

  const validateJambId = async () => {
    if (!jambId) {
      setError("Please enter JAMB ID");
      return;
    }

    setValidatingJamb(true);
    setError(null);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_APP_URL}/verify-jamb`, { 
        jambId
      });

      if (response.data) {
        setJambData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          otherNames: response.data.otherNames || '',
          state: response.data.state,
          gender: response.data.gender
        });
        setJambValidated(true);
        setSuccess("JAMB ID validated successfully");
      } else {
        setError("Invalid JAMB ID");
      }
    } catch (error) {
      console.error('Validation failed:', error);
      setError(error.response?.data?.message || 'Error validating JAMB ID. Please try again.');
    } finally {
      setValidatingJamb(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setErrors({});

    try {
      const payload = {
        applicationType,
        ...formData,
        ...(applicationType === "1" && { 
          jambId,
          firstName: jambData.firstName,
          lastName: jambData.lastName,
          otherNames: jambData.otherNames,
          stateOfOrigin: jambData.state,
          gender: jambData.gender
        })
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/users/register`,
        payload
      );

      if (response.data.status === "success") {
        setSuccessMessage(response.data.message || "Registration successful!");
        setOpenSuccessModal(true);
      } else {
        setErrorModalMessage(response.data.message || "Registration failed");
        setOpenErrorModal(true);
      }
    } catch (error) {
      console.error('Registration failed:', error);
      if (error.response?.data?.errors) {
        const errorData = error.response.data;
        
        if (errorData.errors && typeof errorData.errors === 'object') {
          let formattedErrors = "";
          for (const [field, messages] of Object.entries(errorData.errors)) {
            formattedErrors += `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}\n`;
          }
          
          setErrorModalMessage(
            `${errorData.message || 'Validation failed'}\n\n${formattedErrors}`
          );
        } else {
          setErrorModalMessage(errorData.message || 'Registration failed. Please try again.');
        }
        
        setOpenErrorModal(true);
      } else if (error.response?.data?.message) {
        setErrorModalMessage(error.response.data.message);
        setOpenErrorModal(true);
      } else {
        setErrorModalMessage('Registration failed. Please try again.');
        setOpenErrorModal(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={{ xs: 2, sm: 3 }}>
            <Box sx={{ textAlign: 'center', mb: { xs: 1, sm: 2 } }}>
              <CheckCircle sx={{ fontSize: { xs: 40, sm: 60 }, color: secondaryColor, mb: 1 }} />
              <Typography 
                variant="h6" 
                color="primary" 
                gutterBottom 
                sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
              >
                JAMB Verification Required
              </Typography>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
              >
                Please enter your JAMB registration number to verify your details
              </Typography>
            </Box>

            <TextField
              label="Application Type"
              value="ND Nursing"
              fullWidth
              disabled
              variant="outlined"
              size="small"
            />

            <TextField
              label="JAMB Registration Number"
              value={jambId}
              onChange={(e) => setJambId(e.target.value)}
              fullWidth
              required
              disabled={jambValidated}
              variant="outlined"
              placeholder="Enter your JAMB registration number"
              size="small"
              sx={{ mb: 2 }}
            />

            {!jambValidated && (
              <Button
                variant="contained"
                onClick={validateJambId}
                disabled={validatingJamb || !jambId}
                startIcon={validatingJamb ? <CircularProgress size={20} /> : null}
                sx={{ 
                  py: { xs: 1, sm: 1.5 },
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                  "&:hover": {
                    background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                    color: 'white'
                  },
                  "&.Mui-disabled": {
                    color: "white",
                    background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                    opacity: 0.5,
                  },
                }}
              >
                {validatingJamb ? "Validating..." : "Verify JAMB Details"}
              </Button>
            )}

            {jambValidated && (
              <>
                <Box 
                  sx={{ 
                    p: { xs: 1.5, sm: 2 }, 
                    border: `2px solid ${accentColor}`, 
                    borderRadius: 2, 
                    bgcolor: `${accentColor}08`
                  }}
                >
                  <Typography 
                    variant="subtitle1" 
                    color={accentColor} 
                    gutterBottom 
                    sx={{ 
                      fontWeight: 'bold', 
                      display: 'flex', 
                      alignItems: 'center',
                      fontSize: { xs: '0.875rem', sm: '1rem' }
                    }}
                  >
                    <CheckCircle sx={{ mr: 1, fontSize: { xs: 20, sm: 24 } }} /> JAMB Details Verified
                  </Typography>
                  <Grid container spacing={{ xs: 1, sm: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="First Name"
                        value={jambData.firstName}
                        fullWidth
                        disabled
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Last Name"
                        value={jambData.lastName}
                        fullWidth
                        disabled
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Other Names"
                        value={jambData.otherNames}
                        fullWidth
                        disabled
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="State of Origin"
                        value={jambData.state}
                        fullWidth
                        disabled
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Gender"
                        value={jambData.gender}
                        fullWidth
                        disabled
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
                
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
                  Continue to Account Details
                </Button>
              </>
            )}
          </Stack>
        );
      
      case 1:
        return (
          <Stack spacing={{ xs: 2, sm: 3 }}>
            <Typography 
              variant="h6" 
              color="primary" 
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              Create Your Account
            </Typography>
            
            <TextField
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              fullWidth
              required
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
              placeholder="your.email@example.com"
              size="small"
            />

            <MuiTelInput
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handlePhoneChange}
              fullWidth
              required
              defaultCountry="NG"
              preferredCountries={['NG', 'US', 'GB']}
              variant="outlined"
              size="small"
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              fullWidth
              required
              variant="outlined"
              error={!!errors.password}
              helperText={errors.password || "Must be at least 8 characters"}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              fullWidth
              required
              variant="outlined"
              error={!!errors.confirmPassword || (formData.confirmPassword && formData.password !== formData.confirmPassword)}
              helperText={errors.confirmPassword || (formData.confirmPassword && formData.password !== formData.confirmPassword ? "Passwords don't match" : "")}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleToggleConfirmPasswordVisibility}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        );
      
      case 2:
        return (
          <Stack spacing={{ xs: 2, sm: 3 }}>
            <Typography 
              variant="h6" 
              color="primary" 
              gutterBottom
              sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}
            >
              Review Your Information
            </Typography>
            
            <Card variant="outlined" sx={{ borderColor: primaryColor }}>
              <CardContent>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ 
                    color: primaryColor, 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Personal Details
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <strong>First Name:</strong> {jambData.firstName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <strong>Last Name:</strong> {jambData.lastName}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <strong>Other Names:</strong> {jambData.otherNames || 'N/A'}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <strong>State of Origin:</strong> {jambData.state}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <strong>Gender:</strong> {jambData.gender}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card variant="outlined" sx={{ borderColor: secondaryColor }}>
              <CardContent>
                <Typography 
                  variant="subtitle1" 
                  gutterBottom 
                  sx={{ 
                    color: secondaryColor, 
                    fontWeight: 'bold',
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Account Details
                </Typography>
                <Grid container spacing={{ xs: 1, sm: 2 }}>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <strong>Email:</strong> {formData.email}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <strong>Phone Number:</strong> {formData.phoneNumber}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <strong>Application Type:</strong> ND Nursing
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>
                      <strong>JAMB Registration:</strong> {jambId}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Stack>
        );
      
      default:
        return <Typography>Unknown step</Typography>;
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: "100vh",
        backgroundImage: "url('/images/fctson4.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: { xs: 2, sm: 3, md: 4 },
        overflow: 'hidden',
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: { 
            xs: "rgba(255,255,255,0.95)",
            sm: "linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.95) 100%)",
          },
          zIndex: 1,
        },
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: { xs: '100%', sm: 600, md: 700 },
            maxHeight: '95vh',
            minHeight: '80vh',
            overflow: "hidden",
            borderRadius: { xs: 2, sm: 4 },
            background: "white",
            boxShadow: { xs: "0 8px 16px rgba(0,0,0,0.1)", sm: "0 20px 40px rgba(0,0,0,0.1)" },
            mx: { xs: 0, sm: 2, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            zIndex: 2,
          }}
        >
          <Box
            sx={{
              background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
              color: "white",
              p: { xs: 2, sm: 3 },
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <Box display="flex" justifyContent="center" mb={{ xs: 1, sm: 2 }}>
              {/* <Logo sx={{ width: { xs: 140, sm: 180 }, height: 'auto', filter: "brightness(0) invert(1)" }} /> */}
            </Box>
            <Typography 
              variant="h4" 
              fontWeight="500" 
              sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}
            >
              FCT College of Nursing Sciences
            </Typography>
            <br/>
            <Typography 
              variant="body2" 
              sx={{ fontSize: {mt: 3, xs: '1.5rem', sm: '1.5rem' } }}
            >
              2025 ND Nursing Application Portal
            </Typography>
            <br/>
            <Typography 
              variant="body2" 
              sx={{ opacity: 0.9, mt: 1, fontSize: { xs: '1rem', sm: '1rem' } }}
            >
             Create Account to Start Your Application
            </Typography>
          </Box>

          <Box 
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 },
              overflowY: 'auto',
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Stepper 
              activeStep={activeStep} 
              sx={{ 
                mb: { xs: 2, sm: 3, md: 4 }, 
                flexShrink: 0,
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
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                {success}
              </Alert>
            )}

            <Box sx={{ flexGrow: 1 }}>
              {renderStepContent(activeStep)}
                
              <Box sx={{ display: 'flex', flexDirection: 'row', pt: 3, mt: 3 }}>
                <Button
                  color="inherit"
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  sx={{ mr: 1, fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
                <Box sx={{ flex: '1 1 auto' }} />
                
                {activeStep === steps.length - 1 ? (
                  <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={isSubmitting}
                    sx={{
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                      color: "white",
                      "&:hover": {
                        background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                      },
                      "&.Mui-disabled": {
                        color: "white",
                        background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                        opacity: 0.5,
                      },
                    }}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {isSubmitting ? "Submitting..." : "Confirm and Create Account"}
                  </Button>
                ) : activeStep === 0 && jambValidated ? (
                  <div></div>
                ) : (
                  <Button 
                    onClick={handleNext}
                    variant="contained"
                    disabled={activeStep === 0 && !jambValidated}
                    sx={{
                      py: { xs: 1, sm: 1.5 },
                      fontSize: { xs: '0.875rem',aisant: '1rem' },
                      background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                      "&:hover": {
                        background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                      },
                      "&.Mui-disabled": {
                        color: "white",
                        background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                        opacity: 0.5,
                      },
                    }}
                  >
                    Next
                  </Button>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: { xs: 2, sm: 3 }, flexShrink: 0 }}>
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}
              >
                OR
              </Typography>
            </Divider>

            <Typography 
              textAlign="center" 
              sx={{ pb: 2, flexShrink: 0, fontSize: { xs: '0.875rem', sm: '1rem' } }}
            >
              Already have an account?{' '}
              <Link href="/authentication/login" passHref>
                <Typography 
                  component="a"
                  sx={{
                    color: primaryColor,
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": { textDecoration: "underline" },
                    fontSize: { xs: '0.875rem', sm: '1rem' }
                  }}
                >
                  Sign In
                </Typography>
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>

      {/* Success Modal */}
      <Dialog
        open={openSuccessModal}
        onClose={() => {
          setOpenSuccessModal(false);
          router.push("/authentication/login");
        }}
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            maxWidth: { xs: "90%", sm: 500 },
            mx: "auto",
            p: { xs: 1, sm: 2 },
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontWeight: 700, 
            textAlign: "center", 
            color: "success.main",
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          Registration Successful!
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={{ xs: 1, sm: 2 }}>
            <CheckCircle sx={{ fontSize: { xs: 40, sm: 60 }, color: "success.main" }} />
          </Box>
          <DialogContentText 
            textAlign="center"
            sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
          >
            {successMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: { xs: 2, sm: 3 } }}>
          <Button 
            onClick={() => {
              setOpenSuccessModal(false);
              router.push("/authentication/login");
            }}
            variant="contained"
            sx={{ 
              borderRadius: 2, 
              px: { xs: 3, sm: 4 },
              py: { xs: 1, sm: 1.5 },
              fontSize: { xs: '0.875rem', sm: '1rem' },
              background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
              "&:hover": {
                background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
              }
            }}
          >
            Continue to login
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Modal */}
      <Dialog
        open={openErrorModal}
        onClose={() => setOpenErrorModal(false)}
        PaperProps={{
          sx: {
            borderRadius: { xs: 2, sm: 3 },
            maxWidth: { xs: "90%", sm: 500 },
            mx: "auto",
            p: { xs: 1, sm: 2 },
          }
        }}
      >
        <DialogTitle 
          sx={{ 
            fontWeight: 700, 
            textAlign: "center", 
            color: "error.main",
            fontSize: { xs: '1.25rem', sm: '1.5rem' }
          }}
        >
          <ErrorOutline sx={{ verticalAlign: "middle", mr: 1, fontSize: { xs: 24, sm: 28 } }} />
          Registration Error
        </DialogTitle>
        <DialogContent>
          <Box textAlign="center" py={{ xs: 1, sm: 2 }}>
            <ErrorOutline color="error" sx={{ fontSize: { xs: 40, sm: 60 } }} />
          </Box>
          <DialogContentText 
            sx={{ 
              whiteSpace: 'pre-line',
              textAlign: "center",
              color: 'text.primary',
              fontWeight: 500,
              fontSize: { xs: '0.875rem', sm: '1rem' }
            }}
          >
            {errorModalMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: { xs: 2, sm: 3 } }}>
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
            Try Again
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Register2;