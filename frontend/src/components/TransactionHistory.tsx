import React from 'react';
import { motion } from 'framer-motion';
import { formatEther } from 'viem';
import type { Address } from 'viem';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Link,
  Chip,
  Stack,
  Paper
} from '@mui/material';
import {
  CheckCircle,
  Error,
  Warning,
  Launch,
  AccessTime
} from '@mui/icons-material';

interface Transaction {
  status: 'pending' | 'success' | 'error';
  hash: string;
  amount?: bigint | string;
  to?: Address | string;
  description?: string;
  timestamp: number;
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const getStatusChip = (status: Transaction['status']) => {
    const props = {
      pending: {
        icon: <AccessTime />,
        label: 'Pending',
        color: 'warning' as const,
        sx: { background: 'linear-gradient(45deg, #FFB74D, #FFA726)' }
      },
      success: {
        icon: <CheckCircle />,
        label: 'Success',
        color: 'success' as const,
        sx: { background: 'linear-gradient(45deg, #66BB6A, #4CAF50)' }
      },
      error: {
        icon: <Error />,
        label: 'Failed',
        color: 'error' as const,
        sx: { background: 'linear-gradient(45deg, #EF5350, #E53935)' }
      },
    };

    return (
      <Chip
        size="small"
        variant="filled"
        {...props[status]}
        sx={{
          ...props[status].sx,
          fontWeight: 500,
          '& .MuiChip-icon': {
            fontSize: 16,
          },
        }}
      />
    );
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography
        variant="h5"
        component="h2"
        sx={{
          mb: 4,
          fontWeight: 600,
          background: 'linear-gradient(45deg, #FF6B2B 30%, #FF8F5E 90%)',
          backgroundClip: 'text',
          textFillColor: 'transparent',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        }}
      >
        Transaction History
      </Typography>

      <Stack spacing={3}>
        {transactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Paper
              sx={{
                p: 4,
                textAlign: 'center',
                background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.95), rgba(20, 20, 20, 0.95))',
                boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.3), -10px -10px 20px rgba(255, 255, 255, 0.03)',
                borderRadius: 3,
                border: '1px solid rgba(255, 107, 43, 0.1)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography color="text.secondary">
                No transactions yet
              </Typography>
            </Paper>
          </motion.div>
        ) : (
          transactions.map((tx) => (
            <motion.div
              key={tx.hash}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card
                sx={{
                  background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.95), rgba(20, 20, 20, 0.95))',
                  boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.3), -10px -10px 20px rgba(255, 255, 255, 0.03)',
                  borderRadius: 3,
                  border: '1px solid rgba(255, 107, 43, 0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 0 30px rgba(255, 107, 43, 0.15)',
                    borderColor: 'rgba(255, 107, 43, 0.3)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    {getStatusChip(tx.status)}
                    <Link
                      href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        color: '#FF6B2B',
                        textDecoration: 'none',
                        fontWeight: 500,
                        '&:hover': {
                          color: '#FF8F5E',
                        },
                      }}
                    >
                      <Typography variant="body2" sx={{ mr: 0.5 }}>
                        View on Etherscan
                      </Typography>
                      <Launch sx={{ fontSize: 16 }} />
                    </Link>
                  </Box>

                  {tx.amount && (
                    <Typography variant="body1" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.9)', fontWeight: 500 }}>
                      Amount: {formatEther(tx.amount as bigint)} ETH
                    </Typography>
                  )}
                  
                  {tx.to && (
                    <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)', wordBreak: 'break-all' }}>
                      To: {tx.to}
                    </Typography>
                  )}

                  {tx.description && (
                    <Typography variant="body2" sx={{ mt: 2, color: 'rgba(255, 255, 255, 0.7)' }}>
                      {tx.description}
                    </Typography>
                  )}

                  <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'rgba(255, 255, 255, 0.5)' }}>
                    {new Date(tx.timestamp).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </Stack>
    </Box>
  );
};

export default TransactionHistory; 