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
  TextField,
  Paper,
  Fade,
} from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import axios from "axios";

const AuthLogin = () => {
  const theme = useTheme();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const primaryColor = "#1976d2";
  const secondaryColor = "#1976d2";

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_APP_URL}/users/login`,
        { username, password },
        { withCredentials: true }
      );
      
      const userData = {
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        otherNames: response.data.otherNames,
        email: response.data.email,
        phoneNumber: response.data.phoneNumber,
        role: response.data.role,
        applicationType: response.data.applicationType,
        access_token: response.data.access_token,
      };

      localStorage.setItem('user', JSON.stringify(userData));
      router.push('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setError('Invalid username or password. Please try again.');
    } finally {
      setIsSubmitting(false);
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
          // background: { 
          //   xs: "rgba(255,255,255,0.95)",
          //   sm: "linear-gradient(to right, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.9) 50%, rgba(255,255,255,0.95) 100%)",
          // },
          zIndex: 1,
        },
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          elevation={10}
          sx={{
            width: "100%",
            maxWidth: { xs: '100%', sm: 500, md: 600 },
            maxHeight: '90vh',
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
                         // fontWeight="100" 
                         sx={{ fontSize: {mt: 3, xs: '1.5rem', sm: '1.5rem' } }}
                       >
                         2025 ND Nursing Application Portal
                       </Typography>
                       <br/>
                       <Typography 
                         variant="body2" 
                         sx={{ opacity: 0.9, mt: 1, fontSize: { xs: '1rem', sm: '1rem' } }}
                       >
                        Sign in to your account
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
            {error && (
              <Alert 
                severity="error" 
                sx={{ mb: 2, fontSize: { xs: '0.75rem', sm: '0.875rem' } }} 
                onClose={() => setError(null)}
              >
                {error}
              </Alert>
            )}

            <form onSubmit={handleLogin}>
              <Stack spacing={{ xs: 2, sm: 3 }}>
                <TextField
                  label="Email"
                  variant="outlined"
                  fullWidth
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter your Email"
                  size="small"
                />

                <TextField
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  variant="outlined"
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Enter your password"
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          aria-label="toggle password visibility"
                          disabled={isSubmitting}
                        >
                          {showPassword ? <VisibilityOff sx={{ fontSize: { xs: 20, sm: 24 } }} /> : <Visibility sx={{ fontSize: { xs: 20, sm: 24 } }} />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Box textAlign="right">
                  <Link href="/authentication/forgot-password" passHref>
                    <Typography 
                      component="a"
                      sx={{
                        textDecoration: "none",
                        color: primaryColor,
                        fontWeight: 600,
                        "&:hover": { textDecoration: "underline" },
                        fontSize: { xs: '0.75rem', sm: '0.875rem' }
                      }}
                    >
                      Forgot Password?
                    </Typography>
                  </Link>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  disabled={isSubmitting || !username || !password}
                  sx={{
                    py: { xs: 1, sm: 1.5 },
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    mt: 2,
                    background: `linear-gradient(45deg, ${primaryColor}, ${secondaryColor})`,
                    "&:hover": {
                      background: `linear-gradient(45deg, ${secondaryColor}, ${primaryColor})`,
                    }
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Divider sx={{ my: { xs: 2, sm: 3 } }}>
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
                  sx={{ pb: 2, fontSize: { xs: '0.875rem', sm: '1rem' } }}
                >
                  Don't have an account?{' '}
                  <Link href="/authentication/create-account" passHref>
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
                      Create one
                    </Typography>
                  </Link>
                </Typography>
              </Stack>
            </form>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
};

export default AuthLogin;