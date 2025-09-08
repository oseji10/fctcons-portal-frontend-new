'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';


import UsersManagement from '../../components/tables/UsersManagement';



const SamplePage = () => {
  return (
    <PageContainer title="Users Management" description="Manage user accounts and permissions" allowedRoles={['ADMIN']}>
      <DashboardCard >
        <UsersManagement/>
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;

