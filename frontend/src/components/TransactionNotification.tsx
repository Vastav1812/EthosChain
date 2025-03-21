import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatEther } from 'viem';
import type { Address } from 'viem';
import { Alert, AlertTitle, Box, Link, Typography } from '@mui/material';
import { CheckCircle, Error, Warning, Launch } from '@mui/icons-material';

interface Transaction {
  status: 'pending' | 'success' | 'error';
  hash: string;
  amount?: bigint | string;
  to?: Address | string;
  description?: string;
  timestamp: number;
}

interface TransactionNotificationProps {
  transactions: Transaction[];
}

const TransactionNotification: React.FC<TransactionNotificationProps> = ({ transactions }) => {
  const getSeverity = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return 'success';
      case 'error':
        return 'error';
      case 'pending':
        return 'warning';
      default:
        return 'info';
    }
  };

  const getIcon = (status: Transaction['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle sx={{ color: '#66BB6A' }} />;
      case 'error':
        return <Error sx={{ color: '#EF5350' }} />;
      case 'pending':
        return <Warning sx={{ color: '#FFB74D' }} />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 32,
        right: 32,
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        width: '100%'
      }}
    >
      <AnimatePresence>
        {transactions.slice(-3).map((tx) => (
          <motion.div
            key={tx.hash}
            initial={{ opacity: 0, x: 50, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 50, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <Alert
              severity={getSeverity(tx.status)}
              icon={getIcon(tx.status)}
              sx={{
                background: 'linear-gradient(145deg, rgba(25, 25, 25, 0.95), rgba(20, 20, 20, 0.95))',
                boxShadow: '10px 10px 20px rgba(0, 0, 0, 0.3), -10px -10px 20px rgba(255, 255, 255, 0.03)',
                borderRadius: 3,
                border: '1px solid rgba(255, 107, 43, 0.1)',
                backdropFilter: 'blur(10px)',
                '& .MuiAlert-icon': {
                  alignItems: 'center',
                },
                '& .MuiAlert-message': {
                  color: 'rgba(255, 255, 255, 0.9)',
                },
              }}
              action={
                <Link
                  href={`https://sepolia.etherscan.io/tx/${tx.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: '#FF6B2B',
                    '&:hover': {
                      color: '#FF8F5E',
                    },
                  }}
                >
                  <Launch sx={{ fontSize: 16, ml: 1 }} />
                </Link>
              }
            >
              <AlertTitle sx={{ 
                color: 'white',
                fontWeight: 600,
                textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)',
              }}>
                {tx.status === 'pending' && 'Transaction Pending'}
                {tx.status === 'success' && 'Transaction Successful'}
                {tx.status === 'error' && 'Transaction Failed'}
              </AlertTitle>
              
              <Box sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                {tx.amount && (
                  <Typography variant="body2" sx={{ 
                    mt: 0.5,
                    fontWeight: 500,
                  }}>
                    Amount: {formatEther(tx.amount as bigint)} ETH
                  </Typography>
                )}
                {tx.to && (
                  <Typography variant="body2" sx={{ mt: 0.5 }} noWrap>
                    To: {tx.to}
                  </Typography>
                )}
                {tx.description && (
                  <Typography variant="body2" sx={{ mt: 0.5 }}>
                    {tx.description}
                  </Typography>
                )}
                <Typography variant="caption" sx={{ 
                  display: 'block',
                  mt: 1,
                  color: 'rgba(255, 255, 255, 0.5)',
                }}>
                  {new Date(tx.timestamp).toLocaleString()}
                </Typography>
              </Box>
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default TransactionNotification; 