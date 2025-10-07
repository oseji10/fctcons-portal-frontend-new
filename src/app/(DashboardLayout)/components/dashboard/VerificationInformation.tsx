'use client';
import { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import api from '@/lib/api';

interface Batch {
  batch: string;
  total_candidates: number;
  verified_by_user: number;
}

const VerificationInformation = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await api.get('/verified_candidates'); // endpoint returns the new structure
        setBatches(response.data);
      } catch (err) {
        console.error('Failed to fetch verification info', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  return (
    <DashboardCard title="Verification Information" sx={{ p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Table
          aria-label="verification information table"
          sx={{
            whiteSpace: 'nowrap',
            '& th': {
              backgroundColor: 'primary.main',
              color: 'white',
              fontWeight: 600,
              textTransform: 'uppercase',
            },
            '& td': {
              fontSize: '0.95rem',
            },
            '& tr:nth-of-type(odd)': {
              backgroundColor: 'grey.50',
            },
            '& tr:hover': {
              backgroundColor: 'grey.100',
              transition: '0.2s',
            },
          }}
        >
          <TableHead>
            <TableRow>
              <TableCell>SN</TableCell>
              <TableCell>Batch ID</TableCell>
              <TableCell align="right">Total Candidates</TableCell>
              <TableCell align="right">Verified by You</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Typography variant="body2">
                    No verification information found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              batches.map((batch, index) => (
                <TableRow key={batch.batch}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Chip
                      label={`Batch ${batch.batch}`}
                      color="secondary"
                      sx={{
                        fontWeight: 600,
                        fontSize: '0.9rem',
                        px: 1,
                        borderRadius: 2,
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" fontWeight={600} color="primary">
                      {batch.total_candidates}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6" fontWeight={600} color="secondary">
                      {batch.verified_by_user}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </DashboardCard>
  );
};

export default VerificationInformation;
