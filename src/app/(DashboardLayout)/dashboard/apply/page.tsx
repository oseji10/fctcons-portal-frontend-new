'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';


import Cadres from '@/app/(DashboardLayout)/components/tables/JAMB';
import Apply from '../../components/tables/Apply';



const SamplePage = () => {
  return (
    <PageContainer title="Cadres" description="List of all cadres">
      <DashboardCard >
        <Apply/>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

