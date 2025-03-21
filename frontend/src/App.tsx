import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useCharityContract } from './hooks/useCharityContract';
import { AppBar, Toolbar, Container, Typography, Box, Button, Alert, Grid } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import TransactionHistory from './components/TransactionHistory';
import TransactionNotification from './components/TransactionNotification';
import TabComponent from './components/ui/TabComponent';
import tabs from './constants/tabConfig';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { parseEther } from 'viem';
import type { Address } from 'viem';

// Create dark theme with orange accents
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#ff6b2b',
    },
    secondary: {
      main: '#2dbd6e',
    },
    background: {
      default: '#121212',
      paper: 'rgba(18, 18, 18, 0.8)',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 500,
    },
    h6: {
      fontWeight: 500,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '*:focus': {
          outline: 'none',
        },
        '.Mui-focusVisible': {
          outline: '2px solid rgba(255, 107, 43, 0.8) !important',
          outlineOffset: '2px !important',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          padding: '10px 24px',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 0 20px rgba(255, 107, 43, 0.5)',
            transform: 'translateY(-2px)',
          },
          '&:focus': {
            outline: 'none',
          },
          '&.Mui-focusVisible': {
            outline: '2px solid rgba(255, 107, 43, 0.8)',
            outlineOffset: '2px',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
          '&:hover': {
            background: 'linear-gradient(45deg, #ff5a17, #ff8534)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0 0 15px rgba(0, 0, 0, 0.2)',
          backdropFilter: 'blur(10px)',
          background: 'rgba(18, 18, 18, 0.8)',
          borderBottom: '1px solid rgba(255, 107, 43, 0.1)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
          background: 'rgba(30, 30, 30, 0.7)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            '& fieldset': {
              borderColor: 'rgba(255, 107, 43, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 107, 43, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'rgba(255, 107, 43, 0.8)',
            },
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          '&:focus': {
            outline: 'none',
          },
          '&.Mui-focusVisible': {
            outline: '2px solid rgba(255, 107, 43, 0.8)',
            outlineOffset: '-2px',
            borderRadius: '4px',
          },
        },
      },
    },
  },
});

interface Transaction {
  status: 'pending' | 'success' | 'error';
  hash: string;
  amount?: bigint | string;
  to?: Address | string;
  description?: string;
  timestamp: number;
}

