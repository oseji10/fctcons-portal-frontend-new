'use client'
import { Grid, Box } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
// components
import SalesOverview from '@/app/(DashboardLayout)/components/dashboard/SalesOverview';
import YearlyBreakup from '@/app/(DashboardLayout)/components/dashboard/YearlyBreakup';
import RecentTransactions from '@/app/(DashboardLayout)/components/dashboard/RecentTransactions';
import ProductPerformance from '@/app/(DashboardLayout)/components/dashboard/ProductPerformance';
import Blog from '@/app/(DashboardLayout)/components/dashboard/Blog';
import MonthlyEarnings from '@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings';
import TotalRevenue from '../components/dashboard/TotalRevenue';
import TotalOrders from '../components/dashboard/TotalOrders';
import TotalCreditSales from '../components/dashboard/TotalCreditSales';
import TotalCashSales from '../components/dashboard/TotalCashSales';
import TotalProducts from '../components/dashboard/TotalProducts';
import TotalUsers from '../components/dashboard/TotalUsers';
import RecentSalesTransactions from '../components/dashboard/RecentSalesTransactions';

const Dashboard = () => {
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            {/* <SalesOverview /> */}
            <TotalRevenue />
            
          </Grid>
          <Grid item xs={12} lg={4}>
             <TotalOrders/>
          </Grid>

          <Grid item xs={12} lg={4}>
             <TotalCreditSales/>
          </Grid>

          <Grid item xs={12} lg={4}>
             <TotalCashSales/>
          </Grid>

          <Grid item xs={12} lg={4}>
             <TotalProducts/>
          </Grid>

          <Grid item xs={12} lg={4}>
             <TotalUsers/>
          </Grid>

          <Grid item xs={12} lg={12}>
            <RecentSalesTransactions />
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
