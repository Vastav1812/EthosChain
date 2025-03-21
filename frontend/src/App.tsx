import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useCharityContract } from './hooks/useContract';
import { AppBar, Toolbar, Container, Typography, Box, Button, Alert, Grid, Tabs, Tab, IconButton, Drawer } from '@mui/material';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import TransactionHistory from './components/TransactionHistory';
import TransactionNotification from './components/TransactionNotification';
import TabComponent from './components/ui/TabComponent';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import type { Address } from 'viem';
import { CrossChainDonationForm } from './components/CrossChainDonationForm';
import CharityForm from './components/CharityForm';
import OrganizationForm from './components/OrganizationForm';
import TransactionForm from './components/TransactionForm';
import CharityVerification from './components/CharityVerification';
import type { VerifiedCharityData, Transaction } from './types';
import Dashboard from './components/Dashboard';
import ImpactTracker from './components/ImpactTracker';
import TransparencyReport from './components/TransparencyReport';
import ContractVerification from './components/ContractVerification';
import RecurringDonations from './components/RecurringDonations';
import { DashboardIcon, VolunteerActivismIcon, AddIcon, AddBusinessIcon, VerifiedIcon, SecurityIcon, RepeatIcon, LinkIcon, AssessmentIcon, DescriptionIcon, HistoryIcon, CloseIcon } from './components/icons';

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

