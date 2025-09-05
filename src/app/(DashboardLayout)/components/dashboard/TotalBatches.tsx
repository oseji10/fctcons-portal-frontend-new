import dynamic from "next/dynamic";
import { useTheme } from '@mui/material/styles';
import { Typography } from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import useAnalytics from "@/lib/analytics";

const TotalBatches = () => {
  const theme = useTheme();
  const { analytics, loading } = useAnalytics();

  const total_batches = analytics?.total_batches || 0;

  return (
    <DashboardCard title="Total Batches">
      <Typography variant="h3" fontWeight="700" mt="-20px">
  {loading ? 'Loading...' : Number(total_batches ?? 0).toLocaleString()}
</Typography>

    </DashboardCard>
  );
};

export default TotalBatches;
