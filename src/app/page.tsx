"use client";

import { Grid, Box, Card, Stack, Typography, Button, FormControlLabel, Checkbox } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Logo from "./(DashboardLayout)/dashboard/layout/shared/logo/Logo";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script"; // Import next/script

const Home = () => {
  const [checked, setChecked] = useState(false);

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
                Applications are invited from suitable/qualified candidates for Post UTME form for the 2025/2026 academic session.
                Interested candidates are expected to obtain application forms online, upon payment of a non-refundable fee of <b>N2,200</b>. Payment should be made using the Remita gateway via the application portal.
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
                  The portal will be open from <b>Monday, 8th September, 2025</b>, and ends on <b>Wednesday, 23rd September 2025</b> to obtain the forms.
                  Candidates are to note that there will be no extension of the deadline for the sales of application forms.
                </Typography>
              </Box>

              {/* <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                Programme Duration
              </Typography>
              <ul style={{ marginBottom: 24 }}>
                <li>
                  <Typography variant="body1" paragraph>
                    National Diploma in Nursing: Two (2) years National Diploma plus two (2) years Higher National Diploma. Total four (4) years.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Basic Midwifery: Three (3) years.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Post Basic Nursing: Eighteen (18) months.
                  </Typography>
                </li>
              </ul> */}

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                Requirements
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
                Method of Application
              </Typography>
              <ol style={{ marginBottom: 24 }}>
                <li>
                  <Typography variant="body1" paragraph>
                    Visit{" "}
                    <Link
                      href="https://consap.fcthhss.abj.gov.ng"
                      style={{ color: "#1976d2" }}
                    >
                      https://consap.fcthhss.abj.gov.ng
                    </Link>{" "}
                    and read the instructions carefully
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Click on "Create Account"
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Provide the necessary information on the signup form, then
                    Click on Sign Up.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Login to your dashboard and complete your application
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Make payment for your application
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    After payment, you will be redirected to a page to print your
                    exam slip.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    You can reprint your slip and payment confirmation slips at
                    anytime by login in to your dashboard
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Please note that your examination slip contains your exam
                    date and time.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <b>Note:</b> Ensure you bring the printed examination slip on the day of your test. Candidates who fail to present this slip will not be allowed to take the test.
                  </Typography>
                </li>
              </ol>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                Payment Details
              </Typography>
              <ul style={{ marginBottom: 24 }}>
                <li>
                  <Typography variant="body1" paragraph>
                    All Candidates are to pay a non-refundable fee of
                    <b> N2,200 Naira only.</b>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Print Your Registration Slip: Ensure you print your
                    registration slip, as it will be a mandatory requirement
                    during your visit to the school for the screening test.
                  </Typography>
                </li>
              </ul>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                Method of Screening
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 2 }}>
                Computer Based Test (CBT):
              </Typography>
              <ul style={{ marginBottom: 24 }}>
                <li>
                  <Typography variant="body1" paragraph>
                    Screening subjects for National Diploma in Nursing: English,
                    Physics, Chemistry, Biology & Current Affairs.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Screening subjects for Basic Midwifery: English, Physics,
                    Chemistry, Biology & Current Affairs.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    Screening subjects for Post Basic Nursing: Professional,
                    English, Biology & Current Affairs.
                  </Typography>
                </li>
              </ul>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                Examination
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Screening test will commence on the 29th September and end on 1st October, 2025. Candidates should endeavor to print the
                registration slip which carries their examination Date and Time.
              </Typography>

              <Typography
                variant="h6"
                component="h3"
                sx={{ fontWeight: 600, mt: 4, mb: 2 }}
              >
                Examination Venue
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                FCT College of Nursing Sciences, Gwagwalada, located within University of Abuja Teaching Hospital (UATH) formerly known as Specialist Hospital
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
                07039837749 / 08036625119 (08082775076-whatsapp only)<br/><br/>
                You can reach us for any support during the application process via the contact details above or through the live chat on the portal or send us an email to <a href="mailto:support.consap@fcthhss.abj.gov.ng">support.consap@fcthhss.abj.gov.ng</a>.<br/>
                You can also join our Telegram channel for updates: <a target="_blank" href="https://t.me/+SWH5opeTcTXs34Ko">https://t.me/+SWH5opeTcTXs34Ko</a><br/>
                {/* If you'd like to stay updated and be part of our community, connect with us on Facebook by clicking the link below to join our group:  <a target="_blank" href="https://www.facebook.com/share/g/ZU73U7cfqjmuRcyf/?mibextid=A7sQZp">https://www.facebook.com/share/g/ZU73U7cfqjmuRcyf/?mibextid=A7sQZp</a> */}
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