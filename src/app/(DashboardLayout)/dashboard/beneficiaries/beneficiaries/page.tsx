'use client';
import { Typography } from '@mui/material';
import PageContainer from '@/app/(DashboardLayout)/components/container/PageContainer';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import Beneficiaries from '@/app/(DashboardLayout)/components/tables/Beneficiaries';
import OnboardersBeneficiaries from '@/app/(DashboardLayout)/components/tables/OnboardersBeneficiaries';
import { getStaffType } from '@/lib/auth';

const SamplePage = () => {
  // Retrieve staffType from localStorage
  const staffType = getStaffType();

  // Debug: Log staffType to verify
  console.log('SamplePage - StaffType:', staffType);

  return (
    <PageContainer title="Beneficiaries" description="List of all beneficiaries">
      <DashboardCard>
        {staffType === 'Onboarder' || staffType === 'Agent' || staffType === 'Supervisor' ? (
          <OnboardersBeneficiaries />
        ) : (
          <Beneficiaries />
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default SamplePage;