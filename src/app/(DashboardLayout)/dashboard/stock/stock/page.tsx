'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';

import Stocks from '@/app/(DashboardLayout)/components/tables/Stock2';


const SamplePage = () => {
  return (
    <PageContainer title="Stock" description="List of all stock">
      <DashboardCard >
        <Stocks/>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

