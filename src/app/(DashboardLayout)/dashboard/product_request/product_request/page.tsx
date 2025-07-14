'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

import Ministries from '@/app/(DashboardLayout)/components/tables/Ministries';
import ProductRequests from '@/app/(DashboardLayout)/components/tables/ProductRequest';



const SamplePage = () => {
  return (
    <PageContainer title="Product request" description="List of all requested products">
      <DashboardCard >
        {/* <Typography>All Nominees</Typography> */}
        {/* <NomineesTable/> */}
        <ProductRequests/>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

