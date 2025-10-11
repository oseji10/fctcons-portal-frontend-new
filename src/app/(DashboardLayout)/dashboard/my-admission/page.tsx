'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';


import Cadres from '@/app/(DashboardLayout)/components/tables/JAMB';
import Apply from '../../components/tables/Apply';
import MyExamSlips from '../../components/tables/MySlips';
import MyAdmission from '../../components/tables/MyAdmission';



const SamplePage = () => {
  return (
    <PageContainer title="My Admission" description="Admission Letter page" allowedRoles={['CANDIDATE']}>
      <DashboardCard >
        <MyAdmission/>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

