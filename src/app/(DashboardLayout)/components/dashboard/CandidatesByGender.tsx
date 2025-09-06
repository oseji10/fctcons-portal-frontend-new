'use client';
import { useEffect, useState } from 'react';
import {
  Typography, Box,
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Chip
} from '@mui/material';
import DashboardCard from '@/app/(DashboardLayout)/components/shared/DashboardCard';
import api from '@/lib/api';

interface GenderCandidates {
  gender: string;
  total_candidates: number;
}

const CandidatesByGender = () => {
  const [candidates, setCandidates] = useState<GenderCandidates[]>([]);
  const [loading, setLoading] = useState(true);

  // Map gender codes to full labels
  const genderMap: Record<string, string> = {
    M: 'Male',
    F: 'Female',
  };

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const response = await api.get('/candidates_gender'); // 👈 adjust endpoint if needed
        setCandidates(response.data);
      } catch (err) {
        console.error('Failed to fetch candidates by gender', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCandidates();
  }, []);

  return (
    <DashboardCard title="Candidates by Gender" sx={{ p: 2 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <Table
          aria-label="candidates by gender table"
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
              <TableCell>Gender</TableCell>
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
              candidates.map((item, index) => {
                const genderLabel = genderMap[item.gender] || item.gender;
                return (
                  <TableRow key={item.gender}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <Chip
                        label={genderLabel}
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
                );
              })
            )}
          </TableBody>
        </Table>
      </Paper>
    </DashboardCard>
  );
};

export default CandidatesByGender;
