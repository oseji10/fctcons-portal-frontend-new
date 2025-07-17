'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components

import SignedUp from '../components/dashboard/SignedUp';
import CompletedForms from '../components/dashboard/CompletedForms';
import CompletedPayments from '../components/dashboard/CompletedPayments';
import CashGenerated from '../components/dashboard/CashGenerated';
import BatchedCandidates from '../components/dashboard/BatchedCandidates';
import ReBatchedCandidates from '../components/dashboard/ReBatchedCandidates';
import RecentPayments from '../components/dashboard/RecentPayments';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            {/* <SalesOverview /> */}
            <SignedUp />
            
          </Grid>
          <Grid item xs={12} lg={4}>
             <CompletedForms/>
          </Grid>

          <Grid item xs={12} lg={4}>
             <CompletedPayments/>
          </Grid>

          <Grid item xs={12} lg={4}>
             <CashGenerated/>
          </Grid>

          <Grid item xs={12} lg={4}>
             <BatchedCandidates/>
          </Grid>

          <Grid item xs={12} lg={4}>
             <ReBatchedCandidates/>
          </Grid>

          <Grid item xs={12} lg={12}>
            <RecentPayments />
          </Grid>
          
          {/* <Grid item xs={12} lg={4}>
            <RecentTransactions />
          </Grid>
          <Grid item xs={12} lg={8}>
            <ProductPerformance />
          </Grid> */}
          {/* <Grid item xs={12}>
            <Blog />
          </Grid> */}
        </Grid>
      </Box>
    </PageContainer>
  )
}

export default Dashboard;