// Update the tab content components to use the actual contract functions
const updateTabsWithContractFunctions = (
  createCharity: (name: string, description: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => Promise<any>,
  createOrganization: (name: string, bankAccount: string, bankName: string, address: string, etherCoins: string) => Promise<any>,
  createTransaction: (charityAddress: string, amount: string, description: string) => Promise<any>,
  isLoading: boolean
) => {
  return tabs.map(tab => {
    if (tab.id === 'charity') {
      const CharityContent = tab.content;
      return {
        ...tab,
        content: ({ id, active }: { id: string; active: boolean }) => (
          <CharityContent
            id={id}
            active={active}
            createCharity={createCharity}
            isLoading={isLoading}
          />
        )
      };
    }
    if (tab.id === 'organization') {
      const OrganizationContent = tab.content;
      return {
        ...tab,
        content: ({ id, active }: { id: string; active: boolean }) => (
          <OrganizationContent
            id={id}
            active={active}
            createOrganization={createOrganization}
            isLoading={isLoading}
          />
        )
      };
    }
    if (tab.id === 'transaction') {
      const TransactionContent = tab.content;
      return {
        ...tab,
        content: ({ id, active }: { id: string; active: boolean }) => (
          <TransactionContent
            id={id}
            active={active}
            createTransaction={createTransaction}
            isLoading={isLoading}
          />
        )
      };
    }
    return tab;
  });
};

function App() {
  const { createCharity, createOrganization, createTransaction, isLoading } = useCharityContract();
  const { isConnected, address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  // Check wallet connection
  useEffect(() => {
    if (!isConnected) {
      setError('Please connect your wallet to interact with the contract');
    } else {
      setError(null);
    }
  }, [isConnected]);

  const handleTransaction = useCallback(async (
    promise: Promise<any>,
    details: { amount?: bigint | string; to?: Address | string; description?: string }
  ) => {
    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }

      const tx = await promise;
      
      // Add pending transaction
      const pendingTx: Transaction = {
        status: 'pending',
        hash: tx?.result || tx?.hash || 'pending-' + Date.now(),
        ...details,
        timestamp: Date.now()
      };
      setTransactions(prev => [...prev, pendingTx]);
      
      // Update to success
      setTransactions(prev => 
        prev.map(t => 
          t.hash === (tx?.result || tx?.hash) 
            ? { ...t, status: 'success' }
            : t
        )
      );
      
      return tx;
    } catch (error) {
      console.error('Transaction error:', error);
      // Add failed transaction
      const errorTx: Transaction = {
        status: 'error',
        hash: 'error-' + Date.now(),
        ...details,
        timestamp: Date.now()
      };
      setTransactions(prev => [...prev, errorTx]);
      throw error;
    }
  }, [isConnected]);

  // Wrap contract functions with transaction tracking
  const wrappedCreateCharity = async (
    name: string,
    description: string,
    bankAccount: string,
    bankName: string,
    address: string,
    etherCoins: string
  ) => {
    console.log('wrappedCreateCharity called with:', { name, description, bankAccount, bankName, address, etherCoins });
    return handleTransaction(
      createCharity(name, description, bankAccount, bankName, address, etherCoins),
      { description: `Create charity: ${name}` }
    );
  };

  const wrappedCreateOrganization = async (
    name: string,
    bankAccount: string,
    bankName: string,
    address: string,
    etherCoins: string
  ) => {
    console.log('wrappedCreateOrganization called with:', { name, bankAccount, bankName, address, etherCoins });
    return handleTransaction(
      createOrganization(name, bankAccount, bankName, address, etherCoins),
      { description: `Create organization: ${name}`, to: address }
    );
  };

  const wrappedCreateTransaction = async (
    charityAddress: string,
    amount: string,
    description: string
  ) => {
    console.log('wrappedCreateTransaction called with:', { charityAddress, amount, description });
    const amountValue = amount.replace(' ETH', '');
    return handleTransaction(
      createTransaction(charityAddress, address as string, amount),
      { 
        description: description || `Donation to charity`,
        to: charityAddress,
        amount: amountValue
      }
    );
  };

  const updatedTabs = useMemo(
    () => updateTabsWithContractFunctions(
      wrappedCreateCharity,
      wrappedCreateOrganization,
      wrappedCreateTransaction,
      isLoading
    ),
    [wrappedCreateCharity, wrappedCreateOrganization, wrappedCreateTransaction, isLoading]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ position: 'relative', minHeight: '100vh', overflow: 'hidden', 
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
      }}>
        
        <AppBar position="sticky" elevation={0}>
          <Toolbar>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              flexGrow: 1 
            }}>
              <img 
                src="/ethoschain-logo.svg" 
                alt="EthosChain Logo" 
                width="40" 
                height="40"
                style={{ 
                  filter: 'drop-shadow(0 0 10px rgba(255, 107, 43, 0.5))'
                }}
              />
              <Typography variant="h5" component="div" sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 15px rgba(255, 107, 43, 0.3)',
                letterSpacing: '0.5px'
              }}>
                EthosChain
              </Typography>
            </Box>
            
            <ConnectButton 
              showBalance={true}
              chainStatus="icon"
              accountStatus="address"
            />
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg" sx={{ mt: 4 }}>
          {error && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}
          
          {/* Add faucet button with conditional text */}
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={(e) => {
                e.preventDefault();
                // If not connected, first connect wallet
                if (!isConnected) {
                  document.querySelector('[data-testid="rk-connect-button"]')?.dispatchEvent(
                    new MouseEvent('click', { bubbles: true })
                  );
                } else {
                  // Open a modal or separate window with faucet options
                  window.open('https://sepoliafaucet.com/', '_blank');
                }
              }}
              startIcon={<img src="/metamask.svg" width="20" height="20" alt="MetaMask" />}
              sx={{
                background: 'linear-gradient(45deg, #ff6b2b, #ff9142)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #ff5a17, #ff8534)',
                  boxShadow: '0 0 20px rgba(255, 107, 43, 0.5)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {isConnected ? 'Get Test ETH on Sepolia' : 'Connect Wallet & Get Test ETH'}
            </Button>
          </Box>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <TabComponent tabs={updatedTabs} />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TransactionHistory transactions={transactions} />
            </Grid>
          </Grid>
        </Container>
        
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          <TransactionNotification transactions={transactions} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
