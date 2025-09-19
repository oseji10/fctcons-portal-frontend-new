"use client";

import { Grid, Box, Card, Stack, Typography, Button, FormControlLabel, Checkbox, Modal, Fade, Backdrop } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Logo from "./(DashboardLayout)/dashboard/layout/shared/logo/Logo";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";

const Home = () => {
  const [checked, setChecked] = useState(false);
  const [openModal, setOpenModal] = useState(false); // Initialize as false
  const [announcement, setAnnouncement] = useState({ title: "", message: "", status: "disabled" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const router = useRouter();
  const handleLoginClick = () => {
    router.push("/authentication/login");
  };

  const handleCreateAccountClick = () => {
    router.push("/authentication/create-account");
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Fetch announcement data from endpoint

  // Fetch announcement data from endpoint
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/announcement`); // Replace with your actual endpoint
        if (!response.ok) {
          throw new Error("Failed to fetch announcement");
        }
        const data = await response.json();
        // Check if the array is not empty and extract the first item
        if (Array.isArray(data) && data.length > 0) {
          const announcementData = data[0];
          setAnnouncement({
            title: announcementData.title || "📢 Important Announcement",
            message: announcementData.message || "No announcement available at this time.",
            status: announcementData.status || "disabled",
          });
          // Show modal only if status is "enabled"
          if (announcementData.status === "enabled") {
            setOpenModal(true);
          }
        } else {
          throw new Error("Empty or invalid announcement data");
        }
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setAnnouncement({
          title: "📢 Important Announcement",
          message: "Unable to load announcement. Please try again later.",
          status: "disabled",
        });
        setLoading(false);
      }
    };

    fetchAnnouncement();
  }, []);

  return (
    <>
      {/* Tawk.to Script */}
      <Script
        id="tawk-to-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
            (function(){
              var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
              s1.async=true;
              s1.src='https://embed.tawk.to/68b9952ca5f4751922ce66cb/1j4aetdis';
              s1.charset='UTF-8';
              s1.setAttribute('crossorigin','*');
              s0.parentNode.insertBefore(s1,s0);
            })();
          `,
        }}
      />

      {/* Announcement Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400 },
              bgcolor: "white",
              borderRadius: 3,
              boxShadow: 24,
              p: 4,
              textAlign: "center",
              background: "linear-gradient(135deg, #1976d2, #42a5f5)",
              color: "white",
            }}
          >
            <Typography variant="h5" component="h2" sx={{ fontWeight: 700, mb: 2 }}>
              {loading ? "Loading..." : announcement.title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              {loading ? "Fetching announcement..." : announcement.message}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={handleCloseModal}
              sx={{
                px: 4,
                bgcolor: "#fff",
                color: "primary.main",
                "&:hover": { bgcolor: "#e0e0e0" },
              }}
            >
              Got It!
            </Button>
          </Box>
        </Fade>
      </Modal>

      <Box
        sx={{
          position: "relative",
          minHeight: "100vh",
          background: "#f5f5f5",
          p: { xs: 2, md: 4 },
        }}
      >
        <Grid container justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <Card
              elevation={3}
              sx={{
                p: { xs: 3, md: 6 },
                mb: 4,
                background: "#fff",
                borderRadius: 2,
              }}
            >
              {/* Centered Logo */}
              <Box display="flex" justifyContent="center" mb={4}>
                <Logo />
              </Box>

              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                sx={{
                  fontWeight: 700,
                  color: "primary.main",
                  textAlign: "center",
                  mb: 4,
                }}
              >
                Application Instructions
              </Typography>

              <Typography variant="body1" paragraph sx={{ mb: 3 }}>
                Please read the following instructions carefully before proceeding.
              </Typography>

              <Typography
                variant="h5"
                component="h2"
                gutterBottom
                sx={{
                  fontWeight: 600,
                  color: "primary.dark",
                  mt: 4,
                  mb: 2,
                }}
              >
                FCT COLLEGE OF NURSING SCIENCES, GWAGWALADA, ABUJA
              </Typography>
              <Typography
                variant="h6"
                component="h3"
                gutterBottom
                sx={{ fontWeight: 600, mb: 3 }}
              >
                NOTICE OF 2025/2026 POST UTME SCREENING EXERCISE INTO ND/HND NURSING PROGRAMME AT FCT COLLEGE OF NURSING SCIENCES, GWAGWALADA, ABUJA
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Applications are invited from suitably qualified candidates for the Post-UTME screening exercise for the 2025/2026 academic session.
Interested candidates are to complete the application form online and thereafter make a non-refundable payment of <b>N2,200</b> through the Remita gateway on the application portal.
              </Typography>

              <Box
                sx={{
                  backgroundColor: "#f0f7ff",
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                  borderLeft: "4px solid #1976d2",
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, color: "primary.dark" }}
                >
                  The portal will be open from <b>Monday, 15th September, 2025</b>, and ends on <b>Sunday, 28th September 2025</b> to obtain the forms.
                  Candidates are to note that there will be no extension of the deadline for the sales of application forms.
                </Typography>
              </Box>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                1. REQUIREMENTS
              </Typography>
              <ul style={{ marginBottom: 24 }}>
                <li>
                  <Typography variant="body1" paragraph>
                    Minimum UTME Score: Candidates must have scored a minimum of 170 in the 2025 UTME conducted by the Joint Admissions and Matriculation Board (JAMB) and selected the FCT College of Nursing Sciences, Gwagwalada, Abuja, as their first choice.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    O’ Level Requirement: Applicants must possess at least five 5-credit passes including English Language, Mathematics, Chemistry, Physics and Biology in not more than two sittings in O’ Level examinations conducted by WAEC, NECO or NABTEB.
                    - O’ Level Certificate Combination: WAEC-WAEC, WAEC-NECO, NECO-NECO and NABTEB-NABTEB.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Age Requirement: Candidates must have reached the age of 16 years or above at the time of application. This is mandatory requirement for all prospective students.
                  </Typography>
                </li>
              </ul>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                2. METHOD OF APPLICATION
              </Typography>
              
              <Typography
                variant="subtitle1"
                component="h4"
                sx={{ fontWeight: 600, mt: 3, mb: 1 }}
              >
                2.1 STEP 1 - SIGN UP
              </Typography>
              <ol style={{ marginBottom: 24 }}>
                <li>
                  <Typography variant="body1" paragraph>
                    Go to{" "}
                    <Link
                      href="https://consap.fcthhss.abj.gov.ng"
                      style={{ color: "#1976d2" }}
                    >
                      https://consap.fcthhss.abj.gov.ng
                    </Link>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Read the instructions carefully
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Click the checkbox that says: "I have read and understood the instructions".
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Enter your JAMB Number and click "Validate JAMB Details". If your JAMB Number is correct, it should pull up your JAMB registration details.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Next, click on the "Continue To Account Details" button.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Enter your valid email, phone number and create a password then click next.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Next, review your information then click the "Confirm And Create Account" button.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    You will receive an email confirming your email and password.
                  </Typography>
                </li>
              </ol>

              <Typography
                variant="subtitle1"
                component="h4"
                sx={{ fontWeight: 600, mt: 3, mb: 1 }}
              >
                2.2 STEP 2 – APPLICATION
              </Typography>
              <ol style={{ marginBottom: 24 }}>
                <li>
                  <Typography variant="body1" paragraph>
                    Login with your email and password
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Once logged in, click "Apply Now" or "My Application"
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Fill the application form and proceed to payment
                  </Typography>
                </li>
              </ol>

              <Typography
                variant="subtitle1"
                component="h4"
                sx={{ fontWeight: 600, mt: 3, mb: 1 }}
              >
                2.3 STEP 3 – PAYMENT
              </Typography>
              <ol style={{ marginBottom: 24 }}>
                <li>
                  <Typography variant="body1" paragraph>
                    After completing your form, click on "Proceed To Payment"
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Next, click on "Generate RRR".
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    You can click on "Pay Online" to complete the payment online or you can copy the RRR generated and proceed to bank to complete the payment.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    After successfully making the payment, return to the portal and click on "Verify Payment".
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Once your payment is verified, your exam slip will be automatically generated.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Download and print your Exam Slip which contains your exam details including your exam date and time.
                  </Typography>
                </li>
              </ol>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                3. EXAMINATION
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Screening test will hold on the 6th, 7th and 8th October 2025. Candidates should endeavor to print the
                registration slip which carries their examination Date and Time.
              </Typography>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                4. EXAMINATION VENUE
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                FCT College of Nursing Sciences, Gwagwalada, located within University of Abuja Teaching Hospital (UATH) popularly known as Specialist Hospital
              </Typography>

              <Box
                sx={{
                  backgroundColor: "#fff8e1",
                  p: 3,
                  borderRadius: 2,
                  mb: 4,
                  borderLeft: "4px solid #ffc107",
                }}
              >
                <Typography variant="body1" paragraph sx={{ fontWeight: 600 }}>
                  Note: Any falsification of information will lead to
                  disqualification of application, thus, ensure that the
                  information provided are correct and true.
                </Typography>
              </Box>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                Enquiries
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                You can reach us for any support during the application process via the live chat on the portal or send us an email to <a href="mailto:support.consap@fcthhss.abj.gov.ng">support.consap@fcthhss.abj.gov.ng</a>.<br/>
                You can also join our Telegram channel for updates: <a target="_blank" href="https://t.me/+SWH5opeTcTXs34Ko">https://t.me/+SWH5opeTcTXs34Ko</a><br/>
              </Typography>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                Disclaimer
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                The College has not assigned anybody to act as its admission agent.
                Applicant dealing with anyone apart from the contact provided above
                does so at his/her own risk. All payments must be made through the
                designated application portal.
              </Typography>

              <Typography variant="body1" paragraph sx={{ fontStyle: "italic" }}>
                SIGNED: Management
              </Typography>

              <Box sx={{ mt: 6, textAlign: "center" }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={checked}
                      onChange={handleChange}
                      color="primary"
                      sx={{ '& .MuiSvgIcon-root': { fontSize: 32 } }}
                    />
                  }
                  label={
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      I have read and understood the instructions
                    </Typography>
                  }
                  sx={{ mb: 4 }}
                />
                
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent="center"
                  sx={{ mt: 2 }}
                >
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{ px: 4 }}
                    onClick={handleLoginClick}
                  >
                    Login
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ px: 4 }}
                    disabled={!checked}
                    onClick={handleCreateAccountClick}
                  >
                    Create Account
                  </Button>
                </Stack>
              </Box>
            </Card>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ color: "text.secondary", mt: 2 }}
            >
              © 2025. FCT College of Nursing Sciences, Gwagwalada.
              <br />
              Powered by Resilience Nigeria.
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Home;