function App() {
  const { createCharity, createOrganization, createTransaction, isLoading } = useCharityContract();
  const { isConnected, address } = useAccount();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState<{ message: string; open: boolean } | null>(null);
  const [transactionHistoryOpen, setTransactionHistoryOpen] = useState(false);
  const [tabGroupIndex, setTabGroupIndex] = useState(0);
  
  // Check wallet connection
  useEffect(() => {
    if (!isConnected) {
      setError('Please connect your wallet to interact with the contract');
    } else {
      setError(null);
    }
  }, [isConnected]);

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleTabGroupChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabGroupIndex(newValue);
    // Reset active tab to first tab in the new group
    setActiveTab(0);
  };

  const getTabContent = (key: string) => {
    // Map tab keys to their respective components
    const loading = isLoading === undefined ? false : isLoading;
    
    switch (key) {
      case 'dashboard':
        return <Dashboard isLoading={loading} />;
      case 'create-charity':
        return <CharityForm 
          isLoading={loading}
          createCharity={wrappedCreateCharity} 
        />;
      case 'create-organization':
        return <OrganizationForm 
          isLoading={loading}
          createOrganization={wrappedCreateOrganization} 
        />;
      case 'create-transaction':
        return <TransactionForm 
          isLoading={loading}
          createTransaction={wrappedCreateTransaction} 
        />;
      case 'recurring-donations':
        return <RecurringDonations isLoading={loading} />;
      case 'cross-chain-donation':
        return <CrossChainDonationForm />;
      case 'charity-verification':
        return <CharityVerification 
          isLoading={loading}
          onVerifiedCharitySelect={handleVerifiedCharitySelect} 
        />;
      case 'impact-tracker':
        return <ImpactTracker isLoading={loading} />;
      case 'transparency-reports':
        return <TransparencyReport isLoading={loading} />;
      case 'contract-verification':
        return <ContractVerification isLoading={loading} />;
      default:
        return <Box>Content not found</Box>;
    }
  };

  // Group tabs into logical categories
  const tabGroups = useMemo(() => ({
    main: [
      {
        id: 'dashboard',
        label: 'Stats',
        icon: <DashboardIcon />,
      },
      {
        id: 'create-transaction',
        label: 'Donate',
        icon: <VolunteerActivismIcon />
      }
    ],
    creation: [
      {
        id: 'create-charity', 
        label: 'New Charity',
        icon: <AddIcon />
      },
      {
        id: 'create-organization',
        label: 'New Org',
        icon: <AddBusinessIcon />
      }
    ],
    verification: [
      {
        id: 'charity-verification',
        label: 'Verify NGO',
        icon: <VerifiedIcon />
      },
      {
        id: 'contract-verification',
        label: 'Verify SC',
        icon: <SecurityIcon />
      }
    ],
    features: [
      {
        id: 'recurring-donations',
        label: 'Recurring',
        icon: <RepeatIcon />
      },
      {
        id: 'cross-chain-donation',
        label: 'Cross-Chain',
        icon: <LinkIcon />
      },
      {
        id: 'impact-tracker',
        label: 'Impact',
        icon: <AssessmentIcon />
      },
      {
        id: 'transparency-reports',
        label: 'Reports',
        icon: <DescriptionIcon />
      }
    ]
  }), []);
  
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
      
      // Show notification for successful transaction
      setNotification({
        message: `Transaction successful: ${details.description || 'Transaction completed'}`,
        open: true
      });
      
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
  const wrappedCreateCharity = useCallback(async (
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
  }, [createCharity, handleTransaction]);

  const wrappedCreateOrganization = useCallback(async (
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
  }, [createOrganization, handleTransaction]);

  const wrappedCreateTransaction = useCallback(async (
    charityAddress: string,
    amount: string,
    description: string
  ) => {
    console.log('wrappedCreateTransaction called with:', { charityAddress, amount, description });
    const amountValue = amount.replace(' ETH', '');
    return handleTransaction(
      createTransaction(charityAddress, address as string, amountValue, description),
      { 
        description: description || `Donation to charity`,
        to: charityAddress,
        amount: amountValue
      }
    );
  }, [createTransaction, handleTransaction, address]);

  const handleVerifiedCharitySelect = useCallback((charity: VerifiedCharityData) => {
    // Here we can handle the verified charity data
    // For example, we could create the charity in our contract using the verified data
    if (createCharity) {
      // Create the charity on the blockchain
      createCharity(
        charity.name,
        charity.description || '',
        charity.taxId || '000000000', // Use tax ID as bank account if available
        charity.verificationSource || 'External API',
        charity.address || '', // Physical address from API
        '0' // No initial funds
      ).then(() => {
        showNotification(`Verified charity ${charity.name} added successfully!`);
      }).catch(error => {
        console.error('Error adding verified charity:', error);
        showNotification(`Error adding charity: ${error.message}`);
      });
    }
  }, [createCharity]);

  const showNotification = (message: string) => {
    setNotification({ message, open: true });
  };

  const closeNotification = () => {
    setNotification(prev => prev ? { ...prev, open: false } : null);
  };

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
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                color="inherit" 
                onClick={() => setTransactionHistoryOpen(true)}
                sx={{
                  position: 'relative',
                  '&::after': transactions.length > 0 ? {
                    content: '""',
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    width: 12,
                    height: 12,
                    backgroundColor: '#ff6b2b',
                    borderRadius: '50%'
                  } : {}
                }}
              >
                <HistoryIcon />
              </IconButton>
              <ConnectButton 
                showBalance={true}
                chainStatus="icon"
                accountStatus="address"
              />
            </Box>
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
            <Grid item xs={12}>
              {/* Tab category selection */}
              <Box sx={{ mb: 4 }}>
                <Tabs
                  value={tabGroupIndex}
                  onChange={handleTabGroupChange}
                  variant="standard"
                  centered
                >
                  <Tab label="Main" />
                  <Tab label="Create" />
                  <Tab label="Verify" />
                  <Tab label="Features" />
                </Tabs>
              </Box>
              
              {/* Tab navigation */}
              <TabComponent
                tabs={Object.values(tabGroups)[tabGroupIndex].map(tab => ({
                  id: tab.id,
                  label: tab.label,
                  icon: tab.icon,
                  active: activeTab === 0
                }))}
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
              
              <Box sx={{ mt: 3 }}>
                {getTabContent(
                  Object.values(tabGroups)[tabGroupIndex][activeTab]?.id || 'dashboard'
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
        
        <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
          {notification && (
            <TransactionNotification
              transactions={transactions}
              message={notification.message}
              open={notification.open}
              onClose={closeNotification}
            />
          )}
        </Box>

        {/* Add a drawer for transaction history */}
        <Drawer
          anchor="right"
          open={transactionHistoryOpen}
          onClose={() => setTransactionHistoryOpen(false)}
        >
          <Box sx={{ width: 320, p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">Transaction History</Typography>
              <IconButton onClick={() => setTransactionHistoryOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            <TransactionHistory transactions={transactions} />
          </Box>
        </Drawer>
      </Box>
    </ThemeProvider>
  );
}

export default App;
