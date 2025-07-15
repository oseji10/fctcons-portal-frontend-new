'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';


import Cadres from '@/app/(DashboardLayout)/components/tables/JAMB';
import Apply from '../../components/tables/Apply';
import MyExamSlips from '../../components/tables/MySlips';



const SamplePage = () => {
  return (
    <PageContainer title="2025 Application" description="Application page">
      <DashboardCard >
        <MyExamSlips/>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

