import React from 'react';
import { Box, Paper } from '@mui/material';

interface TabConfigProps {
  id: string;
  active: boolean;
  children?: React.ReactNode;
  createCharity?: (name: string, description: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => Promise<any>;
  createOrganization?: (name: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => Promise<any>;
  createTransaction?: (charityAddress: string, amount: string, description: string) => Promise<any>;
  isLoading?: boolean;
}

const TabConfig: React.FC<TabConfigProps> = ({ 
  id, 
  active, 
  children,
  createCharity,
  createOrganization,
  createTransaction,
  isLoading 
}) => {
  return (
    <Box
      role="tabpanel"
      hidden={!active}
      id={`tabpanel-${id}`}
      aria-labelledby={`tab-${id}`}
      sx={{ 
        mt: 3, 
        width: '100%', 
        height: 'calc(100vh - 200px)',
        maxHeight: 'calc(100vh - 200px)',
        overflow: 'auto'
      }}
    >
      {active && (
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3,
            background: 'rgba(18, 18, 18, 0.6)',
            backdropFilter: 'blur(10px)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {children}
        </Paper>
      )}
    </Box>
  );
};

export default TabConfig; 