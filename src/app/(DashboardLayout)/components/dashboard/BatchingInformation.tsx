'use client';
import { useEffect, useState } from 'react';
import {
  Typography, Box,
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import api from '@/lib/api';

interface Batch {
  batchId: string;
  total_candidates: number;
}

const BatchingInformation = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBatches = async () => {
      try {
        const response = await api.get('/batched_candidates'); // adjust endpoint if needed
        setBatches(response.data);
      } catch (err) {
        console.error('Failed to fetch batching info', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBatches();
  }, []);

  return (
    <DashboardCard title="Batching Information" sx={{ p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Table
          aria-label="batching information table"
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
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2">Loading...</Typography>
                </TableCell>
              </TableRow>
            ) : batches.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2">No batching information found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              batches.map((batch, index) => (
                <TableRow key={batch.batchId}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Chip
                      label={`Batch ${batch.batchId}`}
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </DashboardCard>
  );
};

export default BatchingInformation;
