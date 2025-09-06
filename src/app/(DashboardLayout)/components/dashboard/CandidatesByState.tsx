'use client';
import { useEffect, useState } from 'react';
import {
  Typography, Box,
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import api from '@/lib/api';

interface StateCandidates {
  state: string;
  total_candidates: number;
}

const CandidatesByState = () => {
  const [candidates, setCandidates] = useState<StateCandidates[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get('/candidates_states'); // 👈 adjust endpoint if needed
        setCandidates(response.data);
      } catch (err) {
        console.error('Failed to fetch candidates by state', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <DashboardCard title="Candidates by State of Origin" sx={{ p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Table
          aria-label="candidates by state table"
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
              <TableCell>State</TableCell>
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
            ) : candidates.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <Typography variant="body2">No candidate data found.</Typography>
                </TableCell>
              </TableRow>
            ) : (
              candidates.map((item, index) => (
                <TableRow key={item.state}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Chip
                      label={item.state}
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
                      {item.total_candidates}
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

export default CandidatesByState;
